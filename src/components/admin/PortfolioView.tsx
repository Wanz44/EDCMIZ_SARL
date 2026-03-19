import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Plus, 
  MapPin, 
  Trash2, 
  X, 
  Save,
  Edit2,
  ExternalLink,
  Briefcase
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

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-accent" size={32} /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">Réalisations</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gérez votre portfolio de projets</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-petrol-dark rounded-xl text-sm font-black uppercase tracking-widest hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Nouveau Projet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500"
            >
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={project.image || 'https://picsum.photos/seed/construction/800/600'} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 glass-mica px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                  {project.status}
                </div>
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingProject(project);
                        setShowEditModal(true);
                      }}
                      className="flex-1 py-2 bg-white text-petrol-dark rounded-lg text-xs font-bold hover:bg-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={14} /> Modifier
                    </button>
                    <button 
                      onClick={() => deleteProject(project.id)}
                      className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-accent transition-colors">{project.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin size={12} /> {project.location}
                </p>
                {project.description && (
                  <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed italic">
                    {project.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <motion.button 
          layout
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 dark:text-slate-600 hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent transition-all group min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-accent/10 group-hover:scale-110 transition-all">
            <Plus size={32} />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest">Ajouter un projet</p>
        </motion.button>
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
                    <Briefcase size={20} />
                  </div>
                  <h4 className="font-black text-petrol-dark dark:text-white uppercase tracking-tight">
                    {showAddModal ? 'Nouveau Projet' : 'Modifier le Projet'}
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
              <form onSubmit={showAddModal ? handleAddProject : handleEditProject} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre du Projet</label>
                    <input 
                      type="text" 
                      required
                      value={showAddModal ? newProject.title : editingProject?.title}
                      onChange={e => showAddModal ? setNewProject({...newProject, title: e.target.value}) : setEditingProject({...editingProject, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Localisation</label>
                    <input 
                      type="text" 
                      required
                      value={showAddModal ? newProject.location : editingProject?.location}
                      onChange={e => showAddModal ? setNewProject({...newProject, location: e.target.value}) : setEditingProject({...editingProject, location: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</label>
                    <select 
                      value={showAddModal ? newProject.status : editingProject?.status}
                      onChange={e => showAddModal ? setNewProject({...newProject, status: e.target.value}) : setEditingProject({...editingProject, status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200"
                    >
                      <option value="Terminé">Terminé</option>
                      <option value="En cours">En cours</option>
                      <option value="Étude">Étude</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                    <select 
                      value={showAddModal ? newProject.category : editingProject?.category}
                      onChange={e => showAddModal ? setNewProject({...newProject, category: e.target.value}) : setEditingProject({...editingProject, category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200"
                    >
                      <option value="BTP">BTP & Infrastructures</option>
                      <option value="Digital">Digital & IT</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload 
                      label="Image du Projet"
                      currentUrl={showAddModal ? newProject.image : editingProject?.image}
                      onUpload={(url) => showAddModal ? setNewProject({...newProject, image: url}) : setEditingProject({...editingProject, image: url})}
                      folder="projects"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                    <textarea 
                      rows={3}
                      value={showAddModal ? newProject.description : editingProject?.description}
                      onChange={e => showAddModal ? setNewProject({...newProject, description: e.target.value}) : setEditingProject({...editingProject, description: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200 custom-scrollbar" 
                    />
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

