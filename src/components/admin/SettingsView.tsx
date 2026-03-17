import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Save, 
  Globe, 
  AlertCircle 
} from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { cn } from '@/src/lib/utils';

export function SettingsView() {
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
