
import React from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

// Helper to get icon by name
const getIcon = (name: string) => {
  const Icon = (Icons as any)[name];
  return Icon ? <Icon size={32} /> : <Icons.CheckCircle size={32} />;
};

export const ProcessSection: React.FC = () => {
  const { config } = useSiteConfig();
  const { process } = config;

  if (!process.visible) return null;

  // Helper to render number based on preset
  const renderNumber = (preset: string = 'default', number: number) => {
    const numStr = number < 10 ? `0${number}` : `${number}`;
    
    switch (preset) {
      case 'circle':
        return (
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-[var(--color-primary)]/30">
            {numStr}
          </div>
        );
      case 'outline':
        return (
          <div className="w-24 h-24 rounded-full border-4 border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center text-4xl font-bold">
            {numStr}
          </div>
        );
      case 'gradient':
        return (
          <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-80">
            {numStr}
          </span>
        );
      case 'minimal':
        return (
          <div className="relative inline-block">
            <span className="text-6xl font-light text-[var(--color-text-heading)]">{numStr}</span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-[var(--color-primary)]"></div>
          </div>
        );
      case 'floating':
        return (
          <span className="text-9xl font-bold text-[var(--color-surface)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] opacity-80" style={{ WebkitTextStroke: '1px var(--color-primary)' }}>
            {numStr}
          </span>
        );
      case 'default':
      default:
        return (
           <div className="text-8xl font-bold text-[var(--color-surface)] opacity-50 select-none">
              {numStr}
           </div>
        );
    }
  };

  return (
    <Section id="process" className="bg-[var(--color-background)]">
      <Container>
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text-heading)]"
            style={{ 
              color: process.titleStyle?.color,
              fontSize: process.titleStyle?.fontSize,
              fontWeight: process.titleStyle?.fontWeight,
              fontFamily: process.titleStyle?.fontFamily
            }}
          >
            {process.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--color-text-secondary)]"
            style={{ 
              color: process.subtitleStyle?.color,
              fontSize: process.subtitleStyle?.fontSize,
              fontWeight: process.subtitleStyle?.fontWeight,
              fontFamily: process.subtitleStyle?.fontFamily
            }}
          >
            {process.subtitle}
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[var(--color-primary)]/30 to-transparent -translate-x-1/2"></div>

          <div className="space-y-12">
            {process.steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 relative group ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content Side */}
                  <div className={`flex-1 w-full md:text-${isEven ? 'right' : 'left'}`}>
                    <div className={`bg-[var(--color-surface)]/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/10 hover:-translate-y-1 relative overflow-hidden`}>
                      <h3 
                        className={`text-2xl font-bold mb-3 text-[var(--color-text-heading)] flex items-center gap-3 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}
                        style={{ 
                          color: step.titleStyle?.color,
                          fontSize: step.titleStyle?.fontSize,
                          fontWeight: step.titleStyle?.fontWeight,
                          fontFamily: step.titleStyle?.fontFamily
                        }}
                      >
                        {step.title}
                      </h3>
                      <p 
                        className="text-[var(--color-text-secondary)] mb-6 leading-relaxed"
                        style={{ 
                          color: step.descStyle?.color,
                          fontSize: step.descStyle?.fontSize,
                          fontWeight: step.descStyle?.fontWeight,
                          fontFamily: step.descStyle?.fontFamily
                        }}
                      >
                        {step.description}
                      </p>
                      <ul className={`space-y-2 inline-block text-left`}>
                        {step.items.map((item, idx) => (
                          <li 
                            key={idx} 
                            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]"
                            style={{ 
                              color: step.itemStyle?.color,
                              fontSize: step.itemStyle?.fontSize,
                              fontWeight: step.itemStyle?.fontWeight,
                              fontFamily: step.itemStyle?.fontFamily
                            }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: step.bulletColor || 'var(--color-primary)' }}
                            ></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] border-4 border-[var(--color-background)] shadow-xl flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300">
                      {getIcon(step.icon)}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[var(--color-primary)]/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping -z-10"></div>
                  </div>

                  {/* Empty Side (for Number) */}
                  <div className={`flex-1 w-full hidden md:flex items-center ${isEven ? 'justify-start pl-8' : 'justify-end pr-8'}`}>
                     {renderNumber(step.numberPreset, step.number)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
};
