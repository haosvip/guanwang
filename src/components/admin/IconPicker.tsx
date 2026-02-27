
import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';

interface IconPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  label,
  value,
  onChange,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter icons based on search
  const iconList = useMemo(() => {
    return Object.keys(Icons)
      .filter((name) => name !== 'createLucideIcon' && name !== 'default')
      .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 50); // Limit to 50 for performance
  }, [searchTerm]);

  const SelectedIcon = (Icons as any)[value] || Icons.HelpCircle;
  const isUrl = value.includes('/') || value.includes('.');

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <div className="space-y-2">
        {/* Selected Preview & Input */}
        <div className="flex gap-2">
          <div className="w-10 h-10 flex items-center justify-center bg-slate-800 border border-slate-600 rounded-md text-white">
            {isUrl ? (
              <img src={value} alt="icon" className="w-6 h-6 object-contain" />
            ) : (
              <SelectedIcon size={20} />
            )}
          </div>
          <div className="flex-1 relative">
             <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="输入图标名称或图片 URL"
              className="w-full h-10 px-3 bg-[#2d3748] border border-[#4a5568] rounded-md shadow-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Icon Grid Dropdown */}
        {isOpen && (
          <div className="bg-[#2d3748] border border-[#4a5568] rounded-md p-3 shadow-xl z-10 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索图标..."
              className="w-full px-3 py-2 mb-3 bg-slate-800 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {iconList.map((name) => {
                const Icon = (Icons as any)[name];
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors ${
                      value === name ? 'bg-blue-600 text-white' : ''
                    }`}
                    title={name}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
            {iconList.length === 0 && (
               <div className="text-center text-slate-400 text-sm py-2">未找到图标</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
