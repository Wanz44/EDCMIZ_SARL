import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Plus, 
  Briefcase, 
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
import { cn } from '@/src/lib/utils';

export function EquipmentView() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEquip, setEditingEquip] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newEquip, setNewEquip] = useState({
    name: '',
    category: 'Engins de chantier',
    status: 'Disponible',
    imageUrl: '',
    description: ''
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
        description: ''
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

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Gestion du Parc Matériel</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-petrol-dark rounded-xl text-sm font-bold hover:bg-accent/90"
        >
          <Plus size={18} /> Nouvel Équipement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group">
            <div className="h-40 bg-slate-100 relative">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Briefcase size={48} />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingEquip(item);
                    setShowEditModal(true);
                  }}
                  className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg text-slate-600 hover:text-accent"
                >
                  <Settings size={16} />
                </button>
                <button 
                  onClick={() => deleteEquipment(item.id)}
                  className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg text-slate-600 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  item.status === 'Disponible' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-slate-800">{item.name}</h4>
              <p className="text-xs text-slate-500">{item.category || 'Sans catégorie'}</p>
            </div>
          </div>
        ))}
        {equipment.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 italic">
            Aucun équipement enregistré.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[110] bg-petrol-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-petrol-dark uppercase tracking-tight">Ajouter un Équipement</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEquipment} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nom de l'équipement</label>
                  <input 
                    type="text" 
                    required
                    value={newEquip.name}
                    onChange={e => setNewEquip({...newEquip, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                    <select 
                      value={newEquip.category}
                      onChange={e => setNewEquip({...newEquip, category: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                    >
                      <option value="Engins de chantier">Engins de chantier</option>
                      <option value="Outillage">Outillage</option>
                      <option value="Transport">Transport</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</label>
                    <select 
                      value={newEquip.status}
                      onChange={e => setNewEquip({...newEquip, status: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="En maintenance">En maintenance</option>
                      <option value="Sur chantier">Sur chantier</option>
                    </select>
                  </div>
                </div>
                <ImageUpload 
                  label="Image de l'équipement"
                  currentUrl={newEquip.imageUrl}
                  onUpload={(url) => setNewEquip({...newEquip, imageUrl: url})}
                  folder="equipment"
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                  <textarea 
                    rows={3}
                    value={newEquip.description}
                    onChange={e => setNewEquip({...newEquip, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
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

      {showEditModal && editingEquip && (
        <div className="fixed inset-0 z-[110] bg-petrol-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-petrol-dark uppercase tracking-tight">Modifier l'Équipement</h4>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditEquipment} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nom de l'équipement</label>
                  <input 
                    type="text" 
                    required
                    value={editingEquip.name}
                    onChange={e => setEditingEquip({...editingEquip, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                    <select 
                      value={editingEquip.category}
                      onChange={e => setEditingEquip({...editingEquip, category: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                    >
                      <option value="Engins de chantier">Engins de chantier</option>
                      <option value="Outillage">Outillage</option>
                      <option value="Transport">Transport</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</label>
                    <select 
                      value={editingEquip.status}
                      onChange={e => setEditingEquip({...editingEquip, status: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="En maintenance">En maintenance</option>
                      <option value="Sur chantier">Sur chantier</option>
                    </select>
                  </div>
                </div>
                <ImageUpload 
                  label="Image de l'équipement"
                  currentUrl={editingEquip.imageUrl}
                  onUpload={(url) => setEditingEquip({...editingEquip, imageUrl: url})}
                  folder="equipment"
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                  <textarea 
                    rows={3}
                    value={editingEquip.description}
                    onChange={e => setEditingEquip({...editingEquip, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
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
