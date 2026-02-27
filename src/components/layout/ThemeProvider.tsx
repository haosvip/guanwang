
import React, { useEffect } from 'react';
import { useSiteConfig } from '../../store/useSiteConfig';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useSiteConfig();
  // Defensive check
  const theme = config?.theme;

  useEffect(() => {
    if (!theme || !theme.colors) return;

    const root = document.documentElement;
    
    // Colors
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    
    // Dark mode colors (defaulting if not present in old config)
    root.style.setProperty('--color-background', theme.colors.background || '#0F172A');
    root.style.setProperty('--color-surface', theme.colors.surface || '#1E293B');
    root.style.setProperty('--color-text', theme.colors.text || '#F8FAFC');
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary || '#94A3B8');
    root.style.setProperty('--color-text-heading', theme.colors.textHeading || theme.colors.text || '#FFFFFF');
    root.style.setProperty('--color-text-muted', theme.colors.textMuted || '#64748B');
    root.style.setProperty('--color-text-inverse', theme.colors.textInverse || '#FFFFFF');
    
    // Helper for gradient (Primary Dark) - simple darkening logic or just use primary
    // Ideally this should be in config, but for now let's reuse primary or calculate
    root.style.setProperty('--color-primary-dark', theme.colors.primary); 

    // Fonts
    root.style.setProperty('--font-heading', theme.fonts?.heading || 'Inter, sans-serif');
    root.style.setProperty('--font-body', theme.fonts?.body || 'Inter, sans-serif');

    // Border Radius
    root.style.setProperty('--radius-sm', theme.borderRadius?.sm || '0.25rem');
    root.style.setProperty('--radius-md', theme.borderRadius?.md || '0.5rem');
    root.style.setProperty('--radius-lg', theme.borderRadius?.lg || '1rem');
    root.style.setProperty('--radius-xl', theme.borderRadius?.xl || '1.5rem');

    // Force dark mode on body
    document.body.classList.add('dark');
    document.body.style.backgroundColor = 'var(--color-background)';
    document.body.style.color = 'var(--color-text)';

  }, [theme]);

  if (!theme) return null; // Prevent rendering if theme is missing

  return <>{children}</>;
};
