
import React, { useEffect, useRef } from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { motion, useInView, useMotionValue, useSpring, Variants } from "framer-motion";
import * as Icons from "lucide-react";
import { TypographySettings } from "../../config/site.config";

// Helper to get icon by name
const getIcon = (name: string) => {
  const Icon = (Icons as any)[name];
  return Icon ? <Icon size={24} /> : <Icons.CheckCircle size={24} />;
};

// CountUp Component
const CountUp: React.FC<{ value: string; className?: string; style?: React.CSSProperties }> = ({ value, className, style }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 400 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Parse number and suffix/prefix
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match ? match[1] : "";
  const number = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : value;
  const isNumber = !!match;

  useEffect(() => {
    if (isInView && isNumber) {
      motionValue.set(number);
    }
  }, [isInView, number, motionValue, isNumber]);

  useEffect(() => {
    if (isNumber) {
      return springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = prefix + Math.floor(latest) + suffix;
        }
      });
    } else {
        if(ref.current) ref.current.textContent = value;
    }
  }, [springValue, prefix, suffix, isNumber, value]);

  return <span ref={ref} className={className} style={style} />;
};

export const HeroSection: React.FC = () => {
  const { config } = useSiteConfig();
  const { hero } = config;

  if (!hero.visible) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  // Helper to apply typography styles
  const getStyle = (settings?: TypographySettings) => ({
    color: settings?.color,
    fontSize: settings?.fontSize,
    fontWeight: settings?.fontWeight,
    fontFamily: settings?.fontFamily,
  });

  // Determine grid columns based on position preset
  let gridCols = "grid-cols-2 md:grid-cols-3";
  let justifyContent = "justify-center";
  
  if (hero.badgePosition === 'grid-2') gridCols = "grid-cols-2";
  else if (hero.badgePosition === 'grid-3') gridCols = "grid-cols-3";
  else if (hero.badgePosition === 'grid-4') gridCols = "grid-cols-2 md:grid-cols-4";
  else if (hero.badgePosition === 'left') justifyContent = "justify-start";
  else if (hero.badgePosition === 'right') justifyContent = "justify-end";

  // If not grid preset, use flexbox for better centering/alignment
  const isFlexLayout = ['left', 'center', 'right'].includes(hero.badgePosition || 'center');

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-slate-900">
      {/* Background: Image or Video */}
      <div className="absolute inset-0 z-0">
        {hero.backgroundType === 'video' && hero.coverImage ? (
           <video
            src={hero.coverImage}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : hero.coverImage ? (
          <img 
            src={hero.coverImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-slate-900/50"
          style={{
            backgroundColor: hero.overlayColor,
            opacity: hero.overlayOpacity ?? 0.6
          }}
        ></div>
      </div>
      
      <Container className="relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight drop-shadow-lg"
            variants={itemVariants}
            style={getStyle(hero.titleStyle)}
          >
            {hero.title}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed"
            variants={itemVariants}
            style={getStyle(hero.subtitleStyle)}
          >
            {hero.subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
            variants={itemVariants}
          >
            {hero.ctaButtons.map((btn, index) => (
              <a key={index} href={btn.link}>
                <Button
                  variant={btn.variant || (btn.primary ? "primary" : "outline")}
                  size={btn.size || "lg"}
                  style={{
                    backgroundColor: btn.color,
                    color: btn.textColor,
                    borderColor: btn.variant === 'outline' ? (btn.color || 'currentColor') : undefined
                  }}
                >
                  {btn.text}
                </Button>
              </a>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className={`max-w-5xl mx-auto ${isFlexLayout ? `flex flex-wrap gap-12 ${justifyContent}` : `grid ${gridCols} gap-y-8 gap-x-4`}`}
            variants={itemVariants}
          >
            {hero.trustBadges.map((badge, index) => {
              const isObject = typeof badge === 'object';
              const text = isObject ? badge.text : badge;
              const number = isObject ? badge.number : null;
              const icon = isObject ? badge.icon : null;
              
              const showSeparator = hero.showSeparator && index !== hero.trustBadges.length - 1;

              return (
                <div 
                  key={index} 
                  className={`flex flex-col items-center justify-center p-2 relative ${showSeparator && isFlexLayout ? 'border-r border-white/10 pr-12' : ''}`}
                >
                  {/* Number (Highlighted) */}
                  {number && (
                    <div 
                      className="text-4xl md:text-5xl font-bold text-[var(--color-accent)] mb-2 tracking-tight"
                      style={getStyle(hero.badgeNumberStyle)}
                    >
                      <CountUp value={number} />
                    </div>
                  )}

                  {/* Icon & Text */}
                  <div className="flex items-center gap-2 text-slate-400">
                    {icon && (
                       icon.includes('/') || icon.includes('.') ? (
                         <img src={icon} alt="" className="w-5 h-5 object-contain opacity-80" />
                       ) : (
                         <span className="opacity-80 scale-90">{getIcon(icon)}</span>
                       )
                    )}
                    <span 
                      className="text-sm md:text-base font-medium uppercase tracking-wider"
                      style={getStyle(hero.badgeStyle)}
                    >
                      {text}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
