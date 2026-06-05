'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ExternalLinkIcon from '@/components/icons/external-link-icon';
import GithubIcon from '@/components/icons/github-icon';
import type { GameProject } from './game/constants';

interface Props {
  project: GameProject;
  onClose: () => void;
}

export default function ProjectPreviewCard({ project, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && cardRef.current) {
        const focusable = cardRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      cardRef.current?.querySelector<HTMLElement>('button')?.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-bg-dark/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Project: ${project.title}`}
        className="bg-card border-2 border-bg-dark rounded-sm shadow-lg w-full max-w-sm p-5 relative animate-in fade-in zoom-in duration-200"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-sm border border-divider text-text-secondary hover:bg-bg-accent hover:text-white transition-colors text-sm leading-none"
        >
          ✕
        </button>

        <div className="mb-3 pr-6">
          <h3 className="text-lg font-industrial uppercase tracking-wider text-text-primary leading-tight">
            {project.title}
          </h3>
          <p className="text-xs font-tech uppercase tracking-wide text-text-secondary mt-0.5">
            {project.subtitle}
          </p>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4 font-sans">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] border-divider text-text-secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-3 border-t border-divider">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <GithubIcon size={14} />
                GitHub
              </Button>
            </a>
          )}
          {project.websiteUrl && (
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="default" size="sm" className="w-full gap-1.5 text-xs">
                <ExternalLinkIcon size={14} />
                Live Demo
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
