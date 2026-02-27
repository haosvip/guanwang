
import React, { useState, useEffect } from "react";
import { useSiteConfig } from "../../store/useSiteConfig";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { config, currentUserCode, loginWithCode } = useSiteConfig();
  const { navigation } = config;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    loginWithCode('guest');
    localStorage.removeItem('userCode');
    navigate('/user-login');
  };

  const isLoggedIn = currentUserCode !== 'guest';

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-[var(--color-surface)]/90 backdrop-blur-md shadow-md py-2 border-b border-white/5" 
          : "py-4 bg-transparent"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2"
          >
            {navigation.logoImage ? (
              <img src={navigation.logoImage} alt={navigation.logo} className="h-10 w-auto" />
            ) : (
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                {navigation.logo}
              </span>
            )}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.links.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors"
              >
                {link.text}
              </a>
            ))}
            <a href={navigation.cta.href}>
              <Button size="sm">{navigation.cta.text}</Button>
            </a>
            
            {/* User Controls */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-medium">
                  <User size={18} />
                  <span>{config.accessControl?.codes?.find(c => c.code === currentUserCode)?.name || '用户'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-[var(--color-text-secondary)] hover:text-white"
                  title="退出登录"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/user-login')}
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white ml-4"
              >
                登录
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--color-text)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--color-surface)] border-t border-white/10 overflow-hidden"
          >
            <Container className="py-4 flex flex-col space-y-4">
              {navigation.links.map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium py-2 block"
                  onClick={() => setIsOpen(false)}
                >
                  {link.text}
                </a>
              ))}
              <a href={navigation.cta.href} onClick={() => setIsOpen(false)}>
                <Button className="w-full">{navigation.cta.text}</Button>
              </a>
              <div className="pt-4 border-t border-white/10">
                 {isLoggedIn ? (
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] w-full py-2"
                  >
                    <LogOut size={18} />
                    退出登录 ({config.accessControl?.codes?.find(c => c.code === currentUserCode)?.name || '用户'})
                  </button>
                ) : (
                  <button 
                    onClick={() => { navigate('/user-login'); setIsOpen(false); }}
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] w-full py-2"
                  >
                    <User size={18} />
                    用户登录
                  </button>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
