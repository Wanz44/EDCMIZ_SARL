import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Sun,
  Moon,
  Mail,
  ArrowLeft,
  Image as ImageIcon,
  Hammer,
  Loader2,
  Clock,
  Bell
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';

// Import extracted views
import { DashboardView } from './admin/DashboardView';
import { CRMView } from './admin/CRMView';
import { EmailView } from './admin/EmailView';
import { PortfolioView } from './admin/PortfolioView';
import { ServicesView } from './admin/ServicesView';
import { EquipmentView } from './admin/EquipmentView';
import { CMSView } from './admin/CMSView';
import { SettingsView } from './admin/SettingsView';

type Tab = 'dashboard' | 'portfolio' | 'services' | 'equipment' | 'crm' | 'emails' | 'cms' | 'settings';

interface AdminPortalProps {
  onClose: () => void;
}

export default function AdminPortal({ onClose }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('admin-theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
    } catch (error) {
      alert('Identifiants incorrects ou accès refusé.');
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-petrol-dark flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-petrol-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8 bg-accent text-petrol-dark text-center">
             <div className="flex items-center">
              <img 
                src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDCmiz_blanc.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FRENtaXpfYmxhbmMucG5nIiwiaWF0IjoxNzczMzMzMzYyLCJleHAiOjIwODg2OTMzNjJ9.-edbmzs_YuQcdnQ7H5KtzfoyPs3RGLwlTkp8AO78ers" 
                alt="EDCMIZ Logo" 
                className="h-32 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Portail Admin</h1>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest mt-1">Accès Sécurisé</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Email Professionnel</label>
              <input 
                type="email" 
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                placeholder="ex: admin@edcmiz.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Mot de passe</label>
              <input 
                type="password" 
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-petrol-dark text-white py-4 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-accent hover:text-petrol-dark transition-all shadow-lg disabled:opacity-50"
            >
              {isLoggingIn ? 'Connexion...' : 'Se Connecter'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-slate-400 py-2 text-xs font-bold hover:text-slate-600 transition-colors"
            >
              Retour au site
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'equipment', label: 'Équipements', icon: Hammer },
    { id: 'crm', label: 'Prospects (CRM)', icon: Users },
    { id: 'emails', label: 'Emails & Messagerie', icon: Mail },
    { id: 'cms', label: 'Contenu Vitrine', icon: ImageIcon },
    { id: 'settings', label: 'Paramètres & SEO', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'crm':
        return <CRMView />;
      case 'emails':
        return <EmailView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'services':
        return <ServicesView />;
      case 'equipment':
        return <EquipmentView />;
      case 'cms':
        return <CMSView />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col overflow-hidden transition-colors duration-500",
      theme === 'dark' ? "bg-[#0a0a0a] text-white" : "bg-[#f3f3f3] text-slate-900"
    )}>
      {/* Top Header - Minimal */}
      <header className={cn(
        "h-16 flex items-center justify-between px-8 shrink-0 z-20 backdrop-blur-xl border-b transition-all duration-300",
        theme === 'dark' ? "bg-black/20 border-white/5" : "bg-white/40 border-black/5"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-petrol-dark font-black shadow-lg shadow-accent/20">
            E
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-tight leading-none">Admin Portal</h2>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">EDCMIZ SARL</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={cn(
              "p-2 rounded-xl transition-all hover:scale-110 active:scale-95",
              theme === 'dark' ? "bg-white/5 text-yellow-400 hover:bg-white/10" : "bg-black/5 text-slate-500 hover:bg-black/10"
            )}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">{user.email?.split('@')[0]}</p>
              <p className="text-[9px] text-accent uppercase font-bold tracking-widest">Admin</p>
            </div>
            <button 
              onClick={handleLogout}
              className={cn(
                "p-2 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-500",
                theme === 'dark' ? "text-slate-400" : "text-slate-500"
              )}
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar pb-32">
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tighter uppercase">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Gérez les informations et le contenu de votre plateforme.
                </p>
              </div>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Taskbar - Windows 11 Style */}
      <div className="fixed bottom-0 left-0 right-0 z-[110] p-4 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className={cn(
            "pointer-events-auto flex items-center gap-1 p-1.5 rounded-[1.5rem] transition-all duration-500 backdrop-blur-2xl ring-1 shadow-2xl",
            theme === 'dark' 
              ? "bg-slate-900/90 ring-white/10 shadow-black/50" 
              : "bg-white/90 ring-black/5 shadow-slate-200/50"
          )}
        >
          {/* "Start" Button */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "p-3 rounded-2xl transition-all hover:scale-110 active:scale-90 group relative",
              theme === 'dark' ? "hover:bg-white/10" : "hover:bg-slate-100"
            )}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center text-[11px] font-black text-petrol-dark shadow-lg shadow-accent/30">
              E
            </div>
            <div className={cn(
              "absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl backdrop-blur-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-xl border",
              theme === 'dark' ? "bg-slate-800 text-white border-white/10" : "bg-white text-slate-900 border-slate-200"
            )}>
              Tableau de bord
            </div>
          </button>

          <div className={cn(
            "w-px h-8 mx-1.5",
            theme === 'dark' ? "bg-white/10" : "bg-slate-200"
          )} />

          <div className="flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={cn(
                    "relative group p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1",
                    isActive 
                      ? (theme === 'dark' ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent")
                      : (theme === 'dark' ? "text-slate-400 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900")
                  )}
                >
                  <item.icon 
                    size={22} 
                    className={cn(
                      "transition-all duration-300 group-hover:scale-110 group-active:scale-90",
                      isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" : "opacity-80 group-hover:opacity-100"
                    )} 
                  />
                  
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.8)]" 
                    />
                  )}

                  {/* Tooltip */}
                  <div className={cn(
                    "absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl backdrop-blur-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none shadow-xl border",
                    theme === 'dark' ? "bg-slate-800 text-white border-white/10" : "bg-white text-slate-900 border-slate-200"
                  )}>
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className={cn(
            "w-px h-8 mx-1.5",
            theme === 'dark' ? "bg-white/10" : "bg-slate-200"
          )} />
          
          {/* System Tray Area */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl ml-1 transition-colors",
            theme === 'dark' ? "bg-white/5 hover:bg-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          )}>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-black leading-none tracking-tight">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[9px] opacity-60 font-bold leading-none mt-1">
                {currentTime.toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 border-l pl-2 ml-1",
              theme === 'dark' ? "border-white/10 text-slate-400" : "border-slate-300 text-slate-500"
            )}>
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="hover:text-accent transition-colors"
                title={theme === 'light' ? "Passer au mode sombre" : "Passer au mode clair"}
              >
                {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              </button>
              <div className="relative group">
                <Bell size={14} className="hover:text-accent transition-colors cursor-pointer" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={cn(
              "p-3 rounded-2xl transition-all ml-1 group relative",
              theme === 'dark' ? "text-slate-400 hover:bg-red-500/20 hover:text-red-400" : "text-slate-500 hover:bg-red-500/10 hover:text-red-500"
            )}
            title="Quitter"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-red-600 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-xl">
              Quitter le portail
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
