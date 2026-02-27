
import React from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { motion } from "framer-motion";
import { Clock, FileText, Check, X, HelpCircle, Lock } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

// Icon mapping helper
const getIcon = (name: string) => {
  switch (name) {
    case "Clock":
      return <Clock size={24} className="text-[var(--color-accent)]" />;
    case "FileText":
      return <FileText size={24} className="text-[var(--color-primary)]" />;
    default:
      return <HelpCircle size={24} />;
  }
};

export const PricingSection: React.FC = () => {
  const { config, permissions } = useSiteConfig();
  const { pricing } = config;
  const navigate = useNavigate();

  if (!pricing?.visible) return null;

  const canView = permissions.canViewPricing;

  if (!canView) {
    return (
      <Section id="pricing" className="bg-[var(--color-background)]">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              {pricing.title}
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">{pricing.subtitle}</p>
          </div>
          <div className="max-w-4xl mx-auto bg-[var(--color-surface)] rounded-2xl p-12 text-center border border-white/10 shadow-card">
            <Lock size={48} className="mx-auto text-[var(--color-primary)] mb-6" />
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">需要权限访问</h3>
            <p className="text-[var(--color-text-secondary)] mb-8">详细价格方案仅对 VIP 用户开放，请登录后查看。</p>
            <button
              onClick={() => navigate('/user-login')}
              className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              立即登录
            </button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="pricing" className="bg-[var(--color-background)]">
      <Container>
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
            style={{
              color: pricing.titleStyle?.color,
              fontSize: pricing.titleStyle?.fontSize,
              fontWeight: pricing.titleStyle?.fontWeight,
              fontFamily: pricing.titleStyle?.fontFamily,
            }}
          >
            {pricing.title}
          </h2>
          <p 
            className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto"
            style={{
              color: pricing.subtitleStyle?.color,
              fontSize: pricing.subtitleStyle?.fontSize,
              fontWeight: pricing.subtitleStyle?.fontWeight,
              fontFamily: pricing.subtitleStyle?.fontFamily,
            }}
          >
            {pricing.subtitle}
          </p>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto pb-8 mb-12">
          <div className="min-w-[800px] bg-[var(--color-surface)] rounded-2xl shadow-card border border-white/5 overflow-hidden">
            {/* Table Header (Plans) */}
            <div className="grid grid-cols-5 bg-white/5 border-b border-white/5">
              <div className="p-6 flex items-center justify-center font-bold text-[var(--color-text-secondary)]">
                服务权益
              </div>
              {pricing.plans.map((plan, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 text-center relative transition-colors duration-300",
                    plan.highlight ? "bg-[var(--color-primary)]/10" : ""
                  )}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-b-lg shadow-sm">
                      推荐
                    </div>
                  )}
                  <h3 
                    className="text-xl font-bold mb-2 text-[var(--color-text)]"
                    style={{ color: plan.nameColor }}
                  >
                    {plan.name}
                  </h3>
                  <div 
                    className="text-2xl font-bold text-[var(--color-primary)] mb-2"
                    style={{ color: plan.priceColor }}
                  >
                    {plan.price}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{plan.description}</p>
                </div>
              ))}
            </div>

            {/* Table Body (Features) */}
            {pricing.table.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "grid grid-cols-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors",
                  index % 2 === 0 ? "bg-transparent" : "bg-white/5"
                )}
              >
                <div className="p-4 md:p-6 font-medium text-[var(--color-text)] flex items-center pl-8">
                  {row.feature}
                </div>
                {[row.basic, row.standard, row.premium, row.vip].map((value, i) => (
                  <div
                    key={i}
                    className="p-4 md:p-6 text-center text-[var(--color-text-secondary)] flex items-center justify-center border-l border-white/5"
                  >
                    {typeof value === "boolean" ? (
                      value ? (
                        <Check className="text-[var(--color-accent)]" size={20} /> // Using accent for check
                      ) : (
                        <X className="text-[var(--color-text-secondary)]/50" size={20} />
                      )
                    ) : (
                      <span className="text-sm md:text-base">{value}</span>
                    )}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Note Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {pricing.notes.map((note, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-[var(--color-surface)] border border-white/5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-3 bg-white/5 rounded-xl shadow-sm">
                {getIcon(note.icon)}
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-[var(--color-text)]">{note.title}</h4>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                  {note.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
