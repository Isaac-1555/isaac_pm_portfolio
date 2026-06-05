import { Bullet, Enemy, GenericEnemy, LootItem, Player } from './entities';

function rectsOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return (
    ax < bx + bw &&
    ax + aw > bx &&
    ay < by + bh &&
    ay + ah > by
  );
}

export function checkBulletGenericCollision(
  bullet: Bullet,
  enemy: GenericEnemy
): boolean {
  if (!bullet.active || !enemy.active) return false;
  return rectsOverlap(
    bullet.x, bullet.y, bullet.width, bullet.height,
    enemy.x, enemy.y, enemy.width, enemy.height
  );
}

export function findBulletGenericCollisions(
  bullets: Bullet[],
  enemies: GenericEnemy[]
): { bulletIndex: number; enemyIndex: number } | null {
  for (let bi = 0; bi < bullets.length; bi++) {
    if (!bullets[bi].active) continue;
    for (let ei = 0; ei < enemies.length; ei++) {
      if (!enemies[ei].active) continue;
      if (checkBulletGenericCollision(bullets[bi], enemies[ei])) {
        return { bulletIndex: bi, enemyIndex: ei };
      }
    }
  }
  return null;
}

export function checkBulletEnemyCollision(
  bullet: Bullet,
  enemy: Enemy
): boolean {
  if (!bullet.active || !enemy.active) return false;
  return rectsOverlap(
    bullet.x, bullet.y, bullet.width, bullet.height,
    enemy.x, enemy.y, enemy.width, enemy.height
  );
}

export function findBulletEnemyCollisions(
  bullets: Bullet[],
  enemies: Enemy[]
): { bulletIndex: number; enemyIndex: number } | null {
  for (let bi = 0; bi < bullets.length; bi++) {
    if (!bullets[bi].active) continue;
    for (let ei = 0; ei < enemies.length; ei++) {
      if (!enemies[ei].active) continue;
      if (checkBulletEnemyCollision(bullets[bi], enemies[ei])) {
        return { bulletIndex: bi, enemyIndex: ei };
      }
    }
  }
  return null;
}

export function findLootAtPosition(
  lootItems: LootItem[],
  x: number,
  y: number,
  threshold: number
): LootItem | null {
  for (const loot of lootItems) {
    if (!loot.settled || !loot.active) continue;
    const dx = x - loot.x;
    const dy = y - loot.y;
    if (Math.sqrt(dx * dx + dy * dy) < threshold) {
      return loot;
    }
  }
  return null;
}

export function findPlayerGenericCollision(
  player: Player,
  enemies: GenericEnemy[]
): { enemy: GenericEnemy; index: number } | null {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.active) continue;
    if (
      rectsOverlap(
        player.x - player.width / 2,
        player.y - player.height / 2,
        player.width,
        player.height,
        e.x,
        e.y,
        e.width,
        e.height
      )
    ) {
      return { enemy: e, index: i };
    }
  }
  return null;
}

export function findPlayerProjectCollision(
  player: Player,
  enemies: Enemy[]
): { enemy: Enemy; index: number } | null {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.active) continue;
    if (
      rectsOverlap(
        player.x - player.width / 2,
        player.y - player.height / 2,
        player.width,
        player.height,
        e.x,
        e.y,
        e.width,
        e.height
      )
    ) {
      return { enemy: e, index: i };
    }
  }
  return null;
}
