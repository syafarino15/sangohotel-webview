'use client';

import { ArrowLeft, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onShare?: () => void;
  className?: string;
}

export const Header = ({ title, subtitle, onBack, onShare, className }: HeaderProps) => (
  <header
    className={cn(
      'relative bg-sango-ink pt-[env(safe-area-inset-top,0px)] text-sango-cream',
      className
    )}
  >
    <div className="flex min-h-[56px] items-center gap-1 px-1.5 py-1.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="flex h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
          >
            <ArrowLeft size={22} />
          </button>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-bold leading-tight">{title}</h1>
        {subtitle ? (
          <p className="truncate text-[11px] leading-tight text-sango-cream/70">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        {onShare ? (
          <button
            type="button"
            onClick={onShare}
            aria-label="Bagikan"
            className="flex h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
          >
            <Share2 size={20} />
          </button>
        ) : null}
      </div>
    </div>
  </header>
);