
import React from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  type?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  className,
  placeholder,
  type = 'text',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-[#2d3748] border border-[#4a5568] rounded-md shadow-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all hover:border-slate-500"
      />
    </div>
  );
};

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  className,
  rows = 3,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 bg-[#2d3748] border border-[#4a5568] rounded-md shadow-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y transition-all hover:border-slate-500"
      />
    </div>
  );
};

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  className,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#2d3748] border border-[#4a5568] rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none transition-all hover:border-slate-500"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
