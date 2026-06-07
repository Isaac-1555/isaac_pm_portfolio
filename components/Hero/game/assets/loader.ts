import { ASSET_BASE, ASSET_MANIFEST, AssetConfig, AssetKey, EnemyAssetConfig, enemyAssetConfig, FactionKey, EnemyShipKey } from './manifest';

const cache = new Map<string, HTMLImageElement>();
const failed = new Set<string>();

export function getCachedImage(src: string): HTMLImageElement | null {
  return cache.get(src) ?? null;
}

export function hasFailed(src: string): boolean {
  return failed.has(src);
}

function loadOne(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      failed.add(src);
      reject(new Error(`Failed to load ${src}`));
    };
    img.src = src;
  });
}

export interface AssetEntry {
  key: string;
  img: HTMLImageElement;
  config: AssetConfig;
}

const registry = new Map<string, AssetEntry>();
const pending: string[] = [];

export function getAssetEntry(key: string): AssetEntry | undefined {
  return registry.get(key);
}

export function listAssetKeys(): string[] {
  return Array.from(registry.keys());
}

function enqueueAll(src: string): void {
  if (!pending.includes(src) && !cache.has(src)) {
    pending.push(src);
  }
}

export function preloadAssets(keys: (AssetKey | string)[]): Promise<AssetEntry[]> {
  const entries: AssetEntry[] = [];
  const promises: Promise<HTMLImageElement>[] = [];

  for (const key of keys) {
    if (typeof key === 'string' && key.startsWith('enemy-')) {
      const rest = key.slice('enemy-'.length);
      const variant = rest.endsWith('-base')
        ? 'base'
        : rest.endsWith('-destroy')
        ? 'destroy'
        : rest.endsWith('-engine')
        ? 'engine'
        : 'base';
      const shipAndFaction = rest.slice(0, -(variant.length + 1));
      const dashIdx = shipAndFaction.indexOf('-');
      const faction = shipAndFaction.slice(0, dashIdx) as FactionKey;
      const ship = shipAndFaction.slice(dashIdx + 1) as EnemyShipKey;
      const cfg = enemyAssetConfig(faction, ship, variant);
      const src = `${ASSET_BASE}/${cfg.src}`;
      enqueueAll(src);
      promises.push(
        loadOne(src).then((img) => {
          const e: AssetEntry = { key, img, config: cfg };
          registry.set(key, e);
          entries.push(e);
          return img;
        })
      );
      continue;
    }
    if (typeof key === 'string' && !(key in ASSET_MANIFEST)) {
      const cfg: AssetConfig = { src: key };
      const src = key.startsWith('/') ? key : `${ASSET_BASE}/${cfg.src}`;
      enqueueAll(src);
      promises.push(
        loadOne(src).then((img) => {
          const e: AssetEntry = { key, img, config: cfg };
          registry.set(key, e);
          entries.push(e);
          return img;
        })
      );
      continue;
    }
    const k = key as AssetKey;
    const cfg = ASSET_MANIFEST[k];
    if (!cfg) continue;
    const src = `${ASSET_BASE}/${cfg.src}`;
    enqueueAll(src);
    promises.push(
      loadOne(src).then((img) => {
        const e: AssetEntry = { key: k, img, config: cfg };
        registry.set(k, e);
        entries.push(e);
        return img;
      })
    );
  }

  return Promise.all(promises).then(() => entries);
}

export function preloadEnemies(
  factions: FactionKey[],
  ships: EnemyShipKey[]
): Promise<AssetEntry[]> {
  const keys: string[] = [];
  const configs: EnemyAssetConfig[] = [];
  for (const f of factions) {
    for (const s of ships) {
      configs.push(enemyAssetConfig(f, s, 'base'));
      configs.push(enemyAssetConfig(f, s, 'destroy'));
      configs.push(enemyAssetConfig(f, s, 'engine'));
    }
  }
  for (const c of configs) keys.push(c.key);
  return preloadAssets(keys);
}
