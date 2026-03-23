import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
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
import { UsersView } from './admin/UsersView';

function DockIcon({ mouseX, onClick, isActive, label, theme, icon: Icon, isStart = false, isLogout = false }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className={cn(
        "relative group aspect-square rounded-2xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer",
        isActive 
          ? (theme === 'dark' ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent")
          : (theme === 'dark' ? "text-slate-400 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"),
        isLogout && (theme === 'dark' ? "hover:bg-red-500/20 hover:text-red-400" : "hover:bg-red-500/10 hover:text-red-500")
      )}
    >
      {isStart ? (
        <div className="w-full h-full p-2 flex items-center justify-center overflow-hidden">
          <img 
            src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" 
            alt="EDCMIZ" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <Icon 
          size={22} 
          className={cn(
            "transition-all duration-300",
            isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" : "opacity-80 group-hover:opacity-100"
          )} 
        />
      )}

      {isActive && !isStart && !isLogout && (
        <motion.div 
          layoutId="active-dot"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.8)]" 
        />
      )}

      <div className={cn(
        "absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl backdrop-blur-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none shadow-xl border",
        isLogout ? "bg-red-600 text-white border-red-500" : (theme === 'dark' ? "bg-slate-800 text-white border-white/10" : "bg-white text-slate-900 border-slate-200")
      )}>
        {label}
      </div>
    </motion.div>
  );
}

type Tab = 'dashboard' | 'portfolio' | 'services' | 'equipment' | 'crm' | 'emails' | 'cms' | 'settings' | 'users';

interface AdminPortalProps {
  onClose: () => void;
}

export default function AdminPortal({ onClose }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'editor' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const mouseX = useMotionValue(Infinity);
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const { getDoc, doc } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            // Default admin if email matches the main one
            if (user.email === "adonailutonadio70@gmail.com") {
              setUserRole('admin');
            } else {
              setUserRole('editor');
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('editor');
        }
      } else {
        setUserRole(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
    } catch (error) {
      setLoginError('Identifiants incorrects ou accès refusé.');
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
          <div className="p-8 text-petrol-dark text-center">
              <div className="flex items-center justify-center mb-6">
               <img 
                 src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" 
                 alt="EDCMIZ Logo" 
                 className="h-96 w-auto object-contain"
                 referrerPolicy="no-referrer"
               />
             </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Portail Admin</h1>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest mt-1">Accès Sécurisé</p>
            {loginError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-shake">
                {loginError}
              </div>
            )}
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
    ...(userRole === 'admin' ? [{ id: 'users', label: 'Utilisateurs', icon: Users }] : []),
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
      case 'users':
        return <UsersView />;
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
        "h-48 flex items-center justify-between px-8 shrink-0 z-20 backdrop-blur-xl border-b transition-all duration-300",
        theme === 'dark' ? "bg-black/20 border-white/5" : "bg-white/40 border-black/5"
      )}>
        <div className="flex items-center gap-6">
          <div className="w-40 h-40 flex items-center justify-center overflow-hidden">
            <img 
              src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" 
              alt="EDCMIZ" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
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
              <p className="text-[9px] text-accent uppercase font-bold tracking-widest">
                {userRole === 'admin' ? 'Administrateur' : 'Éditeur'}
              </p>
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

      {/* Bottom Taskbar - Modern iMac/macOS Dock Style */}
      <div className="fixed bottom-0 left-0 right-0 z-[110] p-4 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className={cn(
            "pointer-events-auto flex items-end gap-2 p-2 pb-3 rounded-[2rem] transition-all duration-500 backdrop-blur-2xl ring-1 shadow-2xl",
            theme === 'dark' 
              ? "bg-slate-900/90 ring-white/10 shadow-black/50" 
              : "bg-white/90 ring-black/5 shadow-slate-200/50"
          )}
        >
          <DockIcon 
            mouseX={mouseX}
            onClick={() => setActiveTab('dashboard')}
            isActive={activeTab === 'dashboard'}
            label="Tableau de bord"
            theme={theme}
            isStart={true}
          />

          <div className={cn(
            "w-px h-8 mx-1 mb-2",
            theme === 'dark' ? "bg-white/10" : "bg-slate-200"
          )} />

          {menuItems.map((item) => (
            <DockIcon
              key={item.id}
              mouseX={mouseX}
              onClick={() => setActiveTab(item.id as Tab)}
              isActive={activeTab === item.id}
              label={item.label}
              theme={theme}
              icon={item.icon}
            />
          ))}
          
          <div className={cn(
            "w-px h-8 mx-1 mb-2",
            theme === 'dark' ? "bg-white/10" : "bg-slate-200"
          )} />
          
          {/* System Tray Area */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl mb-1 transition-colors h-12 self-end",
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

          <DockIcon
            mouseX={mouseX}
            onClick={onClose}
            label="Quitter le portail"
            theme={theme}
            icon={ArrowLeft}
            isLogout={true}
          />
        </motion.div>
      </div>
    </div>
  );
}
