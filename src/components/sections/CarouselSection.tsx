
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

export const CarouselSection: React.FC = () => {
  const { config, permissions } = useSiteConfig();
  const { carousel } = config;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const navigate = useNavigate();

  if (!carousel?.visible) return null;

  // Filter images based on active category and permissions
  const filteredImages = useMemo(() => {
    let images = carousel.images;
    
    // Filter by category
    if (activeCategory !== "all") {
      images = images.filter((img) => img.categoryId === activeCategory);
    }

    // Filter by permissions (hide private cases if not allowed)
    // Actually, requirement says "private cases need vip account to view", 
    // implying they might be visible but locked, or hidden entirely. 
    // Let's hide them to avoid confusion, or show them with a lock overlay?
    // User said: "分开放和私密案例，开放游客可自由看，私密案例需要用vip账户查看"
    // Let's filter them out if no permission to view private cases.
    if (!permissions.canViewPrivateCases) {
      images = images.filter((img) => !img.isPrivate);
    }

    return images;
  }, [carousel.images, activeCategory, permissions.canViewPrivateCases]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, permissions.canViewPrivateCases]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  useEffect(() => {
    if (!isPaused && filteredImages.length > 1) {
      const timer = setInterval(() => {
        nextSlide();
      }, carousel.autoplayInterval);
      return () => clearInterval(timer);
    }
  }, [isPaused, nextSlide, carousel.autoplayInterval, filteredImages.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <Section id="cases" className="bg-[var(--color-background)]">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text)]">{carousel.title}</h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">{carousel.subtitle}</p>
        </div>

        {/* Categories */}
        {carousel.categories && carousel.categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === "all"
                  ? "bg-[var(--color-primary)] text-white shadow-lg"
                  : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-white/10"
              )}
            >
              全部案例
            </button>
            {carousel.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-[var(--color-primary)] text-white shadow-lg"
                    : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-white/10"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div
          className="relative max-w-5xl mx-auto aspect-video rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden bg-[var(--color-surface)] border border-white/5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {filteredImages.length > 0 ? (
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={`${activeCategory}-${currentIndex}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
                className="absolute inset-0"
              >
                <img
                  src={filteredImages[currentIndex].src}
                  alt={filteredImages[currentIndex].alt}
                  className="w-full h-full object-cover"
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                />
                {filteredImages[currentIndex].title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 text-white">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {filteredImages[currentIndex].title}
                      {filteredImages[currentIndex].isPrivate && <Lock size={16} className="text-amber-400" />}
                    </h3>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] p-8 text-center">
              <p className="mb-4">暂无可见案例</p>
              {!permissions.canViewPrivateCases && (
                <p className="text-sm">
                  部分案例为私密展示，
                  <button onClick={() => navigate('/user-login')} className="text-[var(--color-primary)] hover:underline">
                    登录 VIP 账户
                  </button>
                  以查看更多。
                </p>
              )}
            </div>
          )}

          {/* Controls */}
          {carousel.showArrows && filteredImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 z-10 border border-white/10"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 z-10 border border-white/10"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Indicators */}
          {carousel.showIndicators && filteredImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {filteredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300 shadow-sm",
                    index === currentIndex
                      ? "bg-white w-8"
                      : "bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};
