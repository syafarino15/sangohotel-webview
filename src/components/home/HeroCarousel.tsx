'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PromoBanner } from '@/types/service';

const AUTOPLAY_MS = 5000;
const RESUME_AFTER_MS = 6000;

interface HeroCarouselProps {
  banners: PromoBanner[];
  onAction: (banner: PromoBanner) => void;
}

export const HeroCarousel = ({ banners, onAction }: HeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
  }, []);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(Math.min(banners.length - 1, Math.max(0, nextIndex)));
  };

  useEffect(() => {
    if (paused || banners.length < 2) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % banners.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, banners.length, scrollToIndex]);

  useEffect(() => {
    if (!paused) {
      return;
    }
    const timer = window.setTimeout(() => setPaused(false), RESUME_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [paused]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <section aria-label="Promo Sango" className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={() => setPaused(true)}
        onTouchStart={() => setPaused(true)}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto rounded-2xl"
      >
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => onAction(banner)}
            aria-label={`${banner.title}. ${banner.ctaLabel}`}
            className="relative h-[172px] w-full shrink-0 snap-center overflow-hidden text-left"
          >
            <Image
              src={banner.image}
              alt=""
              fill
              sizes="480px"
              priority={index === 0}
              className="object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-sango-ink via-sango-ink/55 to-sango-ink/5" />
            <span className="absolute inset-0 flex flex-col justify-end p-3.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-sango-gold">
                {banner.eyebrow}
              </span>
              <span className="mt-1 text-[16px] font-bold leading-tight text-sango-cream">
                {banner.title}
              </span>
              <span className="mt-0.5 line-clamp-1 text-[11px] text-sango-cream/75">
                {banner.description}
              </span>
              <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-sango-ink">
                {banner.ctaLabel} <ArrowRight size={12} />
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-sango-ink/45 px-1">
        {banners.map((banner, index) => (
          <button
            key={`dot-${banner.id}`}
            type="button"
            onClick={() => {
              setPaused(true);
              scrollToIndex(index);
            }}
            aria-label={`Slide ${index + 1}`}
            aria-current={index === activeIndex}
            className="flex h-8 w-6 items-center justify-center"
          >
            <span
              className={cn(
                'h-1.5 rounded-full transition-all',
                index === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/55'
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
};