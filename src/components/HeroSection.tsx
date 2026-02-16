import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

// Product images for carousel
import product3 from '@/assets/products/product-3.png';
import product4 from '@/assets/products/product-4.png';
import product5 from '@/assets/products/product-5.png';
import product7 from '@/assets/products/product-7.png';
import product8 from '@/assets/products/product-8.png';
import tiesBlue from '@/assets/products/ties-blue.png';
import glassware from '@/assets/products/glassware.png';

const carouselItems = [
  { img: product3, label: 'Crystal Awards' },
  { img: tiesBlue, label: 'Premium Ties' },
  { img: glassware, label: 'Custom Glassware' },
  { img: product4, label: 'Leather Goods' },
  { img: product5, label: 'Branded Pens' },
  { img: product7, label: 'Office Accessories' },
  { img: product8, label: 'Gift Sets' },
];

const stats = [
  { value: '500+', label: 'Clients' },
  { value: '10+', label: 'Years' },
  { value: '1000+', label: 'Products' },
  { value: '50+', label: 'Countries' },
];

const HeroSection = () => {
  const { t } = useLanguage();
  const { get } = useSiteSettings();
  const [current, setCurrent] = useState(0);

  const title = get('hero', 'title', t('hero.title'));
  const subtitle = get('hero', 'subtitle', t('hero.subtitle'));
  const ctaPrimary = get('hero', 'cta_primary', t('hero.cta'));

  const next = useCallback(() => setCurrent(i => (i + 1) % carouselItems.length), []);
  const prev = useCallback(() => setCurrent(i => (i - 1 + carouselItems.length) % carouselItems.length), []);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="home" className="relative overflow-hidden bg-foreground">
      {/* Background image with overlay */}
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/70 to-primary/30" />

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[500px] lg:min-h-[560px]">

          {/* Left — Value Proposition */}
          <div className="flex flex-col justify-center" style={{ animation: 'heroFadeUp 0.7s ease-out both' }}>
            <span
              className="inline-flex items-center gap-2 text-primary-foreground/60 text-xs font-semibold tracking-[0.2em] uppercase mb-5"
              style={{ fontFamily: 'Montserrat, DM Sans, sans-serif' }}
            >
              <span className="w-8 h-px bg-primary" />
              S. M. Trade International
            </span>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 text-white"
              style={{ animation: 'heroFadeUp 0.7s 0.1s ease-out both' }}
            >
              {title}
            </h1>

            <p
              className="text-base md:text-lg text-white/60 mb-8 max-w-lg leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif', animation: 'heroFadeUp 0.7s 0.2s ease-out both' }}
            >
              {subtitle}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{ animation: 'heroFadeUp 0.7s 0.3s ease-out both' }}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base rounded-lg shadow-lg"
              >
                <a href="#contact">
                  <span className="flex items-center gap-2 font-semibold" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {ctaPrimary}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white bg-white/5 backdrop-blur-sm px-8 py-6 text-base rounded-lg hover:bg-white/10 hover:border-white/30"
              >
                <a href="#products">
                  <span className="font-semibold" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {t('hero.contact')}
                  </span>
                </a>
              </Button>
            </div>

            {/* Stats row */}
            <div
              className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10"
              style={{ animation: 'heroFadeUp 0.7s 0.5s ease-out both' }}
            >
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-white font-bold text-xl md:text-2xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.value}</div>
                  <div className="text-white/40 text-[10px] md:text-xs tracking-wider uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D Product Carousel */}
          <div
            className="relative flex flex-col items-center justify-center"
            style={{ animation: 'heroFadeUp 0.7s 0.4s ease-out both' }}
          >
            <div className="relative w-full max-w-md" style={{ perspective: '1000px' }}>
              {/* Glow behind carousel */}
              <div className="absolute inset-12 rounded-full bg-accent/15 blur-3xl" />

              {/* 3D Carousel ring */}
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div
                  className="relative w-48 h-48 md:w-56 md:h-56"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${-current * (360 / carouselItems.length)}deg)`,
                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  {carouselItems.map((item, i) => {
                    const angle = (360 / carouselItems.length) * i;
                    const radius = 220;
                    return (
                      <div
                        key={i}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <div className={`relative p-4 rounded-2xl border transition-all duration-500 bg-white ${
                          i === current
                            ? 'border-accent/30 shadow-2xl shadow-accent/20 scale-110'
                            : 'border-gray-200 scale-90 opacity-60'
                        }`}>
                          <img
                            src={item.img}
                            alt={item.label}
                            className="w-36 h-36 md:w-44 md:h-44 object-contain"
                          />
                          <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap transition-all duration-500 ${
                            i === current
                              ? 'bg-accent text-white opacity-100'
                              : 'bg-white/10 text-white/50 opacity-0'
                          }`}
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {item.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reflection/floor effect */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-accent/10 blur-2xl rounded-full" />
            </div>

            {/* Carousel controls */}
            <div className="flex items-center gap-6 mt-6">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {carouselItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all duration-400 ${
                      i === current ? 'w-7 h-2 bg-accent' : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-11 h-11 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
