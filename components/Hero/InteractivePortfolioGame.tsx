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
  deactivateBullet,
  hitGenericEnemy,
  calculateGenericScore,
  updateWave,
  updateProjectEnemies,
  updateLootItems,
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
} from './game/constants';
import ProjectPreviewCard from './ProjectPreviewCard';
import type { GameProject } from './game/constants';

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
    player: createPlayer(BASE_WIDTH, BASE_HEIGHT),
    bullets: [],
    genericEnemies: createWaveGrid(1),
    projectEnemies: [],
    wave: createWaveState(1),
    lootItems: [],
    particles: createParticlePool(200),
    stars: createStars(BASE_WIDTH, BASE_HEIGHT),
    shootCooldown: 0,
    projectSpawnTimer: 5,
    score: 0,
    highScore: loadHighScore(),
    paused: false,
    reducedMotion: false,
  };
}

export default function InteractivePortfolioGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameState>(createInitialGameState());
  const keysRef = useKeyboardControls();
  const scaleRef = useRef({ x: 1, y: 1 });
  const hitEffectsRef = useRef<HitEffect[]>([]);
  const timeRef = useRef(0);

  const touchStartXRef = useRef(0);
  const touchHasMovedRef = useRef(false);
  const touchPendingShotRef = useRef(false);
  const suppressClickRef = useRef(false);

  const [selectedProject, setSelectedProject] = useState<GameProject | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
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
        if (state.paused || isCardOpen) return;

        timeRef.current = time;

        const keys = keysRef.current;
        const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
        const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D');
        const kbShoot = keys.has(' ') || keys.has('Space');

        const touchShoot = touchPendingShotRef.current;
        touchPendingShotRef.current = false;

        processInput(state, dt, left, right, kbShoot || touchShoot);
        updatePlayer(state.player, dt);
        updateBullets(state.bullets, dt);
        updateWave(state, dt);
        updateProjectEnemies(state, dt);
        updateLootItems(state, dt);
        updateStars(state.stars, dt, BASE_WIDTH, BASE_HEIGHT);
        updateParticles(state.particles, dt);

        const genericCollision = findBulletGenericCollisions(
          state.bullets,
          state.genericEnemies
        );
        if (genericCollision) {
          const { bulletIndex, enemyIndex } = genericCollision;
          const enemy = state.genericEnemies[enemyIndex];
          deactivateBullet(state.bullets, bulletIndex);
          if (enemy.active) {
            spawnExplosionFromPool(
              state.particles,
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              enemy.type === 'tough' ? '#E07A5F' : '#4A7C7E'
            );
            hitEffectsRef.current.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height / 2,
              time: 0,
            });
            const killed = hitGenericEnemy(state.genericEnemies, enemyIndex);
            if (killed) {
              state.score += calculateGenericScore(enemy.type);
            }
          }
        }

        const projectCollision = findBulletEnemyCollisions(
          state.bullets,
          state.projectEnemies
        );
        if (projectCollision) {
          const { bulletIndex, enemyIndex } = projectCollision;
          const enemy = state.projectEnemies[enemyIndex];
          deactivateBullet(state.bullets, bulletIndex);
          if (enemy.active) {
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
            state.lootItems.push(
              createLootItem(
                enemy.projectId,
                enemy.projectTitle,
                enemy.color,
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2,
                lootCount
              )
            );
            state.projectEnemies.splice(enemyIndex, 1);
            state.score += SCORE_PROJECT;
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

        const allDead = state.genericEnemies.every((e) => !e.active);
        if (allDead) {
          state.wave.allDeadTimer -= dt;
          if (state.wave.allDeadTimer <= 0) {
            state.wave.waveNumber++;
            state.wave.moveInterval = Math.max(
              0.08,
              0.5 - (state.wave.waveNumber - 1) * 0.025
            );
            state.wave.direction = 1;
            state.wave.moveTimer = 0;
            state.wave.allDeadTimer = 1;
            state.genericEnemies = createWaveGrid(state.wave.waveNumber);
          }
        }

        for (let i = hitEffectsRef.current.length - 1; i >= 0; i--) {
          hitEffectsRef.current[i].time += dt;
          if (hitEffectsRef.current[i].time > 0.3) {
            hitEffectsRef.current.splice(i, 1);
          }
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const scale = scaleRef.current;
        render(ctx, state, scale.x, scale.y, hitEffectsRef.current, timeRef.current);
      },
      [isCardOpen, keysRef]
    ),
    !reducedMotion
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchHasMovedRef.current = false;
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
    if (!touchHasMovedRef.current) {
      touchPendingShotRef.current = true;
    }
    suppressClickRef.current = true;
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 150);
  };

  const handleClick = (e: React.MouseEvent) => {
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
