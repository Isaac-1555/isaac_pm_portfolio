export type AssetKey =
  | 'player-full'
  | 'player-slight'
  | 'player-very'
  | 'player-destroyed'
  | 'player-engine-sheet'
  | 'player-engine-idle'
  | 'player-engine-power'
  | 'player-weapon-auto'
  | 'player-weapon-bigg'
  | 'player-weapon-rocket'
  | 'player-weapon-zapper'
  | 'bullet-auto'
  | 'bullet-big'
  | 'bullet-rocket'
  | 'bullet-zapper'
  | 'bullet-flame'
  | 'shield-round'
  | 'shield-front'
  | 'shield-front-side'
  | 'shield-invincibility'
  | 'bg-solid'
  | 'bg-shadows'
  | 'bg-stars'
  | 'pickup-engine-base'
  | 'pickup-engine-bigpulse'
  | 'pickup-engine-burst'
  | 'pickup-engine-supercharged'
  | 'pickup-shield-allaround'
  | 'pickup-shield-frontside'
  | 'pickup-shield-front'
  | 'pickup-shield-invincibility'
  | 'pickup-weapon-auto'
  | 'pickup-weapon-biggun'
  | 'pickup-weapon-rocket'
  | 'pickup-weapon-zapper'
  | 'flame'
  | 'asteroid';

export interface AssetConfig {
  src: string;
  fw?: number;
  fh?: number;
  frames?: number;
  fps?: number;
  loop?: boolean;
  cols?: number;
}

export const ASSET_BASE = '/game-assets';

export const ASSET_MANIFEST: Record<AssetKey, AssetConfig> = {
  'player-full': { src: 'player/full.png' },
  'player-slight': { src: 'player/slight.png' },
  'player-very': { src: 'player/very.png' },
  'player-destroyed': { src: 'player/destroyed.png' },
  'player-engine-sheet': { src: 'player-engines/base-sheet.png', fw: 48, fh: 48, frames: 8, fps: 10, loop: true, cols: 4 },
  'player-engine-idle': { src: 'player-engines/base-idle.png', fw: 48, fh: 48, frames: 3, fps: 6, loop: true, cols: 3 },
  'player-engine-power': { src: 'player-engines/base-power.png', fw: 48, fh: 48, frames: 4, fps: 10, loop: true, cols: 4 },
  'player-weapon-auto': { src: 'player-weapons/auto-cannon.png' },
  'player-weapon-bigg': { src: 'player-weapons/big-space-gun.png' },
  'player-weapon-rocket': { src: 'player-weapons/rockets.png' },
  'player-weapon-zapper': { src: 'player-weapons/zapper.png' },
  'bullet-auto': { src: 'bullets/auto.png', fw: 32, fh: 32, frames: 4, fps: 12, loop: true, cols: 4 },
  'bullet-big': { src: 'bullets/big.png', fw: 32, fh: 32, frames: 10, fps: 12, loop: true, cols: 10 },
  'bullet-rocket': { src: 'bullets/rocket.png', fw: 32, fh: 32, frames: 3, fps: 8, loop: true, cols: 3 },
  'bullet-zapper': { src: 'bullets/zapper.png', fw: 32, fh: 32, frames: 8, fps: 12, loop: true, cols: 8 },
  'bullet-flame': { src: 'effects/flame.png', fw: 96, fh: 96, frames: 3, fps: 14, loop: true, cols: 3 },
  'shield-round': { src: 'shields/round.png', fw: 64, fh: 64, frames: 12, fps: 12, loop: true, cols: 12 },
  'shield-front': { src: 'shields/front.png', fw: 64, fh: 64, frames: 10, fps: 12, loop: true, cols: 10 },
  'shield-front-side': { src: 'shields/front-side.png', fw: 64, fh: 64, frames: 6, fps: 12, loop: true, cols: 6 },
  'shield-invincibility': { src: 'shields/invincibility.png', fw: 64, fh: 64, frames: 10, fps: 12, loop: true, cols: 10 },
  'bg-solid': { src: 'bg/l1-solid.png' },
  'bg-shadows': { src: 'bg/l2-shadows.png' },
  'bg-stars': { src: 'bg/l3-stars.png' },
  'pickup-engine-base': { src: 'pickups-engines/base.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-engine-bigpulse': { src: 'pickups-engines/bigpulse.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-engine-burst': { src: 'pickups-engines/burst.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-engine-supercharged': { src: 'pickups-engines/supercharged.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-shield-allaround': { src: 'pickups-shields/allaround.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-shield-frontside': { src: 'pickups-shields/frontside.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-shield-front': { src: 'pickups-shields/front.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-shield-invincibility': { src: 'pickups-shields/invincibility.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-weapon-auto': { src: 'pickups-weapons/auto-cannons.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-weapon-biggun': { src: 'pickups-weapons/big-space-gun.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-weapon-rocket': { src: 'pickups-weapons/rocket.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'pickup-weapon-zapper': { src: 'pickups-weapons/zapper.png', fw: 32, fh: 32, frames: 15, fps: 10, loop: true, cols: 15 },
  'flame': { src: 'effects/flame.png', fw: 96, fh: 96, frames: 3, fps: 14, loop: true, cols: 3 },
  'asteroid': { src: 'effects/asteroid.png' },
};

export const FACTION_KEYS = ['k1', 'k2', 'k3'] as const;
export type FactionKey = (typeof FACTION_KEYS)[number];

export const ENEMY_SHIP_KEYS = [
  'fighter',
  'scout',
  'frigate',
  'battlecruiser',
  'dreadnought',
  'bomber',
  'support-ship',
  'torpedo-ship',
] as const;
export type EnemyShipKey = (typeof ENEMY_SHIP_KEYS)[number];

export interface EnemyAssetConfig extends AssetConfig {
  key: string;
}

export function enemyAssetConfig(
  faction: FactionKey,
  ship: EnemyShipKey,
  variant: 'base' | 'destroy' | 'engine'
): EnemyAssetConfig {
  const dir = variant === 'engine' ? 'enemy-engines' : 'enemies';
  return {
    key: `enemy-${faction}-${ship}-${variant}`,
    src: `${dir}/${faction}-${ship}-${variant}.png`,
  };
}
