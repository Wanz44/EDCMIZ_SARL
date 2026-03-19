import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Save, 
  Globe, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  ChevronRight,
  Info,
  Layout,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
import { ImageUpload } from './ImageUpload';

const SEO_TABS = [
  { id: 'home', label: 'Accueil', icon: Layout },
  { id: 'about', label: 'À Propos', icon: Info },
  { id: 'services', label: 'Services', icon: Globe },
  { id: 'projects', label: 'Projets', icon: Layout },
  { id: 'contact', label: 'Contact', icon: Mail },
] as const;

export function SettingsView() {
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSeoTab, setActiveSeoTab] = useState<typeof SEO_TABS[number]['id']>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>({
    whatsapp: '+243 829 002 360',
    email: 'contact@edcmiz.com',
    address: 'Av. de la Justice, Gombe, Kinshasa',
    logoLight: '',
    logoDark: '',
    favicon: '',
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const path = 'settings/global';
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      // Using a custom toast/notification would be better, but for now we'll keep it simple or use a state
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
      window.location.reload();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reset_data');
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-10 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
            <img 
              src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" 
              alt="EDCMIZ" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Paramètres</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configurez l'identité visuelle, les contacts et le SEO de votre plateforme.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
          <CheckCircle2 size={12} />
          Système à jour
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Branding Section */}
          <section className="bg-white dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <ImageIcon size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Identité Visuelle</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUpload 
                label="Logo (Thème Clair)"
                currentUrl={settings.logoLight}
                onUpload={(url) => setSettings({...settings, logoLight: url})}
                folder="branding"
                className="md:col-span-1"
              />
              <ImageUpload 
                label="Logo (Thème Sombre)"
                currentUrl={settings.logoDark}
                onUpload={(url) => setSettings({...settings, logoDark: url})}
                folder="branding"
                className="md:col-span-1"
              />
              <ImageUpload 
                label="Favicon"
                currentUrl={settings.favicon}
                onUpload={(url) => setSettings({...settings, favicon: url})}
                folder="branding"
                className="md:col-span-1"
              />
            </div>
          </section>

          {/* Contact Info Section */}
          <section className="bg-white dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <Phone size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Informations de Contact</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Numéro WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={16} />
                  <input 
                    type="text" 
                    value={settings.whatsapp} 
                    onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email de Contact</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={16} />
                  <input 
                    type="email" 
                    value={settings.email} 
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white" 
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Adresse Physique</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={16} />
                  <input 
                    type="text" 
                    value={settings.address} 
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SEO Section */}
          <section className="bg-white dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                  <Globe size={20} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Optimisation SEO</h4>
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {SEO_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSeoTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                    activeSeoTab === tab.id 
                      ? "bg-petrol-dark text-white border-petrol-dark dark:bg-accent dark:text-petrol-dark dark:border-accent shadow-lg shadow-accent/10" 
                      : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-accent"
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <motion.div 
                key={activeSeoTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Meta Title</label>
                  <input 
                    type="text" 
                    value={settings.seo[activeSeoTab]?.title || ''} 
                    onChange={(e) => updateSeo(activeSeoTab, 'title', e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white" 
                    placeholder="Titre de la page..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Meta Description</label>
                  <textarea 
                    rows={4} 
                    value={settings.seo[activeSeoTab]?.description || ''} 
                    onChange={(e) => updateSeo(activeSeoTab, 'description', e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white resize-none" 
                    placeholder="Description pour les moteurs de recherche..."
                  />
                </div>
              </motion.div>

              {/* Google Preview */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 flex items-center gap-2">
                  <Search size={12} />
                  Aperçu Google
                </label>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>https://edcmiz.com</span>
                    <ChevronRight size={8} />
                    <span className="capitalize">{activeSeoTab}</span>
                  </div>
                  <h5 className="text-blue-600 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer line-clamp-1">
                    {settings.seo[activeSeoTab]?.title || 'Titre de la page'}
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {settings.seo[activeSeoTab]?.description || 'Aucune description configurée. Ajoutez une description pour améliorer votre référencement.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Danger Zone & Help */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-red-50/50 dark:bg-red-950/10 p-8 border border-red-100 dark:border-red-900/20 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <ShieldAlert size={24} />
              <h4 className="text-lg font-bold tracking-tight">Zone de Danger</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Réinitialiser les compteurs de l'activité. Cette action supprimera tous les prospects et l'historique des emails.
            </p>
            <button 
              onClick={handleResetData}
              disabled={isResetting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all disabled:opacity-50 shadow-sm"
            >
              {isResetting ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
              Réinitialiser les données
            </button>
          </section>

          <section className="bg-petrol-dark dark:bg-slate-800 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl shadow-petrol-dark/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Info size={20} />
              </div>
              <h4 className="text-lg font-bold tracking-tight">Besoin d'aide ?</h4>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Les modifications apportées ici affectent l'ensemble du site public. Assurez-vous de vérifier les titres SEO pour un meilleur référencement.
            </p>
            <a 
              href="mailto:support@edcmiz.com"
              className="flex items-center justify-between w-full px-5 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-all group"
            >
              Contacter le support
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </section>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-10 py-5 bg-accent text-petrol-dark rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 border-4 border-white dark:border-slate-900"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}
