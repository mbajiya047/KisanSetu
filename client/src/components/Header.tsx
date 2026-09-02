import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Sprout,
  Globe,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  Layers,
  Building,
  HelpCircle,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount, setIsDrawerOpen } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'MANDI_OFFICER':
        return '/officer/dashboard';
      case 'DISTRICT_ADMIN':
        return '/district-admin';
      case 'STATE_ADMIN':
        return '/state-admin';
      case 'SUPER_ADMIN':
        return '/admin';
      case 'FARMER':
      default:
        return '/farmer/dashboard';
    }
  };

  const navLinks = [
    { to: '/', label: t.navHome, icon: Sprout },
    { to: '/states', label: t.navStates, icon: Layers },
    { to: '/centers', label: t.navCenters, icon: Building },
    { to: '/mandi-status', label: t.navMandiStatus, icon: Activity },
    { to: '/help', label: t.navHelp, icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      {/* Tricolor Government Top Strip */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-agri-700 to-agri-900 flex items-center justify-center text-white shadow-md shadow-agri-900/20 group-hover:scale-105 transition-all">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-black tracking-tight text-agri-900 font-sans">
                  {language === 'hi' ? 'किसान' : 'Kisan'}<span className="text-harvest-600">{language === 'hi' ? 'सेतु' : 'Setu'}</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-agri-100 text-agri-800 border border-agri-200">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-tight">
                {t.brandTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-agri-50 text-agri-800 font-semibold border border-agri-200/60'
                      : 'text-slate-600 hover:text-agri-800 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-agri-700" />
                <span>{supportedLanguages.find((l) => l.code === language)?.nativeName || 'English'}</span>
              </button>

              {isLangDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in"
                  onMouseLeave={() => setIsLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language / भाषा चुनें
                  </div>
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        if (lang.code === 'en' || lang.code === 'hi') {
                          setLanguage(lang.code);
                        }
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? 'bg-agri-50 text-agri-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      } ${lang.code !== 'en' && lang.code !== 'hi' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span>{lang.nativeName}</span>
                      {language === lang.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-agri-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-agri-800 hover:bg-agri-50/80 border border-slate-200 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Dashboard Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to={getDashboardRoute()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-200" />
                  <span className="hidden sm:inline">
                    {user?.name ? user.name.split(' ')[0] : 'Dashboard'}
                  </span>
                  <span className="text-[10px] bg-agri-800/80 px-1.5 py-0.5 rounded text-emerald-300">
                    {user?.role === 'FARMER' ? 'Farmer' : user?.role.replace('_', ' ')}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all hidden sm:flex"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.navLogin}</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-1 animate-fade-in">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-agri-50 hover:text-agri-800"
                >
                  <Icon className="w-4 h-4 text-agri-700" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to={getDashboardRoute()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-agri-50 text-agri-800"
              >
                <LayoutDashboard className="w-4 h-4 text-agri-700" />
                <span>{t.navDashboard} ({user?.name})</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
