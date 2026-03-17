import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Plus, 
  Users, 
  Trash2, 
  X, 
  Save 
} from 'lucide-react';
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

export function PortfolioView() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    location: '',
    status: 'Terminé',
    image: '',
    category: 'BTP',
    description: ''
  });

  useEffect(() => {
    const path = 'projects';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        createdAt: Timestamp.now()
      });
      setShowAddModal(false);
      setNewProject({
        title: '',
        location: '',
        status: 'Terminé',
        image: '',
        category: 'BTP',
        description: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'projects', editingProject.id), {
        ...editingProject,
        updatedAt: Timestamp.now()
      });
      setShowEditModal(false);
      setEditingProject(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${editingProject.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Gestion des Réalisations</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-petrol-dark rounded-xl text-sm font-bold hover:bg-accent/90"
        >
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
                <button 
                  onClick={() => {
                    setEditingProject(project);
                    setShowEditModal(true);
                  }}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Modifier
                </button>
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button 
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-accent hover:text-accent transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-accent/10">
            <Plus size={24} />
          </div>
          <p className="text-sm font-bold">Ajouter un projet</p>
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[110] bg-petrol-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-petrol-dark uppercase tracking-tight">Ajouter un Projet</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre du Projet</label>
                  <input 
                    type="text" 
                    required
                    value={newProject.title}
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Localisation</label>
                  <input 
                    type="text" 
                    required
                    value={newProject.location}
                    onChange={e => setNewProject({...newProject, location: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</label>
                  <select 
                    value={newProject.status}
                    onChange={e => setNewProject({...newProject, status: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Terminé">Terminé</option>
                    <option value="En cours">En cours</option>
                    <option value="Étude">Étude</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                  <select 
                    value={newProject.category}
                    onChange={e => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="BTP">BTP & Infrastructures</option>
                    <option value="Digital">Digital & IT</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">URL de l'image</label>
                  <input 
                    type="text" 
                    required
                    value={newProject.image}
                    onChange={e => setNewProject({...newProject, image: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                  <textarea 
                    rows={3}
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
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
                  className="px-8 py-2 bg-petrol-dark text-white rounded-xl font-black uppercase text-sm tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingProject && (
        <div className="fixed inset-0 z-[110] bg-petrol-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-petrol-dark uppercase tracking-tight">Modifier le Projet</h4>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditProject} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre du Projet</label>
                  <input 
                    type="text" 
                    required
                    value={editingProject.title}
                    onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Localisation</label>
                  <input 
                    type="text" 
                    required
                    value={editingProject.location}
                    onChange={e => setEditingProject({...editingProject, location: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</label>
                  <select 
                    value={editingProject.status}
                    onChange={e => setEditingProject({...editingProject, status: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Terminé">Terminé</option>
                    <option value="En cours">En cours</option>
                    <option value="Étude">Étude</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                  <select 
                    value={editingProject.category}
                    onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="BTP">BTP & Infrastructures</option>
                    <option value="Digital">Digital & IT</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">URL de l'image</label>
                  <input 
                    type="text" 
                    required
                    value={editingProject.image}
                    onChange={e => setEditingProject({...editingProject, image: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                  <textarea 
                    rows={3}
                    value={editingProject.description}
                    onChange={e => setEditingProject({...editingProject, description: e.target.value})}
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
                  className="px-8 py-2 bg-petrol-dark text-white rounded-xl font-black uppercase text-sm tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
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
