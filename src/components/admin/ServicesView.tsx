import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Plus, 
  FileText, 
  Settings, 
  Trash2, 
  X, 
  Save 
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
    icon: 'Droplets',
    image: '',
    status: 'Actif'
  });

  useEffect(() => {
    const path = 'services';
    const q = query(collection(db, path), orderBy('title', 'asc'));
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
        icon: 'Droplets',
        image: '',
        status: 'Actif'
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

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Gestion des Services</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-petrol-dark rounded-xl text-sm font-bold hover:bg-accent/90"
        >
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
              <button 
                onClick={() => {
                  setEditingService(s);
                  setShowEditModal(true);
                }}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <Settings size={18} />
              </button>
              <button 
                onClick={() => deleteService(s.id)}
                className="p-2 text-slate-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 italic">
            Aucun service enregistré.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[110] bg-petrol-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-petrol-dark uppercase tracking-tight">Ajouter un Service</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddService} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre du Service</label>
                  <input 
                    type="text" 
                    required
                    value={newService.title}
                    onChange={e => setNewService({...newService, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={newService.description}
                    onChange={e => setNewService({...newService, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Icône (Lucide Name)</label>
                    <input 
                      type="text" 
                      value={newService.icon}
                      onChange={e => setNewService({...newService, icon: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</label>
                    <select 
                      value={newService.status}
                      onChange={e => setNewService({...newService, status: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                </div>
                <ImageUpload 
                  label="Image du Service (Optionnel)"
                  currentUrl={newService.image}
                  onUpload={(url) => setNewService({...newService, image: url})}
                  folder="services"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 text-slate-500 font-bold text-sm"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-2 bg-petrol-dark text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingService && (
        <div className="fixed inset-0 z-[110] bg-petrol-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-petrol-dark uppercase tracking-tight">Modifier le Service</h4>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditService} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre du Service</label>
                  <input 
                    type="text" 
                    required
                    value={editingService.title}
                    onChange={e => setEditingService({...editingService, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={editingService.description}
                    onChange={e => setEditingService({...editingService, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Icône (Lucide Name)</label>
                    <input 
                      type="text" 
                      value={editingService.icon}
                      onChange={e => setEditingService({...editingService, icon: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</label>
                    <select 
                      value={editingService.status}
                      onChange={e => setEditingService({...editingService, status: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                </div>
                <ImageUpload 
                  label="Image du Service (Optionnel)"
                  currentUrl={editingService.image}
                  onUpload={(url) => setEditingService({...editingService, image: url})}
                  folder="services"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 text-slate-500 font-bold text-sm"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-2 bg-petrol-dark text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
