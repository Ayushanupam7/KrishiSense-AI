import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiHome, HiBeaker, HiTrendingUp, HiUser, HiUserGroup, HiSun, HiMoon } from 'react-icons/hi';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <>
      {/* Desktop Header Nav */}
      <header className="desktop-nav glass-card">
        <div className="nav-container">
          <div className="logo">
            <span className="emoji">🌾</span>
            <span className="text">KrishiSense <span className="ai-badge">AI</span></span>
          </div>
          <nav className="links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_home')}</NavLink>
            <NavLink to="/analysis" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_analysis')}</NavLink>
            <NavLink to="/market" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_market')}</NavLink>
            <NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_community')}</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_profile')}</NavLink>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Dark Mode">
              {isDark ? <HiSun /> : <HiMoon />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="mobile-top-bar glass-card">
        <div className="logo-mini">
          <span className="emoji">🌾</span>
          <span className="text">KrishiSense <span className="ai-badge">AI</span></span>
        </div>
        <div className="top-actions">
          <button onClick={toggleTheme} className="theme-toggle-mobile" aria-label="Toggle Dark Mode">
            {isDark ? <HiSun /> : <HiMoon />}
          </button>
          <div className="user-icon-mini">
            <HiUser />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <HiHome />
          <span>{t('nav_home')}</span>
        </NavLink>
        <NavLink to="/analysis" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <HiBeaker />
          <span>{t('nav_analysis')}</span>
        </NavLink>
        <NavLink to="/market" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <HiTrendingUp />
          <span>{t('nav_market')}</span>
        </NavLink>
        <NavLink to="/community" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <HiUserGroup />
          <span>{t('nav_community')}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <HiUser />
          <span>{t('nav_profile')}</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
