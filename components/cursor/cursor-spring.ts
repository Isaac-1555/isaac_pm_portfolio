export function createSpring(initial: number, stiffness: number, damping: number, mass: number) {
  let pos = initial;
  let vel = 0;

  const MAX_STABLE_DT = 0.016;

  return {
    update(target: number, dt: number): number {
      if (dt <= 0) return pos;

      const steps = Math.max(1, Math.ceil(dt / MAX_STABLE_DT));
      const stepDt = dt / steps;

      for (let i = 0; i < steps; i++) {
        const fSpring = -stiffness * (pos - target);
        const fDamp = -damping * vel;
        const acc = (fSpring + fDamp) / mass;
        vel += acc * stepDt;
        pos += vel * stepDt;
      }
      return pos;
    },
    snap(value: number) {
      pos = value;
      vel = 0;
    },
    get(): number {
      return pos;
    },
  };
}
