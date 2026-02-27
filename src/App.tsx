
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { CarouselSection } from './components/sections/CarouselSection';
import { PricingSection } from './components/sections/PricingSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { EnterpriseSection } from './components/sections/EnterpriseSection';
import { TeamSection } from './components/sections/TeamSection';
import { PartnersSection } from './components/sections/PartnersSection';
import { ThemeProvider } from './components/layout/ThemeProvider';
import Admin from './pages/Admin';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import { useSiteConfig } from './store/useSiteConfig';

const MainLayout: React.FC = () => {
  const { fetchConfig, loginWithCode } = useSiteConfig();
  const location = useLocation();

  useEffect(() => {
    fetchConfig();
    
    // Restore user session
    const savedCode = localStorage.getItem('userCode');
    if (savedCode) {
      loginWithCode(savedCode);
    }
  }, [fetchConfig, loginWithCode]);

  // Scroll to section based on hash
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-text)] transition-colors duration-300">
        <Header />
        <main>
          <HeroSection />
          <EnterpriseSection />
          <CarouselSection />
          <PricingSection />
          <ProcessSection />
          <TeamSection />
          <PartnersSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin" element={
          <ThemeProvider>
            <Admin />
          </ThemeProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
