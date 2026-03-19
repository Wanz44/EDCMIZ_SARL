import React, { useState, useEffect, useCallback } from 'react';
import { 
  Loader2, 
  Plus, 
  Briefcase, 
  Settings, 
  Trash2, 
  X, 
  Save,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardHat,
  Truck,
  Wrench,
  MoreVertical,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
import { cn } from '@/src/lib/utils';

const CATEGORIES = [
  { id: 'Engins de chantier', label: 'Engins de chantier', icon: HardHat },
  { id: 'Outillage', label: 'Outillage', icon: Wrench },
  { id: 'Transport', label: 'Transport', icon: Truck },
  { id: 'Autre', label: 'Autre', icon: Briefcase },
];

const STATUSES = [
  { id: 'Disponible', label: 'Disponible', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
  { id: 'En maintenance', label: 'En maintenance', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
  { id: 'Sur chantier', label: 'Sur chantier', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: HardHat },
  { id: 'Hors service', label: 'Hors service', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle },
];

export function EquipmentView() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEquip, setEditingEquip] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newEquip, setNewEquip] = useState({
    name: '',
    category: 'Engins de chantier',
    status: 'Disponible',
    imageUrl: '',
    description: '',
    serialNumber: '',
    purchaseDate: ''
  });

  useEffect(() => {
    const path = 'equipment';
    const q = query(collection(db, path), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEquipment(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'equipment'), {
        ...newEquip,
        createdAt: Timestamp.now()
      });
      setShowAddModal(false);
      setNewEquip({
        name: '',
        category: 'Engins de chantier',
        status: 'Disponible',
        imageUrl: '',
        description: '',
        serialNumber: '',
        purchaseDate: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'equipment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEquip) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'equipment', editingEquip.id), {
        ...editingEquip,
        updatedAt: Timestamp.now()
      });
      setShowEditModal(false);
      setEditingEquip(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `equipment/${editingEquip.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEquipment = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet équipement ?')) return;
    const path = `equipment/${id}`;
    try {
      await deleteDoc(doc(db, 'equipment', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Chargement du parc matériel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Parc Matériel</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gérez vos engins, outils et équipements de chantier.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-petrol-dark rounded-2xl text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Ajouter un équipement</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Rechercher un équipement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setFilterCategory('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
              filterCategory === 'all' 
                ? "bg-petrol-dark text-white border-petrol-dark dark:bg-accent dark:text-petrol-dark dark:border-accent" 
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-accent"
            )}
          >
            Tous
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                filterCategory === cat.id 
                  ? "bg-petrol-dark text-white border-petrol-dark dark:bg-accent dark:text-petrol-dark dark:border-accent" 
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-accent"
              )}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredEquipment.map((item) => {
            const statusInfo = STATUSES.find(s => s.id === item.status) || STATUSES[0];
            const categoryInfo = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[3];
            
            return (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="aspect-video bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                      <categoryInfo.icon size={48} strokeWidth={1} />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm",
                      statusInfo.bg,
                      statusInfo.color,
                      statusInfo.border
                    )}>
                      <statusInfo.icon size={12} />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button 
                      onClick={() => {
                        setEditingEquip(item);
                        setShowEditModal(true);
                      }}
                      className="p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg rounded-xl text-slate-600 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteEquipment(item.id)}
                      className="p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent">
                      <categoryInfo.icon size={12} />
                      {categoryInfo.label}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      Ajouté le {item.createdAt?.toDate().toLocaleDateString('fr-FR')}
                    </div>
                    {item.serialNumber && (
                      <div className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">
                        SN: {item.serialNumber}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredEquipment.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-4">
            <Search size={32} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Aucun équipement trouvé</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">Essayez de modifier vos filtres ou ajoutez un nouvel équipement.</p>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Nouvel Équipement</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Remplissez les détails techniques de l'équipement.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="p-2 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddEquipment} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Nom de l'équipement</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Grue à tour Potain"
                        value={newEquip.name}
                        onChange={e => setNewEquip({...newEquip, name: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">N° de Série</label>
                      <input 
                        type="text" 
                        placeholder="Ex: SN-12345678"
                        value={newEquip.serialNumber}
                        onChange={e => setNewEquip({...newEquip, serialNumber: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Catégorie</label>
                      <select 
                        value={newEquip.category}
                        onChange={e => setNewEquip({...newEquip, category: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white appearance-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Statut Initial</label>
                      <select 
                        value={newEquip.status}
                        onChange={e => setNewEquip({...newEquip, status: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white appearance-none"
                      >
                        {STATUSES.map(status => (
                          <option key={status.id} value={status.id}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ImageUpload 
                    label="Photo de l'équipement"
                    currentUrl={newEquip.imageUrl}
                    onUpload={(url) => setNewEquip({...newEquip, imageUrl: url})}
                    folder="equipment"
                  />

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Description & Spécifications</label>
                    <textarea 
                      rows={4}
                      placeholder="Détails techniques, capacité, année de fabrication..."
                      value={newEquip.description}
                      onChange={e => setNewEquip({...newEquip, description: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white resize-none" 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-700 dark:hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-10 py-3 bg-petrol-dark dark:bg-accent text-white dark:text-petrol-dark rounded-2xl font-bold text-sm shadow-lg shadow-petrol-dark/10 dark:shadow-accent/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Enregistrer l'équipement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingEquip && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Modifier l'Équipement</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Mettez à jour les informations techniques.</p>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="p-2 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditEquipment} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Nom de l'équipement</label>
                      <input 
                        type="text" 
                        required
                        value={editingEquip.name}
                        onChange={e => setEditingEquip({...editingEquip, name: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">N° de Série</label>
                      <input 
                        type="text" 
                        value={editingEquip.serialNumber || ''}
                        onChange={e => setEditingEquip({...editingEquip, serialNumber: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Catégorie</label>
                      <select 
                        value={editingEquip.category}
                        onChange={e => setEditingEquip({...editingEquip, category: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white appearance-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Statut Actuel</label>
                      <select 
                        value={editingEquip.status}
                        onChange={e => setEditingEquip({...editingEquip, status: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white appearance-none"
                      >
                        {STATUSES.map(status => (
                          <option key={status.id} value={status.id}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ImageUpload 
                    label="Photo de l'équipement"
                    currentUrl={editingEquip.imageUrl}
                    onUpload={(url) => setEditingEquip({...editingEquip, imageUrl: url})}
                    folder="equipment"
                  />

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Description & Spécifications</label>
                    <textarea 
                      rows={4}
                      value={editingEquip.description}
                      onChange={e => setEditingEquip({...editingEquip, description: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all dark:text-white resize-none" 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-700 dark:hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-10 py-3 bg-petrol-dark dark:bg-accent text-white dark:text-petrol-dark rounded-2xl font-bold text-sm shadow-lg shadow-petrol-dark/10 dark:shadow-accent/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Mettre à jour
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
