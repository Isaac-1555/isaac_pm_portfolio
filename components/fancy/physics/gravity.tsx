"use client"

import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { calculatePosition } from "@/lib/utils/calculate-position"
import { parsePathToVertices } from "@/lib/utils/svg-path-to-vertices"
import { debounce } from "lodash"
import Matter, {
  Bodies,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
} from "matter-js"
// @ts-expect-error poly-decomp has no types
import polyDecompModule from "poly-decomp"

import { cn } from "@/lib/utils"

type GravityProps = {
  children: ReactNode
  debug?: boolean
  gravity?: { x: number; y: number }
  resetOnResize?: boolean
  grabCursor?: boolean
  addTopWall?: boolean
  autoStart?: boolean
  stopWhenSettled?: boolean
  className?: string
}

type PhysicsBody = {
  element: HTMLElement
  body: Matter.Body
  props: MatterBodyProps
}

type MatterBodyProps = {
  children: ReactNode
  matterBodyOptions?: Matter.IBodyDefinition
  isDraggable?: boolean
  bodyType?: "rectangle" | "circle" | "svg"
  sampleLength?: number
  x?: number | string
  y?: number | string
  angle?: number
  className?: string
}

export type GravityRef = {
  start: () => void
  stop: () => void
  reset: () => void
}

const GravityContext = createContext<{
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps
  ) => void
  unregisterElement: (id: string) => void
} | null>(null)

export const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const idRef = useRef(`mb-${reactId}`)
  const context = useContext(GravityContext)

  const memoOptions = JSON.stringify(matterBodyOptions)
  const memoProps = JSON.stringify(props)
  useEffect(() => {
    if (!elementRef.current || !context) return
    const id = idRef.current
    context.registerElement(id, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    })

    return () => context.unregisterElement(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    context,
    children,
    memoOptions,
    bodyType,
    sampleLength,
    isDraggable,
    x,
    y,
    angle,
    memoProps,
  ])

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute",
        className,
        isDraggable && "pointer-events-none"
      )}
    >
      {children}
    </div>
  )
}

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      stopWhenSettled = false,
      className,
      ...props
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null)
    const engine = useRef(Engine.create())
    const render = useRef<Render>(undefined)
    const runner = useRef<Runner>(undefined)
    const bodiesMap = useRef(new Map<string, PhysicsBody>())
    const frameId = useRef<number>(undefined)
    const mouseConstraint = useRef<Matter.MouseConstraint>(undefined)
    const mouseDown = useRef(false)
    const settledFrames = useRef(0)
    const cleanupsRef = useRef<Array<() => void>>([])
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

    const isRunning = useRef(false)

    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvas.current) return
        const width = element.offsetWidth
        const height = element.offsetHeight
        const canvasRect = canvas.current!.getBoundingClientRect()

        const angle = (props.angle || 0) * (Math.PI / 180)

        const x = calculatePosition(props.x, canvasRect.width, width)
        const y = calculatePosition(props.y, canvasRect.height, height)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { chamfer: _chamfer, ...bodyOptions } =
          (props.matterBodyOptions ?? {}) as Matter.IBodyDefinition

        let body
        if (props.bodyType === "circle") {
          const radius = Math.max(width, height) / 2
          body = Bodies.circle(x, y, radius, {
            ...bodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        } else if (props.bodyType === "svg") {
          const paths = element.querySelectorAll("path")
          const vertexSets: Matter.Vector[][] = []

          paths.forEach((path) => {
            const d = path.getAttribute("d")
            const p = parsePathToVertices(d!, props.sampleLength)
            vertexSets.push(p)
          })

          body = Bodies.fromVertices(x, y, vertexSets, {
            ...bodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        } else {
          body = Bodies.rectangle(x, y, width, height, {
            ...bodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        }

        if (body) {
          World.add(engine.current.world, [body])
          bodiesMap.current.set(id, { element, body, props })
        }
      },
      [debug]
    )

    const unregisterElement = useCallback((id: string) => {
      const body = bodiesMap.current.get(id)
      if (body) {
        World.remove(engine.current.world, body.body)
        bodiesMap.current.delete(id)
      }
    }, [])

    const updateElements = useCallback(() => {
      let totalSpeed = 0
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position
        const rotation = body.angle * (180 / Math.PI)
        const v = body.velocity
        totalSpeed += Math.abs(v.x) + Math.abs(v.y) + Math.abs(body.angularVelocity)

        element.style.transform = `translate(${
          x - element.offsetWidth / 2
        }px, ${y - element.offsetHeight / 2}px) rotate(${rotation}deg)`
      })

      if (stopWhenSettled && bodiesMap.current.size > 0) {
        if (totalSpeed < 0.05) {
          settledFrames.current += 1
          if (settledFrames.current > 30 && isRunning.current) {
            isRunning.current = false
            if (runner.current) Runner.stop(runner.current)
            if (render.current) Render.stop(render.current)
            cancelAnimationFrame(frameId.current!)
            frameId.current = undefined
            return
          }
        } else {
          settledFrames.current = 0
        }
      }

      frameId.current = requestAnimationFrame(updateElements)
    }, [stopWhenSettled])

    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return

      const height = canvas.current.offsetHeight
      const width = canvas.current.offsetWidth

      Common.setDecomp(polyDecompModule)

      engine.current.gravity.x = gravity.x
      engine.current.gravity.y = gravity.y

      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
        },
      })

      const mouse = Mouse.create(render.current.canvas)
      mouseConstraint.current = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: debug,
          },
        },
      })

      const walls = [
        Bodies.rectangle(width / 2, height + 10, width, 20, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
        Bodies.rectangle(width + 10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
        Bodies.rectangle(-10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
      ]

      const topWall = addTopWall
        ? Bodies.rectangle(width / 2, -10, width, 20, {
            isStatic: true,
            friction: 1,
            render: { visible: debug },
          })
        : null

      if (topWall) {
        walls.push(topWall)
      }

      const touchingMouse = () =>
        Query.point(
          engine.current.world.bodies,
          mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
        ).length > 0

      const releaseConstraint = () => {
        mouseDown.current = false
        if (mouseConstraint.current) {
          // matter.js types declare `body: Body` but the engine accepts null to release
          ;(mouseConstraint.current as { body: Matter.Body | null }).body = null
          if (mouseConstraint.current.constraint) {
            mouseConstraint.current.constraint.pointA = { x: 0, y: 0 }
          }
        }
        if (canvas.current) {
          canvas.current.style.cursor = touchingMouse() ? "grab" : "default"
        }
      }

      const onPointerDown = () => {
        mouseDown.current = true
        settledFrames.current = 0
        if (!isRunning.current) {
          if (runner.current) {
            runner.current.enabled = true
            Runner.run(runner.current, engine.current)
          }
          if (render.current && debug) Render.run(render.current)
          isRunning.current = true
          frameId.current = requestAnimationFrame(updateElements)
        }
        if (canvas.current) {
          canvas.current.style.cursor = touchingMouse()
            ? "grabbing"
            : "default"
        }
      }

      if (grabCursor) {
        Events.on(engine.current, "beforeUpdate", () => {
          if (canvas.current) {
            if (!mouseDown.current && !touchingMouse()) {
              canvas.current.style.cursor = "default"
            } else if (touchingMouse()) {
              canvas.current.style.cursor = mouseDown.current
                ? "grabbing"
                : "grab"
            }
          }
        })

        canvas.current.addEventListener("mousedown", onPointerDown)
        canvas.current.addEventListener("touchstart", onPointerDown, {
          passive: true,
        })
        canvas.current.addEventListener("mouseup", releaseConstraint)
        canvas.current.addEventListener("mouseleave", releaseConstraint)
        const onDocMouseUp = () => releaseConstraint()
        const onDocTouchEnd = () => releaseConstraint()
        document.addEventListener("mouseup", onDocMouseUp)
        document.addEventListener("touchend", onDocTouchEnd)
        document.addEventListener("touchcancel", onDocTouchEnd)
        cleanupsRef.current.push(() => {
          document.removeEventListener("mouseup", onDocMouseUp)
          document.removeEventListener("touchend", onDocTouchEnd)
          document.removeEventListener("touchcancel", onDocTouchEnd)
        })
      }

      World.add(engine.current.world, [mouseConstraint.current, ...walls])

      render.current.mouse = mouse

      runner.current = Runner.create()
      if (debug) Render.run(render.current)
      updateElements()
      runner.current.enabled = false

      if (autoStart) {
        runner.current.enabled = true
        startEngine()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateElements, debug, autoStart, gravity.x, gravity.y, addTopWall, grabCursor])

    const clearRenderer = useCallback(() => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }

      if (mouseConstraint.current) {
        World.remove(engine.current.world, mouseConstraint.current)
      }

      if (render.current) {
        Mouse.clearSourceEvents(render.current.mouse)
        Render.stop(render.current)
        render.current.canvas.remove()
      }

      if (runner.current) {
        Runner.stop(runner.current)
      }

      if (engine.current) {
        World.clear(engine.current.world, false)
        Engine.clear(engine.current)
      }

      bodiesMap.current.clear()

      cleanupsRef.current.forEach((fn) => fn())
      cleanupsRef.current = []
    }, [])

    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return

      const newWidth = canvas.current.offsetWidth
      const newHeight = canvas.current.offsetHeight

      setCanvasSize({ width: newWidth, height: newHeight })

      clearRenderer()
      initializeRenderer()
    }, [clearRenderer, initializeRenderer, resetOnResize])

    const startEngine = useCallback(() => {
      if (runner.current) {
        runner.current.enabled = true
        Runner.run(runner.current, engine.current)
      }
      if (render.current && debug) {
        Render.run(render.current)
      }
      settledFrames.current = 0
      if (frameId.current === undefined) {
        frameId.current = requestAnimationFrame(updateElements)
      }
      isRunning.current = true
    }, [updateElements, canvasSize, debug])

    const stopEngine = useCallback(() => {
      if (!isRunning.current) return

      if (runner.current) {
        Runner.stop(runner.current)
      }
      if (render.current && debug) {
        Render.stop(render.current)
      }
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
        frameId.current = undefined
      }
      isRunning.current = false
    }, [debug])

    const reset = useCallback(() => {
      stopEngine()
      bodiesMap.current.forEach(({ element, body, props }) => {
        body.angle = props.angle || 0

        const x = calculatePosition(
          props.x,
          canvasSize.width,
          element.offsetWidth
        )
        const y = calculatePosition(
          props.y,
          canvasSize.height,
          element.offsetHeight
        )
        body.position.x = x
        body.position.y = y
      })
      updateElements()
      handleResize()
    }, [canvasSize, handleResize, stopEngine, updateElements])

    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine, reset]
    )

    useEffect(() => {
      if (!resetOnResize) return

      const debouncedResize = debounce(handleResize, 500)
      window.addEventListener("resize", debouncedResize)

      return () => {
        window.removeEventListener("resize", debouncedResize)
        debouncedResize.cancel()
      }
    }, [handleResize, resetOnResize])

    useEffect(() => {
      initializeRenderer()
      return clearRenderer
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={cn(className, "absolute top-0 left-0 w-full h-full")}
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    )
  }
)

Gravity.displayName = "Gravity"
export default Gravity
