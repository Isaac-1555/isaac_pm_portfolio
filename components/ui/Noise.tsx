'use client';

import { useEffect, useRef } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

export default function Noise({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    const canvasSize = 1024;

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value * patternScaleX;
        data[i + 1] = value * patternScaleY;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    const resize = () => {
      canvas.width = canvasSize;
      canvas.height = canvasSize;
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const start = () => {
      resize();
      if (mediaQuery.matches) {
        drawGrain();
      } else {
        loop();
      }
    };

    window.addEventListener('resize', resize);
    start();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
      ref={grainRef}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
