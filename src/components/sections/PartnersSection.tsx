
import React, { useState } from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { motion } from "framer-motion";

export const PartnersSection: React.FC = () => {
  const { config } = useSiteConfig();
  const { partners } = config;
  const [isPaused, setIsPaused] = useState(false);

  if (!partners?.visible) return null;

  return (
    <section className="py-12 bg-[var(--color-surface)] border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-heading)] opacity-80">
          {partners.title}
        </h2>
      </div>
      
      <div 
        className="flex overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-16 px-8 whitespace-nowrap"
          animate={{ x: isPaused ? undefined : ["0%", "-50%"] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: partners.speed || 20,
              ease: "linear",
            }
          }}
        >
          {/* Double the items to create seamless loop */}
          {[...partners.items, ...partners.items].map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              {item.logo ? (
                <img src={item.logo} alt={item.name} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" />
              ) : (
                <span 
                  className="text-xl font-bold"
                  style={{
                    color: partners.textStyle?.color || 'var(--color-text-secondary)',
                    fontSize: partners.textStyle?.fontSize || '1.25rem',
                    fontWeight: partners.textStyle?.fontWeight || 'bold',
                    fontFamily: partners.textStyle?.fontFamily || 'inherit',
                  }}
                >
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
