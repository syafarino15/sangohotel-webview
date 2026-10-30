'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const SANGO = 'https://sangohotelmanagement.com/wp-content/themes/shm-theme/assets/photos';

const SLIDES = [
  {
    id: 'welcome',
    eyebrow: 'Sango Hotel Management',
    title: 'Selamat datang di Sango',
    description:
      'Empat hotel pilihan di Semarang dan Jakarta. Satu aplikasi untuk menginap, menyewa kendaraan, dan memesan makanan.',
    image: `${SANGO}/hotel-manhattan.jpg`,
  },
  {
    id: 'booking',
    eyebrow: 'Direct Booking',
    title: 'Pesan langsung, harga terbaik',
    description:
      'Pilih kamar, bayar, lalu terima e-voucher. Tanpa biaya perantara dan tanpa pindah aplikasi.',
    image: `${SANGO}/hotel-sunlake.jpg`,
  },
  {
    id: 'services',
    eyebrow: 'Layanan Sango',
    title: 'Semua kebutuhan menginap',
    description:
      'Sewa sepeda, motor, atau mobil hotel. Pesan makanan khas dapur hotel langsung ke kamar.',
    image: `${SANGO}/dining-havana.jpg`,
  },
];

const SWIPE_THRESHOLD = 48;

interface LandingScreenProps {
  onGuest: () => void;
  onMember: () => void;
  memberName?: string | null;
}

export const LandingScreen = ({ onGuest, onMember, memberName = null }: LandingScreenProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const startXRef = useRef<number | null>(null);

  const goToSlide = (index: number) => {
    setActiveIndex(Math.min(SLIDES.length - 1, Math.max(0, index)));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => Math.min(SLIDES.length - 1, current + 1));
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => Math.max(0, current - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const startX = startXRef.current;
    startXRef.current = null;
    if (startX === null) {
      return;
    }

    const delta = event.clientX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }
    goToSlide(activeIndex + (delta < 0 ? 1 : -1));
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  return (
    <section className="fixed inset-0 z-50 mx-auto flex w-full max-w-[480px] flex-col overflow-hidden bg-sango-ink">
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative h-full w-full touch-pan-y select-none"
      >
        {SLIDES.map((slide, index) => (
          <article
            key={slide.id}
            aria-hidden={index !== activeIndex}
            className={cn(
              'absolute inset-0 flex flex-col justify-end px-5 pb-24 pt-24 transition-all duration-500 ease-out',
              index === activeIndex
                ? 'translate-x-0 opacity-100'
                : index < activeIndex
                  ? '-translate-x-full opacity-0'
                  : 'translate-x-full opacity-0'
            )}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="480px"
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sango-ink via-sango-ink/55 to-sango-ink/10" />

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sango-gold">
                {slide.eyebrow}
              </p>
              <h1 className="mt-2 text-[26px] font-bold leading-tight text-sango-cream">
                {slide.title}
              </h1>
              <p className="mt-2 text-[12px] leading-relaxed text-sango-cream/75">
                {slide.description}
              </p>

              {isLastSlide && index === activeIndex ? (
                <div className="mt-5 space-y-2">
                  {memberName ? (
                    <p className="text-[11px] font-semibold text-sango-cream/80">
                      Tersimpan di perangkat ini: {memberName}
                    </p>
                  ) : null}
                  <Button fullWidth size="lg" onClick={onMember}>
                    {memberName ? 'Lanjut sebagai Member' : 'Masuk sebagai Member'}{' '}
                    <ArrowRight size={16} />
                  </Button>
                  <button
                    type="button"
                    onClick={onGuest}
                    className="flex min-h-[52px] w-full items-center justify-center rounded-xl border border-white/30 text-sm font-bold text-sango-cream active:bg-white/10"
                  >
                    Lanjut sebagai Guest
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goToSlide(SLIDES.length - 1)}
        className={cn(
          'absolute right-3 top-[calc(env(safe-area-inset-top,0px)+12px)] min-h-[44px] rounded-full bg-white/15 px-3.5 text-[11px] font-semibold text-sango-cream active:bg-white/25',
          isLastSlide && 'pointer-events-none opacity-0'
        )}
      >
        Lewati
      </button>

      <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] flex items-center justify-center gap-1.5">
        {SLIDES.map((slide, index) => (
          <button
            key={`dot-${slide.id}`}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
            aria-current={index === activeIndex}
            className="flex h-9 w-6 items-center justify-center"
          >
            <span
              className={cn(
                'h-1.5 rounded-full transition-all',
                index === activeIndex ? 'w-5 bg-sango-gold' : 'w-1.5 bg-white/40'
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
};