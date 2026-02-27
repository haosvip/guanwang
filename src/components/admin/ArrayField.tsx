
import React from 'react';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

interface ArrayFieldProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, onChange: (newItem: T) => void) => React.ReactNode;
  onAdd: () => T;
  className?: string;
}

export function ArrayField<T>({
  label,
  items,
  onChange,
  renderItem,
  onAdd,
  className,
}: ArrayFieldProps<T>) {
  const handleAdd = () => {
    onChange([...items, onAdd()]);
  };

  const handleRemove = (index: number) => {
    if (window.confirm('确定要删除此项吗？此操作无法撤销。')) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    onChange(newItems);
  };

  const handleItemChange = (index: number, newItem: T) => {
    const newItems = [...items];
    newItems[index] = newItem;
    onChange(newItems);
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-white">{label}</label>
        <Button
          type="button"
          onClick={handleAdd}
          size="sm"
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm"
        >
          <Plus size={14} className="mr-1" />
          添加新项
        </Button>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="group relative bg-[#1a202c] border border-slate-700 rounded-lg p-4 transition-all hover:bg-[#2d3748] hover:border-slate-600"
          >
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2d3748] rounded-md shadow-sm border border-slate-600 p-1">
              <button
                type="button"
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                title="上移"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 'down')}
                disabled={index === items.length - 1}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                title="下移"
              >
                <ChevronDown size={14} />
              </button>
              <div className="w-px h-3 bg-slate-600 mx-1"></div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded"
                title="删除此项"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-2 text-slate-500 cursor-grab active:cursor-grabbing">
                <GripVertical size={16} />
              </div>
              <div className="flex-1">
                {renderItem(item, index, (newItem) => handleItemChange(index, newItem))}
              </div>
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 bg-[#1a202c] border border-dashed border-slate-700 rounded-lg text-slate-400 text-sm">
            暂无数据，点击“添加新项”开始创建。
          </div>
        )}
      </div>
    </div>
  );
}
