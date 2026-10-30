'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const image = (id: string): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=75`;

const SLIDES = [
  {
    id: 'welcome',
    eyebrow: 'Sango Hotel Management',
    title: 'Selamat datang di Sango',
    description:
      'Empat hotel pilihan di Semarang dan Jakarta. Satu aplikasi untuk menginap, menyewa kendaraan, dan memesan makanan.',
    image: image('photo-1566073771259-6a8506099945'),
  },
  {
    id: 'booking',
    eyebrow: 'Direct Booking',
    title: 'Pesan langsung, harga terbaik',
    description:
      'Pilih kamar, bayar, lalu terima e-voucher. Tanpa biaya perantara dan tanpa pindah aplikasi.',
    image: image('photo-1584132967334-10e028bd69f7'),
  },
  {
    id: 'services',
    eyebrow: 'Layanan Sango',
    title: 'Semua kebutuhan menginap',
    description:
      'Sewa sepeda, motor, atau mobil hotel. Pesan makanan khas dapur hotel langsung ke kamar.',
    image: image('photo-1542314831-068cd1dbfeeb'),
  },
];

interface LandingScreenProps {
  onGuest: () => void;
  onMember: () => void;
}

export const LandingScreen = ({ onGuest, onMember }: LandingScreenProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const goToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.scrollTo({ top: track.clientHeight * index, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const nextIndex = Math.round(track.scrollTop / track.clientHeight);
    setActiveIndex(Math.min(SLIDES.length - 1, Math.max(0, nextIndex)));
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  return (
    <section className="fixed inset-0 z-50 mx-auto flex w-full max-w-[480px] flex-col overflow-hidden bg-sango-ink">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex h-full snap-y snap-mandatory flex-col overflow-y-auto"
      >
        {SLIDES.map((slide, index) => (
          <article
            key={slide.id}
            className="relative flex h-full w-full shrink-0 snap-start flex-col justify-end px-5 pb-28 pt-24"
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="480px"
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sango-ink via-sango-ink/70 to-sango-ink/25" />

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

              {index === SLIDES.length - 1 ? (
                <div className="mt-5 space-y-2">
                  <Button fullWidth size="lg" onClick={onMember}>
                    Masuk sebagai Member <ArrowRight size={16} />
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

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] flex items-center justify-center gap-1.5">
        {SLIDES.map((slide, index) => (
          <span
            key={`dot-${slide.id}`}
            className={cn(
              'h-1.5 rounded-full transition-all',
              index === activeIndex ? 'w-5 bg-sango-gold' : 'w-1.5 bg-white/40'
            )}
          />
        ))}
      </div>
    </section>
  );
};