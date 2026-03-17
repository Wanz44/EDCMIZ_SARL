import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronLeft,
  Menu,
  Sun,
  Moon,
  Mail,
  ArrowLeft,
  Image as ImageIcon,
  Hammer,
  Loader2
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
      "fixed inset-0 z-[100] flex p-4 gap-4 overflow-hidden transition-colors duration-300",
      theme === 'dark' ? "bg-slate-900" : "bg-slate-100"
    )}>
      {/* Sidebar - Floating Design */}
      <aside className={cn(
        "bg-petrol-dark text-white flex flex-col shrink-0 rounded-2xl shadow-2xl overflow-hidden border border-white/5 transition-all duration-300",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-petrol-dark font-black shadow-lg shrink-0">
            EDC
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-bold text-sm leading-tight">Admin Portal</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">EDCMIZ SARL</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === item.id 
                  ? "bg-accent text-petrol-dark shadow-lg shadow-accent/20 translate-x-1" 
                  : "text-white/70 hover:bg-white/5 hover:text-white hover:translate-x-1",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <item.icon size={18} />
              {!isSidebarCollapsed && item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300",
              isSidebarCollapsed && "justify-center px-0"
            )}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && "Déconnexion"}
          </button>
        </div>
      </aside>

      {/* Main Content Area - Floating Design */}
      <main className={cn(
        "flex-1 flex flex-col rounded-2xl shadow-xl overflow-hidden border transition-colors duration-300",
        theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <header className={cn(
          "h-20 backdrop-blur-md border-b flex items-center justify-between px-8 shrink-0 z-10 transition-colors duration-300",
          theme === 'dark' ? "bg-slate-800/80 border-slate-700" : "bg-white/80 border-slate-100"
        )}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className={cn(
                "p-2 rounded-full transition-colors",
                theme === 'dark' ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"
              )}
              title={isSidebarCollapsed ? "Développer le menu" : "Réduire le menu"}
            >
              {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className={cn(
                "font-black capitalize text-xl tracking-tight",
                theme === 'dark' ? "text-white" : "text-petrol-dark"
              )}>{activeTab.replace('-', ' ')}</h2>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">Gestion du contenu</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={cn(
                "p-2 rounded-full transition-colors",
                theme === 'dark' ? "text-yellow-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"
              )}
              title={theme === 'light' ? "Passer au mode sombre" : "Passer au mode clair"}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="text-right hidden sm:block">
              <p className={cn(
                "text-xs font-black",
                theme === 'dark' ? "text-white" : "text-petrol-dark"
              )}>{user.email}</p>
              <p className="text-[10px] text-accent uppercase font-bold tracking-widest">Administrateur Principal</p>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner transition-colors",
              theme === 'dark' ? "bg-slate-700 border-slate-600 text-accent" : "bg-slate-50 border-slate-200 text-petrol"
            )}>
              <Users size={24} />
            </div>
          </div>
        </header>

        <div className={cn(
          "flex-1 overflow-y-auto p-8 custom-scrollbar transition-colors duration-300",
          theme === 'dark' ? "bg-slate-900/50" : "bg-slate-50/30"
        )}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
