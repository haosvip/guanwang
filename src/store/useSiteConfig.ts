
import { create } from 'zustand';
import { SiteConfig, siteConfig as defaultConfig } from '../config/site.config';

interface SiteConfigStore {
  config: SiteConfig;
  isLoading: boolean;
  error: string | null;
  currentUserCode: string;
  permissions: {
    canViewPricing: boolean;
    canViewPrivateCases: boolean;
    canViewTeam: boolean;
    canViewEnterprise: boolean;
    canDownloadSource: boolean;
  };
  loginWithCode: (code: string) => boolean;
  fetchConfig: () => Promise<void>;
  updateConfig: (newConfig: SiteConfig) => Promise<void>;
}

// Simple deep merge helper
function deepMerge(target: any, source: any): any {
  // Create a new object to avoid mutating target
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          // Recursively merge
          output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export const useSiteConfig = create<SiteConfigStore>((set, get) => ({
  config: defaultConfig,
  isLoading: false,
  error: null,
  currentUserCode: 'guest',
  permissions: {
    canViewPricing: true,
    canViewPrivateCases: false,
    canViewTeam: true,
    canViewEnterprise: true,
    canDownloadSource: false,
  },
  
  loginWithCode: (code: string) => {
    const { config } = get();
    
    // Safety check for config structure
    if (!config?.accessControl?.codes) {
      console.warn('Access control config missing or invalid');
      return false;
    }

    // Find matching code in config
    const access = config.accessControl.codes.find(c => c.code === code);
    
    if (access) {
      set({ 
        currentUserCode: code,
        permissions: {
          canViewPricing: access.permissions.canViewPricing,
          canViewPrivateCases: access.permissions.canViewPrivateCases,
          canViewTeam: access.permissions.canViewTeam ?? true,
          canViewEnterprise: access.permissions.canViewEnterprise ?? true,
          canDownloadSource: access.permissions.canDownloadSource ?? false
        }
      });
      localStorage.setItem('userCode', code);
      return true;
    }
    
    // Default to guest if not found (or return false)
    if (code === 'guest') {
       set({ 
        currentUserCode: 'guest',
        permissions: { 
          canViewPricing: true, 
          canViewPrivateCases: false,
          canViewTeam: true,
          canViewEnterprise: true,
          canDownloadSource: false
        }
      });
      localStorage.setItem('userCode', 'guest');
      return true;
    }

    return false;
  },

  fetchConfig: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/config');
      if (!response.ok) throw new Error('Failed to fetch config');
      const data = await response.json();
      
      // Merge remote config with default config
      const mergedConfig = deepMerge(defaultConfig, data);
      set({ config: mergedConfig, isLoading: false });

      // Re-validate current user permissions after config load
      const savedCode = localStorage.getItem('userCode') || 'guest';
      get().loginWithCode(savedCode);

    } catch (error) {
      console.error('Error fetching config:', error);
      set({ isLoading: false, error: 'Failed to load remote config, using local default.' });
    }
  },
  
  updateConfig: async (newConfig: SiteConfig) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      if (!response.ok) throw new Error('Failed to update config');
      set({ config: newConfig, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to update config' });
      throw error;
    }
  },
}));
