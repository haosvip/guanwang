
import React from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { motion } from "framer-motion";
import { User } from "lucide-react";

export const TeamSection: React.FC = () => {
  const { config, permissions } = useSiteConfig();
  const { team } = config;

  if (!team?.visible || (permissions.canViewTeam === false)) return null;

  return (
    <Section id="team" className="bg-[var(--color-background)]">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
            {team.title}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">{team.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-card border border-white/5"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <User size={64} />
                  </div>
                )}
                
                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-[var(--color-primary)] font-medium mb-3">{member.role}</p>
                    {member.endorsement && (
                      <p className="text-sm text-gray-300 border-t border-white/20 pt-3 mt-2">
                        "{member.endorsement}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Default Info (Visible when not hovering) */}
              <div className="p-6 text-center group-hover:hidden">
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-1">{member.name}</h3>
                <p className="text-[var(--color-text-secondary)]">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
