'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_TEXTURE_URL = '/hero_bg.png';
const DEFAULT_COLOR_A = '#171D20';
const DEFAULT_COLOR_B = '#525756';
const RENDER_SCALE = 0.5;
const MOUSE_EASE = 0.06;
const SHIMMER = 0.08;

export interface HeroBackgroundProps {
  textureUrl?: string;
  colorA?: string;
  colorB?: string;
}

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = vec2(a_position.x * 0.5 + 0.5, 0.5 - a_position.y * 0.5);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec2 u_crop;
uniform float u_shimmer;
uniform sampler2D u_tex;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p, float t) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p * frequency + vec2(t * (0.12 + 0.04 * float(i)), -t * 0.08));
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float select4(float a, float b, float c, float d, float i) {
  return mix(mix(a, b, step(1.0, i)), mix(c, d, step(3.0, i)), step(2.0, i));
}

float bayer4(float fx, float fy) {
  float x = mod(fx, 4.0);
  float y = mod(fy, 4.0);
  float col0 = select4(0.0, 12.0, 3.0, 15.0, y);
  float col1 = select4(8.0, 4.0, 11.0, 7.0, y);
  float col2 = select4(2.0, 14.0, 1.0, 13.0, y);
  float col3 = select4(10.0, 6.0, 9.0, 5.0, y);
  return select4(col0, col1, col2, col3, x);
}

void main() {
  float threshold = bayer4(gl_FragCoord.x, gl_FragCoord.y) / 16.0;

  vec2 uv = (v_uv - 0.5) * u_crop + 0.5;
  uv += (u_mouse - 0.5) * 0.03;

  float lum = dot(texture2D(u_tex, uv).rgb, vec3(0.299, 0.587, 0.114));

  float t = u_time * 0.05;
  vec2 p = gl_FragCoord.xy / u_resolution;
  p += (u_mouse - 0.5) * 0.5;
  float n = fbm(p * 2.0, t);
  n = n / 0.875 * 0.5 + 0.5;

  float value = clamp(lum + (n - 0.5) * u_shimmer, 0.0, 1.0);

  float c = step(threshold, value);
  vec3 color = mix(u_colorA, u_colorB, c);
  gl_FragColor = vec4(color, 1.0);
}
`;

function parseHex(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

function compileShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      'HeroBackground shader compile:',
      gl.getShaderInfoLog(shader) ?? 'unknown GLSL compile error',
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('HeroBackground program link:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function HeroBackground({ textureUrl = DEFAULT_TEXTURE_URL, colorA = DEFAULT_COLOR_A, colorB = DEFAULT_COLOR_B }: HeroBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const propsRef = useRef({ textureUrl, colorA, colorB });
  propsRef.current = { textureUrl, colorA, colorB };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext('webgl2', {
      preserveDrawingBuffer: true,
    });
    if (!gl) gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) gl = canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true }) as WebGLRenderingContext | null;
    if (!gl) return;
    if (gl.isContextLost()) return;

    const program = createProgram(gl);
    if (!program) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uColorA = gl.getUniformLocation(program, 'u_colorA');
    const uColorB = gl.getUniformLocation(program, 'u_colorB');
    const uCrop = gl.getUniformLocation(program, 'u_crop');
    const uShimmer = gl.getUniformLocation(program, 'u_shimmer');
    const uTex = gl.getUniformLocation(program, 'u_tex');

    const colorA = new Float32Array(parseHex(propsRef.current.colorA));
    const colorB = new Float32Array(parseHex(propsRef.current.colorB));

    let texture: WebGLTexture | null = null;
    let textureReady = false;
    let texSize: { width: number; height: number } | null = null;
    let cropX = 1;
    let cropY = 1;

    const updateCrop = () => {
      if (!texSize) return;
      const scale = Math.max(canvas.width / texSize.width, canvas.height / texSize.height);
      cropX = canvas.width / texSize.width / scale;
      cropY = canvas.height / texSize.height / scale;
    };

    const setupTexture = (source: ImageBitmap | HTMLImageElement) => {
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      texSize = { width: source.width, height: source.height };
      textureReady = true;
      updateCrop();
      if (reducedMotionQuery.matches) {
        draw(performance.now());
      }
    };

    const loadTexture = async () => {
      try {
        const response = await fetch(propsRef.current.textureUrl);
        if (!response.ok) return;
        const blob = await response.blob();
        if ('createImageBitmap' in window) {
          const bitmap = await createImageBitmap(blob);
          setupTexture(bitmap);
        } else {
          const image = new Image();
          image.onload = () => setupTexture(image);
          image.src = URL.createObjectURL(blob);
        }
      } catch {
        return;
      }
    };

    const resize = () => {
      const width = Math.max(1, Math.round(wrap.clientWidth * RENDER_SCALE));
      const height = Math.max(1, Math.round(wrap.clientHeight * RENDER_SCALE));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      updateCrop();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    let targetX = 0.5;
    let targetY = 0.5;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const onMouseMove = (event: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      targetX = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0.5;
      targetY = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let startTime = performance.now();
    let animationFrame = 0;
    let running = true;

    const draw = (now: number) => {
      if (!textureReady) return;
      mouseX += (targetX - mouseX) * MOUSE_EASE;
      mouseY += (targetY - mouseY) * MOUSE_EASE;

      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uTex, 0);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, reducedMotionQuery.matches ? 0 : (now - startTime) / 1000);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform3fv(uColorA, colorA);
      gl.uniform3fv(uColorB, colorB);
      gl.uniform2f(uCrop, cropX, cropY);
      gl.uniform1f(uShimmer, reducedMotionQuery.matches ? 0 : SHIMMER);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!running) return;
      if (!document.hidden) draw(now);
      animationFrame = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (animationFrame || !running || reducedMotionQuery.matches) return;
      animationFrame = requestAnimationFrame(loop);
    };

    if (reducedMotionQuery.matches) {
      draw(performance.now());
    } else {
      animationFrame = requestAnimationFrame(loop);
    }

    const onReducedMotionChange = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      if (reducedMotionQuery.matches) {
        draw(performance.now());
      } else {
        startLoop();
      }
    };

    const media = reducedMotionQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onReducedMotionChange);
    } else if (media.addListener) {
      media.addListener(onReducedMotionChange);
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? false;
        if (running) {
          startTime = performance.now();
          startLoop();
        } else {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      },
      { rootMargin: '150px 0px' },
    );
    intersectionObserver.observe(wrap);

    void loadTexture();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', onReducedMotionChange);
      } else if (media.removeListener) {
        media.removeListener(onReducedMotionChange);
      }
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ background: `linear-gradient(155deg, ${propsRef.current.colorA} 0%, ${propsRef.current.colorB} 100%)` }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
