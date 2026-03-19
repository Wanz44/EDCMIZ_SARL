import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Plus, 
  Trash2, 
  X, 
  Save,
  Edit2,
  Settings,
  Layout,
  Zap,
  Shield,
  Search,
  CheckCircle2,
  Briefcase,
  Layers,
  Globe,
  Cpu
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const ICON_OPTIONS = [
  { name: 'Settings', icon: Settings },
  { name: 'Layout', icon: Layout },
  { name: 'Zap', icon: Zap },
  { name: 'Shield', icon: Shield },
  { name: 'Search', icon: Search },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Layers', icon: Layers },
  { name: 'Globe', icon: Globe },
  { name: 'Cpu', icon: Cpu },
];

export function ServicesView() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'Settings',
    image: '',
    status: 'Actif',
    category: 'BTP',
    features: ['']
  });

  useEffect(() => {
    const path = 'services';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'services'), {
        ...newService,
        createdAt: Timestamp.now()
      });
      setShowAddModal(false);
      setNewService({
        title: '',
        description: '',
        icon: 'Settings',
        image: '',
        status: 'Actif',
        category: 'BTP',
        features: ['']
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'services');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'services', editingService.id), {
        ...editingService,
        updatedAt: Timestamp.now()
      });
      setShowEditModal(false);
      setEditingService(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${editingService.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
    }
  };

  const addFeature = (isEdit: boolean) => {
    if (isEdit) {
      setEditingService({
        ...editingService,
        features: [...(editingService.features || []), '']
      });
    } else {
      setNewService({
        ...newService,
        features: [...newService.features, '']
      });
    }
  };

  const updateFeature = (index: number, value: string, isEdit: boolean) => {
    if (isEdit) {
      const newFeatures = [...editingService.features];
      newFeatures[index] = value;
      setEditingService({ ...editingService, features: newFeatures });
    } else {
      const newFeatures = [...newService.features];
      newFeatures[index] = value;
      setNewService({ ...newService, features: newFeatures });
    }
  };

  const removeFeature = (index: number, isEdit: boolean) => {
    if (isEdit) {
      const newFeatures = editingService.features.filter((_: any, i: number) => i !== index);
      setEditingService({ ...editingService, features: newFeatures });
    } else {
      const newFeatures = newService.features.filter((_, i) => i !== index);
      setNewService({ ...newService, features: newFeatures });
    }
  };

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-accent" size={32} /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">Services</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gérez vos offres et expertises</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-petrol-dark rounded-xl text-sm font-black uppercase tracking-widest hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Nouveau Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {services.map((service) => (
            <motion.div 
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row"
            >
              <div className="w-full md:w-48 h-48 md:h-auto relative overflow-hidden shrink-0">
                <img 
                  src={service.image || 'https://picsum.photos/seed/service/400/400'} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-petrol-dark/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-4 left-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-accent shadow-lg">
                  {React.createElement(ICON_OPTIONS.find(i => i.name === service.icon)?.icon || Settings, { size: 20 })}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {service.category || 'BTP'}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                      service.status === 'Actif' ? "text-emerald-500 bg-emerald-500/10" : "text-slate-400 bg-slate-400/10"
                    )}>
                      {service.status}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => {
                        setEditingService(service);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{service.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-auto space-y-1">
                  {service.features?.slice(0, 2).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                      <CheckCircle2 size={10} className="text-accent" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                  {service.features?.length > 2 && (
                    <p className="text-[10px] text-accent font-bold italic">+{service.features.length - 2} autres points</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {services.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Zap size={32} />
            </div>
            <p className="text-slate-400 italic">Aucun service enregistré.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-petrol-dark/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/10"
            >
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <Zap size={20} />
                  </div>
                  <h4 className="font-black text-petrol-dark dark:text-white uppercase tracking-tight">
                    {showAddModal ? 'Nouveau Service' : 'Modifier le Service'}
                  </h4>
                </div>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }} 
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={showAddModal ? handleAddService : handleEditService} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nom du Service</label>
                    <input 
                      type="text" 
                      required
                      value={showAddModal ? newService.title : editingService?.title}
                      onChange={e => showAddModal ? setNewService({...newService, title: e.target.value}) : setEditingService({...editingService, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                    <select 
                      value={showAddModal ? newService.category : editingService?.category}
                      onChange={e => showAddModal ? setNewService({...newService, category: e.target.value}) : setEditingService({...editingService, category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200"
                    >
                      <option value="BTP">BTP & Infrastructures</option>
                      <option value="Digital">Digital & IT</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Icône</label>
                    <div className="flex flex-wrap gap-3">
                      {ICON_OPTIONS.map((opt) => (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => showAddModal ? setNewService({...newService, icon: opt.name}) : setEditingService({...editingService, icon: opt.name})}
                          className={cn(
                            "w-12 h-12 rounded-xl border flex items-center justify-center transition-all",
                            (showAddModal ? newService.icon : editingService?.icon) === opt.name
                              ? "bg-accent border-accent text-petrol-dark shadow-lg shadow-accent/20"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-accent/50"
                          )}
                        >
                          <opt.icon size={20} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</label>
                    <select 
                      value={showAddModal ? newService.status : editingService?.status}
                      onChange={e => showAddModal ? setNewService({...newService, status: e.target.value}) : setEditingService({...editingService, status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200"
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload 
                      label="Image d'illustration"
                      currentUrl={showAddModal ? newService.image : editingService?.image}
                      onUpload={(url) => showAddModal ? setNewService({...newService, image: url}) : setEditingService({...editingService, image: url})}
                      folder="services"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                    <textarea 
                      rows={3}
                      required
                      value={showAddModal ? newService.description : editingService?.description}
                      onChange={e => showAddModal ? setNewService({...newService, description: e.target.value}) : setEditingService({...editingService, description: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200 custom-scrollbar" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Points Clés / Caractéristiques</label>
                      <button 
                        type="button"
                        onClick={() => addFeature(!!editingService)}
                        className="text-[10px] font-black uppercase text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Ajouter un point
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(showAddModal ? newService.features : editingService?.features || []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={feature}
                            onChange={e => updateFeature(idx, e.target.value, !!editingService)}
                            placeholder={`Point n°${idx + 1}`}
                            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200"
                          />
                          <button 
                            type="button"
                            onClick={() => removeFeature(idx, !!editingService)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                    className="px-6 py-2.5 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-2.5 bg-petrol-dark dark:bg-accent text-white dark:text-petrol-dark rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {showAddModal ? 'Enregistrer' : 'Mettre à jour'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

