import { ASSET_BASE, AssetKey, ASSET_MANIFEST, enemyAssetConfig, FactionKey, EnemyShipKey } from './manifest';
export { enemyAssetConfig } from './manifest';
import { PowerUpType } from '../constants';

export type Faction = FactionKey;
export type Ship = EnemyShipKey;

export const PLAYER_FACTION: Faction = 'k1';

export const STANDARD_ENEMY: { faction: Faction; ship: Ship } = { faction: 'k1', ship: 'fighter' };
export const TOUGH_ENEMY: { faction: Faction; ship: Ship } = { faction: 'k1', ship: 'frigate' };
export const FAST_ENEMY: { faction: Faction; ship: Ship } = { faction: 'k2', ship: 'scout' };

export const BOSS_MAP: Record<string, { faction: Faction; ship: Ship }> = {
  satbrain: { faction: 'k1', ship: 'battlecruiser' },
  'barcode-lists': { faction: 'k2', ship: 'battlecruiser' },
  'pocket-resume': { faction: 'k3', ship: 'battlecruiser' },
  d4c: { faction: 'k1', ship: 'dreadnought' },
  coachgg: { faction: 'k2', ship: 'dreadnought' },
};

export function bossForProject(projectId: string): { faction: Faction; ship: Ship } {
  return BOSS_MAP[projectId] ?? { faction: 'k1', ship: 'battlecruiser' };
}

export const POWERUP_PICKUP: Record<PowerUpType, AssetKey> = {
  attack_speed: 'pickup-engine-bigpulse',
  multi_shot: 'pickup-engine-burst',
  stronger_bullets: 'pickup-weapon-biggun',
  extra_life: 'pickup-engine-supercharged',
  double_shot: 'pickup-weapon-auto',
  flame_thrower: 'flame',
  chain_bullets: 'pickup-weapon-zapper',
  shield: 'pickup-shield-allaround',
};

export const POWERUP_BULLET: Record<PowerUpType, AssetKey | null> = {
  attack_speed: 'bullet-auto',
  multi_shot: 'bullet-auto',
  stronger_bullets: 'bullet-big',
  extra_life: 'bullet-auto',
  double_shot: 'bullet-auto',
  flame_thrower: 'bullet-flame',
  chain_bullets: 'bullet-zapper',
  shield: 'bullet-auto',
};

export function playerAssetForLives(lives: number): AssetKey {
  if (lives <= 1) return 'player-very';
  if (lives <= 2) return 'player-slight';
  return 'player-full';
}

export function shieldAssetForWeapon(weapon: PowerUpType | null): AssetKey {
  switch (weapon) {
    case 'flame_thrower':
      return 'shield-invincibility';
    case 'chain_bullets':
      return 'shield-front-side';
    case 'double_shot':
      return 'shield-front';
    default:
      return 'shield-round';
  }
}

export const PROJECT_FACTION_EMBLEM: Record<string, AssetKey> = {
  satbrain: 'pickup-engine-bigpulse',
  'barcode-lists': 'pickup-engine-burst',
  'pocket-resume': 'pickup-weapon-biggun',
  d4c: 'pickup-engine-supercharged',
  coachgg: 'pickup-engine-base',
};

export function allPreloadKeys(): string[] {
  const keys: string[] = [];
  for (const k of Object.keys(ASSET_MANIFEST) as AssetKey[]) {
    keys.push(k);
  }
  const factions: FactionKey[] = ['k1', 'k2', 'k3'];
  const ships: EnemyShipKey[] = [
    'fighter',
    'scout',
    'frigate',
    'battlecruiser',
    'dreadnought',
    'bomber',
  ];
  for (const f of factions) {
    for (const s of ships) {
      keys.push(enemyAssetConfig(f, s, 'base').key);
      keys.push(enemyAssetConfig(f, s, 'destroy').key);
      keys.push(enemyAssetConfig(f, s, 'engine').key);
    }
  }
  return keys;
}

export function srcForKey(key: string): string {
  if (key in ASSET_MANIFEST) {
    return `${ASSET_BASE}/${ASSET_MANIFEST[key as AssetKey].src}`;
  }
  if (key.startsWith('enemy-')) {
    const parts = key.split('-');
    const faction = parts[1] as FactionKey;
    const ship = parts[2] as EnemyShipKey;
    const variant = (parts[3] ?? 'base') as 'base' | 'destroy' | 'engine';
    const cfg = enemyAssetConfig(faction, ship, variant);
    return `${ASSET_BASE}/${cfg.src}`;
  }
  return key;
}
