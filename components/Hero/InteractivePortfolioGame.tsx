'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useGameLoop } from './hooks/useGameLoop';
import {
  GameState,
  createPlayer,
  createStars,
  createParticlePool,
  spawnExplosionFromPool,
  createWaveGrid,
  createWaveState,
  createLootItem,
} from './game/entities';
import {
  processInput,
  updatePlayer,
  updateBullets,
  updateStars,
  hitGenericEnemy,
  calculateGenericScore,
  updateWave,
  updateProjectEnemies,
  updateLootItems,
  updateInvulnerability,
  updateScreenShake,
  updateScorePopups,
  updateWaveText,
  addScorePopup,
  checkPlayerDamage,
  announceWave,
  updatePowerUps,
  updatePowerUpSpawner,
  tryDropPowerUp,
  checkPowerUpCollection,
  updateTempWeapon,
  updateShield,
  findNearestEnemy,
  tickGenericAnimations,
  updatePlayerAnim,
} from './game/physics';
import {
  findBulletGenericCollisions,
  findBulletEnemyCollisions,
  findLootAtPosition,
} from './game/collision';
import { updateParticles } from './game/particles';
import { render } from './game/renderer';
import {
  BASE_WIDTH,
  BASE_HEIGHT,
  GAME_PROJECTS,
  SCORE_PROJECT,
  HIGH_SCORE_KEY,
  LOOT_CLICK_THRESHOLD,
  INITIAL_LIVES,
  CHAIN_RANGE,
  COLORS,
  getWaveInterval,
} from './game/constants';
import ProjectPreviewCard from './ProjectPreviewCard';
import type { GameProject } from './game/constants';
import { allPreloadKeys, PROJECT_FACTION_EMBLEM } from './game/assets/assetMap';
import { preloadAssets, getCachedImage } from './game/assets/loader';
import { updateBackground, resetBackground } from './game/assets/background';

interface HitEffect {
  x: number;
  y: number;
  time: number;
}

function loadHighScore(): number {
  try {
    const val = localStorage.getItem(HIGH_SCORE_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function createInitialGameState(): GameState {
  return {
    phase: 'start',
    player: createPlayer(BASE_WIDTH, BASE_HEIGHT),
    bullets: [],
    genericEnemies: [],
    projectEnemies: [],
    wave: createWaveState(1),
    lootItems: [],
    particles: createParticlePool(300),
    stars: createStars(BASE_WIDTH, BASE_HEIGHT),
    shootCooldown: 0,
    projectSpawnTimer: 5,
    score: 0,
    highScore: loadHighScore(),
    paused: false,
    reducedMotion: false,
    lives: INITIAL_LIVES,
    invulnerableTimer: 0,
    shakeAmount: 0,
    scorePopups: [],
    waveReached: 0,
    waveTextTimer: 0,
    lastWaveNumber: 0,
    elapsedTime: 0,
    powerUps: [],
    powerUpSpawnTimer: 8,
    attackSpeedLevel: 0,
    multiShotLevel: 0,
    bulletDamage: 1,
    tempWeapon: null,
    shieldTimer: 0,
    playerAnim: { t: 0 },
    playerLivesCache: INITIAL_LIVES,
  };
}

function startGame(state: GameState): void {
  state.phase = 'playing';
  state.player = createPlayer(BASE_WIDTH, BASE_HEIGHT);
  state.bullets = [];
  state.genericEnemies = createWaveGrid(1);
  state.projectEnemies = [];
  state.wave = createWaveState(1);
  state.lootItems = [];
  state.shootCooldown = 0;
  state.projectSpawnTimer = 5;
  state.score = 0;
  state.lives = INITIAL_LIVES;
  state.invulnerableTimer = 0;
  state.shakeAmount = 0;
  state.scorePopups = [];
  state.waveReached = 1;
  state.waveTextTimer = 1.8;
  state.lastWaveNumber = 1;
  state.powerUps = [];
  state.powerUpSpawnTimer = 8;
  state.attackSpeedLevel = 0;
  state.multiShotLevel = 0;
  state.bulletDamage = 1;
  state.tempWeapon = null;
  state.shieldTimer = 0;
  state.playerAnim = { t: 0 };
  state.playerLivesCache = INITIAL_LIVES;
  resetBackground();
  announceWave(state, 1);
}

export default function InteractivePortfolioGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameState>(createInitialGameState());
  const keysRef = useKeyboardControls();
  const scaleRef = useRef({ x: 1, y: 1 });
  const hitEffectsRef = useRef<HitEffect[]>([]);
  const timeRef = useRef(0);
  const spacePressedRef = useRef(false);
  const tapPendingRef = useRef(false);

  const touchStartXRef = useRef(0);
  const touchHasMovedRef = useRef(false);
  const touchPendingShotRef = useRef(false);
  const isTouchingRef = useRef(false);
  const suppressClickRef = useRef(false);

  const [selectedProject, setSelectedProject] = useState<GameProject | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [assetsReady, setAssetsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const keys = allPreloadKeys();
    let cancelled = false;
    const total = keys.length;
    let done = 0;
    const tick = () => {
      done += 1;
      if (!cancelled) setLoadProgress(total > 0 ? done / total : 1);
    };
    preloadAssets(keys)
      .then(() => {
        for (const k of keys) {
          if (k.startsWith('/')) {
            const img = getCachedImage(k);
            void img;
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        tick();
        if (!cancelled) {
          setLoadProgress(1);
          setAssetsReady(true);
        }
      });
    const interval = setInterval(() => {
      setLoadProgress((p) => Math.min(0.95, p + 0.04));
    }, 120);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const updateCanvasSize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    scaleRef.current = {
      x: rect.width / BASE_WIDTH,
      y: rect.height / BASE_HEIGHT,
    };
  }, []);

  useEffect(() => {
    updateCanvasSize();
    const observer = new ResizeObserver(updateCanvasSize);
    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [updateCanvasSize]);

  useEffect(() => {
    const handleVisibility = () => {
      gameStateRef.current.paused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    canvasRef.current?.focus();
  }, []);

  const drawFrame = useCallback((state: GameState, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scale = scaleRef.current;
    render(ctx, state, scale.x, scale.y, hitEffectsRef.current, time, loadProgress, assetsReady);
  }, [loadProgress, assetsReady]);

  useEffect(() => {
    if (!reducedMotion) return;
    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const scale = scaleRef.current;
      render(ctx, gameStateRef.current, scale.x, scale.y, [], 0);
    });
  }, [reducedMotion]);

  const isCardOpen = selectedProject !== null;

  useGameLoop(
    useCallback(
      (dt: number, time: number) => {
        const state = gameStateRef.current;
        timeRef.current = time;
        state.elapsedTime += dt;

        const keys = keysRef.current;
        const isSpaceDown = keys.has(' ') || keys.has('Space');
        const spaceJustPressed = isSpaceDown && !spacePressedRef.current;
        spacePressedRef.current = isSpaceDown;

        const tapJustPressed = tapPendingRef.current;
        tapPendingRef.current = false;

        const advance = spaceJustPressed || tapJustPressed;

        if (state.paused && state.phase === 'playing') {
          updateStars(state.stars, dt, BASE_WIDTH, BASE_HEIGHT);
          updateBackground(dt);
          updateScreenShake(state, dt);
          drawFrame(state, timeRef.current);
          return;
        }

        if (state.phase === 'start' || state.phase === 'gameOver') {
          if (advance) {
            startGame(state);
            spacePressedRef.current = isSpaceDown;
            drawFrame(state, timeRef.current);
            return;
          }
          updateStars(state.stars, dt, BASE_WIDTH, BASE_HEIGHT);
          updateBackground(dt);
          updateScreenShake(state, dt);
          drawFrame(state, timeRef.current);
          return;
        }

        if (isCardOpen) {
          updateStars(state.stars, dt, BASE_WIDTH, BASE_HEIGHT);
          updateBackground(dt);
          updateScreenShake(state, dt);
          drawFrame(state, timeRef.current);
          return;
        }

        const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
        const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D');
        const kbShoot = isSpaceDown;

        const touchShoot = isTouchingRef.current || touchPendingShotRef.current;
        touchPendingShotRef.current = false;

        processInput(state, dt, left, right, kbShoot || touchShoot);
        updatePlayer(state.player, dt);
        updatePlayerAnim(state, dt);
        updateBullets(state.bullets, dt);
        updatePowerUps(state, dt);
        updatePowerUpSpawner(state, dt);
        updateTempWeapon(state, dt);
        updateShield(state, dt);
        updateWave(state, dt);
        updateProjectEnemies(state, dt);
        tickGenericAnimations(state.genericEnemies, dt);
        updateLootItems(state, dt);
        updateBackground(dt);
        updateStars(state.stars, dt, BASE_WIDTH, BASE_HEIGHT);
        updateParticles(state.particles, dt);
        updateInvulnerability(state, dt);
        updateScreenShake(state, dt);
        updateScorePopups(state, dt);
        updateWaveText(state, dt);

        checkPlayerDamage(state);
        checkPowerUpCollection(state);

        const genericCollision = findBulletGenericCollisions(
          state.bullets,
          state.genericEnemies
        );
        if (genericCollision) {
          const { bulletIndex, enemyIndex } = genericCollision;
          const bullet = state.bullets[bulletIndex];
          const enemy = state.genericEnemies[enemyIndex];
          if (enemy.active) {
            spawnExplosionFromPool(
              state.particles,
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              enemy.type === 'tough' ? COLORS.gold : COLORS.tech
            );
            hitEffectsRef.current.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height / 2,
              time: 0,
            });
            const damage = bullet?.damage ?? 1;
            const killed = hitGenericEnemy(state.genericEnemies, enemyIndex, damage);
            if (killed) {
              const points = calculateGenericScore(enemy.type);
              state.score += points;
              addScorePopup(
                state,
                enemy.x + enemy.width / 2,
                enemy.y,
                points,
                enemy.type === 'tough' ? COLORS.gold : COLORS.cta
              );
              tryDropPowerUp(
                state,
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2
              );
            }
          }
          if (bullet && bullet.active) {
            bullet.active = false;
            if (bullet.type === 'chain' && bullet.chainHits > 0) {
              const sx = enemy.x + enemy.width / 2;
              const sy = enemy.y + enemy.height / 2;
              const target = findNearestEnemy(state, sx, sy, CHAIN_RANGE);
              if (target) {
                const tx = target.enemy.x + target.enemy.width / 2;
                const ty = target.enemy.y + target.enemy.height / 2;
                const dx = tx - sx;
                const dy = ty - sy;
                const dist = Math.hypot(dx, dy) || 1;
                const speed = 520;
                bullet.x = sx - bullet.width / 2;
                bullet.y = sy;
                bullet.vx = (dx / dist) * speed;
                bullet.vy = (dy / dist) * speed;
                bullet.chainHits -= 1;
                bullet.active = true;
              }
            }
          }
        }

        const projectCollision = findBulletEnemyCollisions(
          state.bullets,
          state.projectEnemies
        );
        if (projectCollision) {
          const { bulletIndex, enemyIndex } = projectCollision;
          const bullet = state.bullets[bulletIndex];
          const enemy = state.projectEnemies[enemyIndex];
          if (bullet) bullet.active = false;
          if (enemy.active && !enemy.deathAnim) {
            spawnExplosionFromPool(
              state.particles,
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              enemy.color
            );
            hitEffectsRef.current.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height / 2,
              time: 0,
            });
            const lootCount = state.lootItems.filter((l) => l.active).length;
            const emblemKey = PROJECT_FACTION_EMBLEM[enemy.projectId] ?? 'pickup-engine-base';
            state.lootItems.push(
              createLootItem(
                enemy.projectId,
                enemy.projectTitle,
                enemy.color,
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2,
                lootCount,
                emblemKey
              )
            );
            enemy.deathAnim = { t: 0, duration: 0.7 };
            state.score += SCORE_PROJECT;
            addScorePopup(
              state,
              enemy.x + enemy.width / 2,
              enemy.y,
              SCORE_PROJECT,
              COLORS.gold
            );
            tryDropPowerUp(
              state,
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2
            );
          }
        }

        if (state.score > state.highScore) {
          state.highScore = state.score;
          try {
            localStorage.setItem(
              HIGH_SCORE_KEY,
              String(state.score)
            );
          } catch {}
        }

        const allDead =
          state.genericEnemies.length > 0 &&
          state.genericEnemies.every((e) => !e.active && !e.deathAnim);
        if (allDead) {
          state.wave.allDeadTimer -= dt;
          if (state.wave.allDeadTimer <= 0) {
            state.wave.waveNumber++;
            state.wave.moveInterval = getWaveInterval(state.wave.waveNumber);
            state.wave.direction = 1;
            state.wave.moveTimer = 0;
            state.wave.allDeadTimer = 1;
            state.genericEnemies = createWaveGrid(state.wave.waveNumber);
            announceWave(state, state.wave.waveNumber);
          }
        }

        for (let i = hitEffectsRef.current.length - 1; i >= 0; i--) {
          hitEffectsRef.current[i].time += dt;
          if (hitEffectsRef.current[i].time > 0.3) {
            hitEffectsRef.current.splice(i, 1);
          }
        }

        drawFrame(state, timeRef.current);
      },
      [isCardOpen, keysRef, drawFrame]
    ),
    !reducedMotion && assetsReady
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchHasMovedRef.current = false;
    isTouchingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartXRef.current);
    if (dx > 10) touchHasMovedRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = scaleRef.current;
    gameStateRef.current.player.x =
      (touch.clientX - rect.left) / scale.x;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    isTouchingRef.current = false;
    if (!touchHasMovedRef.current) {
      const phase = gameStateRef.current.phase;
      if (phase === 'start' || phase === 'gameOver') {
        tapPendingRef.current = true;
      } else {
        touchPendingShotRef.current = true;
      }
    }
    suppressClickRef.current = true;
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 150);
  };

  const handleClick = (e: React.MouseEvent) => {
    const phase = gameStateRef.current.phase;
    if (phase === 'start' || phase === 'gameOver') {
      tapPendingRef.current = true;
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scale = scaleRef.current;
      const vx = (e.clientX - rect.left) / scale.x;
      const vy = (e.clientY - rect.top) / scale.y;
      const hitLoot = findLootAtPosition(
        gameStateRef.current.lootItems,
        vx,
        vy,
        LOOT_CLICK_THRESHOLD
      );
      if (hitLoot) {
        const project = GAME_PROJECTS.find(
          (p) => p.id === hitLoot.projectId
        );
        if (project) setSelectedProject(project);
        return;
      }
    }
    if (suppressClickRef.current) return;
    touchPendingShotRef.current = true;
  };

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Portfolio interactive game. Use arrow keys or A/D to move, Space to shoot. Defeat waves of enemies and collect loot to learn about projects."
        tabIndex={0}
        className="w-full h-full block outline-none focus:outline-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      />
      {selectedProject && (
        <ProjectPreviewCard
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
