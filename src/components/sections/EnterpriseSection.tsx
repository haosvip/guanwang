
import React from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { motion } from "framer-motion";

export const EnterpriseSection: React.FC = () => {
  const { config, permissions } = useSiteConfig();
  const { enterprise } = config;

  if (!enterprise?.visible || (permissions.canViewEnterprise === false)) return null;

  const contentStyle = {
    color: enterprise.contentStyle?.color,
    fontSize: enterprise.contentStyle?.fontSize,
    fontWeight: enterprise.contentStyle?.fontWeight,
    fontFamily: enterprise.contentStyle?.fontFamily,
    lineHeight: enterprise.contentStyle?.lineHeight,
    marginBottom: enterprise.contentStyle?.marginBottom,
  };

  return (
    <Section 
      id="enterprise" 
      className="relative overflow-hidden py-24"
      style={{
        background: `linear-gradient(135deg, ${enterprise.gradientStart || '#1e293b'} 0%, ${enterprise.gradientEnd || '#0f172a'} 100%)`
      }}
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--color-text-heading)] tracking-tight">
                {enterprise.title}
              </h2>
              <p className="text-xl text-[var(--color-primary)] font-medium">
                {enterprise.subtitle}
              </p>
            </div>
            
            <div 
              className="prose prose-lg prose-invert max-w-none text-[var(--color-text-secondary)]"
            >
              <p style={contentStyle} className="whitespace-pre-line">
                {enterprise.content}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {enterprise.mapImage ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src={enterprise.mapImage} 
                  alt="Enterprise Location" 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-[var(--color-text-muted)] flex-col gap-2">
                <span className="text-lg font-medium">暂无地图/展示图片</span>
                <span className="text-sm opacity-60">请在后台上传图片</span>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};
