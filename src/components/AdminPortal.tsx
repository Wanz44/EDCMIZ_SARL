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
  Loader2
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
  Timestamp
} from 'firebase/firestore';

type Tab = 'dashboard' | 'portfolio' | 'services' | 'crm' | 'cms' | 'settings';

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
        <div className="max-w-md w-full bg-white rounded-sm shadow-2xl overflow-hidden">
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
                className="w-full px-4 py-3 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
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
                className="w-full px-4 py-3 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-petrol-dark text-white py-4 rounded-sm font-black uppercase text-sm tracking-widest hover:bg-accent hover:text-petrol-dark transition-all shadow-lg disabled:opacity-50"
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
    { id: 'crm', label: 'Prospects (CRM)', icon: Users },
    { id: 'cms', label: 'Contenu Vitrine', icon: ImageIcon },
    { id: 'settings', label: 'Paramètres & SEO', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'crm':
        return <CRMView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'services':
        return <ServicesView />;
      case 'cms':
        return <CMSView />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-petrol-dark text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center text-petrol-dark font-black">
            EDC
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Admin Portal</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">EDCMIZ SARL</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all",
                activeTab === item.id 
                  ? "bg-accent text-petrol-dark" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="lg:hidden p-2 text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{user.email}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Administrateur</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
              <Users size={20} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function DashboardView() {
  const stats = [
    { label: 'Visiteurs (Aujourd\'hui)', value: '124', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pages les plus vues', value: 'Portfolio', change: '85%', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Nouveaux Prospects', value: '8', change: '+3', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Taux de Conversion', value: '4.2%', change: '+0.5%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-sm", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
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

        <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
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
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Filter size={18} /> Filtrer
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
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
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-sm">{p.type}</span>
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
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-petrol-dark rounded-sm text-sm font-bold hover:bg-accent/90">
          <Plus size={18} /> Nouveau Projet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm group">
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
                <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-sm text-xs font-bold hover:bg-slate-200 transition-colors">
                  Modifier
                </button>
                <button className="p-2 bg-slate-100 text-slate-600 rounded-sm hover:bg-red-50 text-red-500 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center p-8 text-slate-400 hover:border-accent hover:text-accent transition-all group">
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
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-petrol-dark rounded-sm text-sm font-bold hover:bg-accent/90">
          <Plus size={18} /> Nouveau Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-white p-6 border border-slate-200 rounded-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-accent rounded-sm flex items-center justify-center">
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

function CMSView() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Newspaper size={18} className="text-accent" /> Actualités
          </h4>
          <p className="text-xs text-slate-500 mb-6">Gérez vos articles de blog et annonces officielles.</p>
          <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-sm text-xs font-bold hover:bg-accent hover:text-petrol-dark transition-all">
            Gérer les articles
          </button>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-accent" /> Témoignages
          </h4>
          <p className="text-xs text-slate-500 mb-6">Ajoutez ou modifiez les avis de vos clients satisfaits.</p>
          <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-sm text-xs font-bold hover:bg-accent hover:text-petrol-dark transition-all">
            Gérer les avis
          </button>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={18} className="text-accent" /> Partenaires
          </h4>
          <p className="text-xs text-slate-500 mb-6">Mettez à jour les logos de vos partenaires stratégiques.</p>
          <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-sm text-xs font-bold hover:bg-accent hover:text-petrol-dark transition-all">
            Gérer les logos
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white p-8 border border-slate-200 rounded-sm shadow-sm">
        <h4 className="font-bold text-slate-800 mb-6">Informations de Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Numéro WhatsApp</label>
            <input type="text" defaultValue="+243 829 002 360" className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Contact</label>
            <input type="email" defaultValue="contact@edcmiz.com" className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Adresse Physique (Kinshasa)</label>
            <input type="text" defaultValue="Av. de la Justice, Gombe, Kinshasa" className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 border border-slate-200 rounded-sm shadow-sm">
        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Search size={20} className="text-accent" /> Optimisation SEO
        </h4>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Meta Title (Accueil)</label>
            <input type="text" defaultValue="EDCMIZ SARL | Excellence en Construction Générale en RDC" className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Meta Description</label>
            <textarea rows={3} defaultValue="Spécialiste en BTP, génie civil et solutions digitales en République Démocratique du Congo. Nous bâtissons l'avenir avec expertise." className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-4 bg-petrol-dark text-white rounded-sm font-black uppercase text-sm tracking-widest hover:bg-accent hover:text-petrol-dark transition-all">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
