export function createSpring(initial: number, stiffness: number, damping: number, mass: number) {
  let pos = initial;
  let vel = 0;

  return {
    update(target: number, dt: number): number {
      const fSpring = -stiffness * (pos - target);
      const fDamp = -damping * vel;
      const acc = (fSpring + fDamp) / mass;
      vel += acc * dt;
      pos += vel * dt;
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
