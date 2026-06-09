export type CursorVariant = 'default' | 'button' | 'spotlight' | 'disabled' | 'loading';

export interface CursorTargetInfo {
  rect: DOMRect;
  type: 'button' | 'spotlight' | 'disabled';
}

export interface CursorSpring {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface MagnetismState {
  offsetX: number;
  offsetY: number;
  activeTarget: Element | null;
}
