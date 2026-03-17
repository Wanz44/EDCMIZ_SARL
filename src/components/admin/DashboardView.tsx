import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Truck, 
  Mail, 
  Clock, 
  BarChart3, 
  MessageSquare, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { 
  collection, 
  getDocs
} from 'firebase/firestore';

export function DashboardView() {
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
              { source: 'Facebook', percentage: 0, color: 'bg-blue-600' },
              { source: 'Google Search', percentage: 0, color: 'bg-red-500' },
              { source: 'LinkedIn', percentage: 0, color: 'bg-blue-800' },
              { source: 'Direct', percentage: 0, color: 'bg-slate-400' },
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
