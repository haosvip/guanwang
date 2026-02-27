
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件');
      return;
    }
    
    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      if (data.success) {
        onChange(data.url);
      } else {
        setError('服务器上传失败');
      }
    } catch (err) {
      setError('上传过程发生网络错误');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      
      <div className="flex gap-4 items-start">
        {/* Preview */}
        <div className="relative w-32 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
          {value ? (
            <img 
              src={value} 
              alt="预览" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon size={24} />
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="flex-1">
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-300 hover:border-slate-400 bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
            
            <div className="flex flex-col items-center justify-center text-center">
              {isUploading ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm font-medium">正在上传...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-600 mb-2">
                    拖拽文件到此处 或{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 font-medium hover:underline focus:outline-none"
                    >
                      点击浏览
                    </button>
                  </p>
                  <p className="text-xs text-slate-400">支持 PNG, JPG, GIF (最大 5MB)</p>
                </>
              )}
            </div>
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};
