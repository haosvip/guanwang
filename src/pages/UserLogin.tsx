
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../store/useSiteConfig';
import { Button } from '../components/ui/Button';

const UserLogin: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginWithCode } = useSiteConfig();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginWithCode(code);
    
    if (success) {
      navigate('/');
    } else {
      setError('访问码无效，请重新输入');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-card w-96 border border-white/10">
        <h2 className="text-2xl font-bold mb-2 text-center text-[var(--color-text)]">用户访问验证</h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-6 text-sm">请输入访问码以查看完整内容</p>
        
        {error && <p className="text-red-500 mb-4 text-center text-sm bg-red-500/10 py-2 rounded">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">访问码</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-background)] border border-white/10 rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder-[var(--color-text-secondary)]/50"
              placeholder="请输入访问码"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full py-3 text-lg font-bold"
          >
            进入网站
          </Button>
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => {
                loginWithCode('guest');
                navigate('/');
              }}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] underline"
            >
              以游客身份浏览 &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
