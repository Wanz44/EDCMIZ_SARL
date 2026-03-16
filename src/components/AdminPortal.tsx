import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  LogOut, 
  Plus, 
  Search, 
  Filter,
  ChevronRight,
  MoreVertical,
  TrendingUp,
  Eye,
  MessageSquare,
  Mail,
  Send,
  Inbox,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Newspaper,
  Globe,
  Droplets,
  Route,
  Building2,
  Hammer,
  Loader2,
  Trash2,
  Save,
  Upload,
  Truck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth, db, OperationType, handleFirestoreError } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  deleteDoc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";

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
    <div className="fixed inset-0 z-[100] bg-slate-100 flex p-4 gap-4 overflow-hidden">
      {/* Sidebar - Floating Design */}
      <aside className="w-64 bg-petrol-dark text-white flex flex-col shrink-0 rounded-2xl shadow-2xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-petrol-dark font-black shadow-lg">
            EDC
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Admin Portal</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">EDCMIZ SARL</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === item.id 
                  ? "bg-accent text-petrol-dark shadow-lg shadow-accent/20 translate-x-1" 
                  : "text-white/70 hover:bg-white/5 hover:text-white hover:translate-x-1"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area - Floating Design */}
      <main className="flex-1 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-black text-petrol-dark capitalize text-xl tracking-tight">{activeTab.replace('-', ' ')}</h2>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">Gestion du contenu</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-petrol-dark">{user.email}</p>
              <p className="text-[10px] text-accent uppercase font-bold tracking-widest">Administrateur Principal</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-petrol shadow-inner">
              <Users size={24} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function DashboardView() {
  const [stats, setStats] = useState({
    prospects: 0,
    projects: 0,
    equipment: 0,
    sentEmails: 0
  });
  const [loading, setLoading] = useState(true);

  const resetStats = () => {
    setStats({
      prospects: 0,
      projects: 0,
      equipment: 0,
      sentEmails: 0
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prospectsSnap = await getDocs(collection(db, 'prospects'));
        const projectsSnap = await getDocs(collection(db, 'projects'));
        const equipmentSnap = await getDocs(collection(db, 'equipment'));
        const emailsSnap = await getDocs(collection(db, 'sent_emails'));

        setStats({
          prospects: prospectsSnap.size,
          projects: projectsSnap.size,
          equipment: equipmentSnap.size,
          sentEmails: emailsSnap.size
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'multiple_collections');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="text-accent animate-spin" size={48} />
      </div>
    );
  }

  const statCards = [
    { label: 'Prospects', value: stats.prospects, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Projets', value: stats.projects, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Équipements', value: stats.equipment, icon: Truck, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Emails Envoyés', value: stats.sentEmails, icon: Mail, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-petrol-dark">Vue d'ensemble</h3>
          <p className="text-slate-500 text-sm">Statistiques en temps réel de votre activité.</p>
        </div>
        <button 
          onClick={resetStats}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
        >
          <Clock size={14} />
          Réinitialiser l'affichage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-4 rounded-xl transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-petrol-dark">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-accent" />
            Provenance des Visiteurs
          </h4>
          <div className="space-y-4">
            {[
              { source: 'Facebook', percentage: 45, color: 'bg-blue-600' },
              { source: 'Google Search', percentage: 30, color: 'bg-red-500' },
              { source: 'LinkedIn', percentage: 15, color: 'bg-blue-800' },
              { source: 'Direct', percentage: 10, color: 'bg-slate-400' },
            ].map((item) => (
              <div key={item.source}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{item.source}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full", item.color)} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-accent" />
            Activités Récentes
          </h4>
          <div className="space-y-6">
            {[
              { action: 'Nouveau devis reçu', user: 'Jean Kabamba', time: 'Il y a 10 min', icon: MessageSquare, color: 'text-blue-500' },
              { action: 'Projet mis à jour', user: 'Admin', time: 'Il y a 1h', icon: Briefcase, color: 'text-purple-500' },
              { action: 'Nouveau témoignage', user: 'Sarah L.', time: 'Il y a 3h', icon: CheckCircle2, color: 'text-emerald-500' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-50", activity.color)}>
                  <activity.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{activity.action}</p>
                  <p className="text-xs text-slate-500">Par {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CRMView() {
  const [prospects, setProspects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = 'prospects';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProspects(data);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'prospects', id), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `prospects/${id}`);
    }
  };

  const deleteProspect = async (id: string) => {
    if (!window.confirm('Supprimer ce prospect ?')) return;
    try {
      await deleteDoc(doc(db, 'prospects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `prospects/${id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-100 text-blue-700';
      case 'Contacté': return 'bg-orange-100 text-orange-700';
      case 'Devis envoyé': return 'bg-purple-100 text-purple-700';
      case 'Gagné': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un prospect..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Filter size={18} /> Filtrer
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Prospect</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Type de Travaux</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prospects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.phone}</p>
                    {p.email && <p className="text-[10px] text-slate-400 italic">{p.email}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{p.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{p.budget || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full outline-none border-none cursor-pointer", getStatusColor(p.status))}
                    >
                      <option value="Nouveau">Nouveau</option>
                      <option value="Contacté">Contacté</option>
                      <option value="Devis envoyé">Devis envoyé</option>
                      <option value="Gagné">Gagné</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {p.createdAt instanceof Timestamp ? p.createdAt.toDate().toLocaleDateString() : 'Récemment'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteProspect(p.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <AlertCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {prospects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                    Aucun prospect trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PortfolioView() {
  const projects = [
    { id: 1, title: 'Immeuble Gombe R+10', location: 'Kinshasa', status: 'Terminé', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Villa Moderne Ngaliema', location: 'Kinshasa', status: 'En cours', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Pont de Matadi (Réfection)', location: 'Kongo Central', status: 'Étude', image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Gestion des Réalisations</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-petrol-dark rounded-xl text-sm font-bold hover:bg-accent/90">
          <Plus size={18} /> Nouveau Projet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group">
            <div className="h-48 relative overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-petrol-dark">
                {project.status}
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-slate-800 mb-1">{project.title}</h4>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                <Users size={12} /> {project.location}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">
                  Modifier
                </button>
                <button className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 text-red-500 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-accent hover:text-accent transition-all group">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-accent/10">
            <Plus size={24} />
          </div>
          <p className="text-sm font-bold">Ajouter un projet</p>
        </button>
      </div>
    </div>
  );
}

function ServicesView() {
  const services = [
    { id: 1, title: 'Adduction d\'eau', status: 'Actif', icon: 'Droplets' },
    { id: 2, title: 'Génie Civil', status: 'Actif', icon: 'Route' },
    { id: 3, title: 'Construction Bâtiment', status: 'Actif', icon: 'Building2' },
    { id: 4, title: 'Rénovation', status: 'Actif', icon: 'Hammer' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Gestion des Services</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-petrol-dark rounded-xl text-sm font-bold hover:bg-accent/90">
          <Plus size={18} /> Nouveau Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-white p-6 border border-slate-200 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-accent rounded-xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{s.title}</h4>
                <p className="text-xs text-slate-500">Icône: {s.icon} • Statut: {s.status}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-slate-400 hover:text-slate-600"><Settings size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-red-500"><AlertCircle size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EquipmentView() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = 'equipment';
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEquipment(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const deleteEquipment = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet équipement ?')) return;
    const path = `equipment/${id}`;
    try {
      await deleteDoc(doc(db, 'equipment', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Gestion du Parc Matériel</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-petrol-dark rounded-xl text-sm font-bold hover:bg-accent/90">
          <Plus size={18} /> Nouvel Équipement
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-accent" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-40 bg-slate-100 relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800">{item.name}</h4>
                <p className="text-xs text-slate-500 mb-4">{item.category || 'Sans catégorie'}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200">
                    Modifier
                  </button>
                  <button 
                    onClick={() => deleteEquipment(item.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {equipment.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 italic">
              Aucun équipement enregistré.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CMSView() {
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'why' | 'news' | 'testimonials'>('hero');
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const path = 'content/site';
      try {
        const docRef = doc(db, 'content', 'site');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          // Initial state if not exists
          setContent({
            hero: {
              title: "L'Excellence en Construction Générale.",
              subtitle: "Entreprise de Construction MIZAKU SARL",
              description: "Spécialiste des travaux de bâtiment, génie civil et rénovation. Nous bâtissons des structures solides et durables.",
              imageUrl: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/Architecture/ABC03.jpg",
              ctaText: "Demander un devis gratuit",
              ctaLink: "https://wa.me/243829002360"
            },
            about: {
              title: "Bâtir l'Avenir avec Rigueur et Innovation",
              description: "EDCMIZ sarl est une entreprise leader en République Démocratique du Congo...",
              imageUrl: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/Architecture/ABC01.jpg",
              experienceYears: "6+"
            }
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const path = 'content/site';
    try {
      await setDoc(doc(db, 'content', 'site'), content);
      alert('Contenu mis à jour avec succès !');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  if (!content) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveSection('hero')}
          className={cn("px-4 py-2 text-sm font-bold transition-all", activeSection === 'hero' ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-600")}
        >
          Hero
        </button>
        <button 
          onClick={() => setActiveSection('about')}
          className={cn("px-4 py-2 text-sm font-bold transition-all", activeSection === 'about' ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-600")}
        >
          À Propos
        </button>
        <button 
          onClick={() => setActiveSection('news')}
          className={cn("px-4 py-2 text-sm font-bold transition-all", activeSection === 'news' ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-600")}
        >
          Actualités
        </button>
        <button 
          onClick={() => setActiveSection('testimonials')}
          className={cn("px-4 py-2 text-sm font-bold transition-all", activeSection === 'testimonials' ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-600")}
        >
          Témoignages
        </button>
      </div>

      <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm max-w-4xl">
        {activeSection === 'hero' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Section Hero</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sous-titre (H2)</label>
                <input 
                  type="text" 
                  value={content.hero.subtitle}
                  onChange={e => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre Principal (H1)</label>
                <input 
                  type="text" 
                  value={content.hero.title}
                  onChange={e => setContent({...content, hero: {...content.hero, title: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                <textarea 
                  rows={3}
                  value={content.hero.description}
                  onChange={e => setContent({...content, hero: {...content.hero, description: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Image de fond (URL)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={content.hero.imageUrl}
                    onChange={e => setContent({...content, hero: {...content.hero, imageUrl: e.target.value}})}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                  <button className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">
                    <Upload size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Section À Propos</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre</label>
                <input 
                  type="text" 
                  value={content.about.title}
                  onChange={e => setContent({...content, about: {...content.about, title: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                <textarea 
                  rows={6}
                  value={content.about.description}
                  onChange={e => setContent({...content, about: {...content.about, description: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Années d'Expérience</label>
                  <input 
                    type="text" 
                    value={content.about.experienceYears}
                    onChange={e => setContent({...content, about: {...content.about, experienceYears: e.target.value}})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Image (URL)</label>
                  <input 
                    type="text" 
                    value={content.about.imageUrl}
                    onChange={e => setContent({...content, about: {...content.about, imageUrl: e.target.value}})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'news' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Actualités & Blog</h4>
              <button className="text-xs font-bold text-accent flex items-center gap-1 hover:underline">
                <Plus size={14} /> Ajouter un article
              </button>
            </div>
            <p className="text-sm text-slate-500 italic">La gestion détaillée des articles sera disponible dans une mise à jour prochaine. Vous pouvez modifier les titres globaux ici.</p>
          </div>
        )}

        {activeSection === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Témoignages Clients</h4>
              <button className="text-xs font-bold text-accent flex items-center gap-1 hover:underline">
                <Plus size={14} /> Ajouter un avis
              </button>
            </div>
            <p className="text-sm text-slate-500 italic">La gestion détaillée des témoignages sera disponible dans une mise à jour prochaine.</p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-petrol-dark text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSeoTab, setActiveSeoTab] = useState<'home' | 'about' | 'services' | 'projects' | 'contact'>('home');
  const [settings, setSettings] = useState<any>({
    whatsapp: '+243 829 002 360',
    email: 'contact@edcmiz.com',
    address: 'Av. de la Justice, Gombe, Kinshasa',
    seo: {
      home: { title: 'EDCMIZ SARL | Excellence en Construction Générale en RDC', description: 'Spécialiste en BTP, génie civil et solutions digitales en République Démocratique du Congo. Nous bâtissons l\'avenir avec expertise.' },
      about: { title: 'À Propos | EDCMIZ SARL', description: 'Découvrez notre histoire, nos valeurs et notre engagement envers l\'excellence dans la construction en RDC.' },
      services: { title: 'Nos Services | EDCMIZ SARL', description: 'De l\'adduction d\'eau au génie civil, découvrez notre large gamme de services de construction.' },
      projects: { title: 'Nos Réalisations | EDCMIZ SARL', description: 'Explorez nos projets emblématiques à travers la République Démocratique du Congo.' },
      contact: { title: 'Contactez-nous | EDCMIZ SARL', description: 'Prêt à démarrer votre projet ? Contactez notre équipe d\'experts dès aujourd\'hui.' }
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const path = 'settings/global';
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Merge with defaults to ensure all fields exist
          setSettings((prev: any) => ({
            ...prev,
            ...data,
            seo: {
              ...prev.seo,
              ...(data.seo || {})
            }
          }));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const path = 'settings/global';
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert("Paramètres enregistrés avec succès.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!confirm("Êtes-vous sûr de vouloir réinitialiser les compteurs ? Cela supprimera tous les prospects et l'historique des emails.")) return;
    
    setIsResetting(true);
    try {
      const prospects = await getDocs(collection(db, 'prospects'));
      const emails = await getDocs(collection(db, 'sent_emails'));
      
      const deletePromises = [
        ...prospects.docs.map(d => deleteDoc(doc(db, 'prospects', d.id))),
        ...emails.docs.map(d => deleteDoc(doc(db, 'sent_emails', d.id)))
      ];
      
      await Promise.all(deletePromises);
      alert("Données réinitialisées avec succès.");
      window.location.reload();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reset_data');
      alert("Erreur lors de la réinitialisation.");
    } finally {
      setIsResetting(false);
    }
  };

  const updateSeo = (page: string, field: string, value: string) => {
    setSettings({
      ...settings,
      seo: {
        ...settings.seo,
        [page]: {
          ...settings.seo[page],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-800 mb-6">Informations de Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Numéro WhatsApp</label>
            <input 
              type="text" 
              value={settings.whatsapp} 
              onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Contact</label>
            <input 
              type="email" 
              value={settings.email} 
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Adresse Physique (Kinshasa)</label>
            <input 
              type="text" 
              value={settings.address} 
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Globe size={20} className="text-accent" /> Optimisation SEO par Page
        </h4>
        
        <div className="flex border-b border-slate-100 mb-6 overflow-x-auto">
          {(['home', 'about', 'services', 'projects', 'contact'] as const).map((page) => (
            <button
              key={page}
              onClick={() => setActiveSeoTab(page)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap",
                activeSeoTab === page ? "border-accent text-petrol-dark" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              {page === 'home' ? 'Accueil' : page === 'about' ? 'À Propos' : page === 'services' ? 'Services' : page === 'projects' ? 'Projets' : 'Contact'}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Meta Title</label>
            <input 
              type="text" 
              value={settings.seo[activeSeoTab]?.title || ''} 
              onChange={(e) => updateSeo(activeSeoTab, 'title', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
              placeholder="Titre de la page..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Meta Description</label>
            <textarea 
              rows={3} 
              value={settings.seo[activeSeoTab]?.description || ''} 
              onChange={(e) => updateSeo(activeSeoTab, 'description', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
              placeholder="Description pour les moteurs de recherche..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 border border-red-100 rounded-2xl shadow-sm">
        <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
          <AlertCircle size={20} /> Zone de Danger
        </h4>
        <p className="text-sm text-slate-500 mb-6">Réinitialiser les compteurs de l'activité (Prospects et Emails envoyés).</p>
        <button 
          onClick={handleResetData}
          disabled={isResetting}
          className="px-6 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
        >
          {isResetting ? 'Réinitialisation...' : 'Remettre les compteurs à ZERO'}
        </button>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-8 py-4 bg-petrol-dark text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-accent hover:text-petrol-dark transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

function EmailView() {
  const [messages, setMessages] = useState<any[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [view, setView] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  useEffect(() => {
    const path = 'prospects';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const path = 'sent_emails';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSentEmails(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'sent_emails';
    try {
      await addDoc(collection(db, path), {
        ...composeData,
        createdAt: Timestamp.now(),
        status: 'sent'
      });
      
      // Open mailto as a fallback for real sending
      const mailtoUrl = `mailto:${composeData.to}?subject=${encodeURIComponent(composeData.subject)}&body=${encodeURIComponent(composeData.body)}`;
      window.open(mailtoUrl);
      
      alert('Email enregistré dans l\'historique et prêt à être envoyé via votre client mail.');
      setView('sent');
      setComposeData({ to: '', subject: '', body: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const generateDraft = async () => {
    if (!selectedMessage) return;
    setIsDrafting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Rédige une réponse professionnelle et courtoise en français pour EDCMIZ SARL (entreprise de construction en RDC) à ce message de prospect:
        Nom: ${selectedMessage.name}
        Message: ${selectedMessage.message}
        
        La réponse doit être chaleureuse, professionnelle et inviter à un rendez-vous ou un appel.`,
      });
      
      setComposeData({
        to: selectedMessage.email,
        subject: `Réponse à votre demande - EDCMIZ SARL`,
        body: response.text || ''
      });
      setView('compose');
    } catch (error) {
      console.error('AI error:', error);
      alert('Erreur lors de la génération du brouillon.');
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="flex h-full bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Email Sidebar */}
      <div className="w-64 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <button 
            onClick={() => setView('compose')}
            className="w-full py-2 bg-accent text-petrol-dark rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/90 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Nouveau Message
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button 
            onClick={() => setView('inbox')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              view === 'inbox' ? "bg-slate-100 text-petrol" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Inbox size={16} /> Boîte de réception
            {messages.length > 0 && (
              <span className="ml-auto bg-accent text-petrol-dark px-1.5 py-0.5 rounded-full text-[10px]">
                {messages.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setView('sent')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              view === 'sent' ? "bg-slate-100 text-petrol" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Send size={16} /> Messages envoyés
          </button>
        </nav>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === 'compose' ? (
          <div className="p-8 max-w-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Send size={20} className="text-accent" /> Nouveau Message
            </h3>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">À (Email)</label>
                <input 
                  type="email" 
                  required
                  value={composeData.to}
                  onChange={e => setComposeData({...composeData, to: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  placeholder="client@exemple.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sujet</label>
                <input 
                  type="text" 
                  required
                  value={composeData.subject}
                  onChange={e => setComposeData({...composeData, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  placeholder="Sujet de votre message"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</label>
                <textarea 
                  rows={12} 
                  required
                  value={composeData.body}
                  onChange={e => setComposeData({...composeData, body: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-sans" 
                  placeholder="Écrivez votre message ici..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setView('inbox')}
                  className="px-6 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-petrol-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
                >
                  <Send size={16} /> Envoyer
                </button>
              </div>
            </form>
          </div>
        ) : view === 'sent' ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Historique des envois</h3>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{sentEmails.length} messages</span>
            </div>
            <div className="divide-y divide-slate-100">
              {sentEmails.map((email) => (
                <div key={email.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800">{email.subject}</h4>
                      <p className="text-xs text-slate-500">À: {email.to}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {email.createdAt instanceof Timestamp ? email.createdAt.toDate().toLocaleString() : 'Récemment'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 whitespace-pre-wrap">{email.body}</p>
                </div>
              ))}
              {sentEmails.length === 0 && (
                <div className="p-12 text-center text-slate-400 italic text-sm">
                  Aucun message envoyé.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* List */}
            <div className="w-1/2 border-r border-slate-100 overflow-y-auto">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un message..." 
                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <button 
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-slate-50 transition-colors flex flex-col gap-1",
                      selectedMessage?.id === msg.id ? "bg-slate-50 border-l-4 border-accent" : "border-l-4 border-transparent"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-sm">{msg.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {msg.createdAt instanceof Timestamp ? msg.createdAt.toDate().toLocaleDateString() : 'Récemment'}
                      </span>
                    </div>
                    <span className="text-xs text-petrol font-medium truncate">{msg.email}</span>
                    <p className="text-xs text-slate-500 line-clamp-1">{msg.message}</p>
                  </button>
                ))}
                {messages.length === 0 && (
                  <div className="p-12 text-center text-slate-400 italic text-sm">
                    Aucun message reçu.
                  </div>
                )}
              </div>
            </div>

            {/* Detail */}
            <div className="flex-1 bg-slate-50/30 overflow-y-auto">
              {selectedMessage ? (
                <div className="p-8">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-black text-petrol-dark">{selectedMessage.name}</h3>
                        <p className="text-sm text-accent font-bold">{selectedMessage.email}</p>
                        {selectedMessage.phone && <p className="text-xs text-slate-400 mt-1">{selectedMessage.phone}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reçu le</p>
                        <p className="text-xs font-bold text-slate-600">
                          {selectedMessage.createdAt instanceof Timestamp ? selectedMessage.createdAt.toDate().toLocaleString() : 'Récemment'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-xl mb-8 border-l-4 border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setComposeData({
                            to: selectedMessage.email,
                            subject: `Re: Demande de contact - EDCMIZ SARL`,
                            body: `Bonjour ${selectedMessage.name},\n\nMerci pour votre message.\n\n`
                          });
                          setView('compose');
                        }}
                        className="px-6 py-2 bg-petrol-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
                      >
                        <Mail size={16} /> Répondre
                      </button>
                      <button 
                        onClick={generateDraft}
                        disabled={isDrafting}
                        className="px-6 py-2 border border-accent text-accent rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isDrafting ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
                        Brouillon IA
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                  <Mail size={64} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">Sélectionnez un message pour le lire</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
