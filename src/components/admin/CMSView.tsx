import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Plus, 
  Briefcase, 
  Settings, 
  Trash2, 
  X, 
  Save,
  Upload
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
  getDoc,
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { cn } from '@/src/lib/utils';

export function CMSView() {
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'why' | 'news' | 'testimonials'>('hero');
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // News Management States
  const [news, setNews] = useState<any[]>([]);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showEditNewsModal, setShowEditNewsModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Actualité'
  });

  useEffect(() => {
    const fetchContent = async () => {
      const path = 'content/site';
      try {
        const docRef = doc(db, 'content', 'site');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          // Initial state if not exists
          setContent({
            hero: {
              title: "L'Excellence en Construction Générale.",
              subtitle: "Entreprise de Construction MIZAKU SARL",
              description: "Spécialiste des travaux de bâtiment, génie civil et rénovation. Nous bâtissons des structures solides et durables.",
              imageUrl: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/Architecture/ABC03.jpg",
              ctaText: "Demander un devis gratuit",
              ctaLink: "https://wa.me/243829002360"
            },
            about: {
              title: "Bâtir l'Avenir avec Rigueur et Innovation",
              description: "EDCMIZ sarl est une entreprise leader en République Démocratique du Congo...",
              imageUrl: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/Architecture/ABC01.jpg",
              experienceYears: "6+"
            }
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    };
    fetchContent();

    // Fetch News
    const newsPath = 'news';
    const q = query(collection(db, newsPath), orderBy('date', 'desc'));
    const unsubscribeNews = onSnapshot(q, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, newsPath);
    });

    return () => unsubscribeNews();
  }, []);

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'news'), {
        ...newArticle,
        createdAt: Timestamp.now()
      });
      setShowAddNewsModal(false);
      setNewArticle({
        title: '',
        content: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Actualité'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'news');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'news', editingArticle.id), {
        ...editingArticle,
        updatedAt: Timestamp.now()
      });
      setShowEditNewsModal(false);
      setEditingArticle(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `news/${editingArticle.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `news/${id}`);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const path = 'content/site';
    try {
      await setDoc(doc(db, 'content', 'site'), content);
      alert('Contenu mis à jour avec succès !');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  if (!content) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveSection('hero')}
          className={cn("px-4 py-2 text-sm font-bold transition-all", activeSection === 'hero' ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-600")}
        >
          Hero
        </button>
        <button 
          onClick={() => setActiveSection('about')}
          className={cn("px-4 py-2 text-sm font-bold transition-all", activeSection === 'about' ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-600")}
        >
          À Propos
        </button>
        <button 
          onClick={() => setActiveSection('news')}
          className={cn("px-4 py-2 text-sm font-bold transition-all", activeSection === 'news' ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-600")}
        >
          Actualités
        </button>
        <button 
          onClick={() => setActiveSection('testimonials')}
          className={cn("px-4 py-2 text-sm font-bold transition-all", activeSection === 'testimonials' ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-600")}
        >
          Témoignages
        </button>
      </div>

      <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm max-w-4xl">
        {activeSection === 'hero' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Section Hero</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sous-titre (H2)</label>
                <input 
                  type="text" 
                  value={content.hero.subtitle}
                  onChange={e => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre Principal (H1)</label>
                <input 
                  type="text" 
                  value={content.hero.title}
                  onChange={e => setContent({...content, hero: {...content.hero, title: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                <textarea 
                  rows={3}
                  value={content.hero.description}
                  onChange={e => setContent({...content, hero: {...content.hero, description: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Image de fond (URL)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={content.hero.imageUrl}
                    onChange={e => setContent({...content, hero: {...content.hero, imageUrl: e.target.value}})}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                  <button className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">
                    <Upload size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Section À Propos</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre</label>
                <input 
                  type="text" 
                  value={content.about.title}
                  onChange={e => setContent({...content, about: {...content.about, title: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                <textarea 
                  rows={6}
                  value={content.about.description}
                  onChange={e => setContent({...content, about: {...content.about, description: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Années d'Expérience</label>
                  <input 
                    type="text" 
                    value={content.about.experienceYears}
                    onChange={e => setContent({...content, about: {...content.about, experienceYears: e.target.value}})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Image (URL)</label>
                  <input 
                    type="text" 
                    value={content.about.imageUrl}
                    onChange={e => setContent({...content, about: {...content.about, imageUrl: e.target.value}})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'news' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Actualités & Blog</h4>
              <button 
                onClick={() => setShowAddNewsModal(true)}
                className="text-xs font-bold text-accent flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Ajouter un article
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {news.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Briefcase size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm truncate">{item.title}</h5>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingArticle(item);
                        setShowEditNewsModal(true);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600"
                    >
                      <Settings size={18} />
                    </button>
                    <button 
                      onClick={() => deleteNews(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {news.length === 0 && (
                <p className="text-sm text-slate-500 italic py-8 text-center">Aucun article publié pour le moment.</p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Témoignages Clients</h4>
              <button className="text-xs font-bold text-accent flex items-center gap-1 hover:underline">
                <Plus size={14} /> Ajouter un avis
              </button>
            </div>
            <p className="text-sm text-slate-500 italic">La gestion détaillée des témoignages sera disponible dans une mise à jour prochaine.</p>
          </div>
        )}

        {activeSection !== 'news' && activeSection !== 'testimonials' && (
          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-petrol-dark text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Enregistrer les modifications
            </button>
          </div>
        )}
      </div>

      {/* Modals for News */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-[110] bg-petrol-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-petrol-dark uppercase tracking-tight">Nouvel Article</h4>
              <button onClick={() => setShowAddNewsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddNews} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre de l'article</label>
                  <input 
                    type="text" 
                    required
                    value={newArticle.title}
                    onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                    <input 
                      type="text" 
                      required
                      value={newArticle.category}
                      onChange={e => setNewArticle({...newArticle, category: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date de publication</label>
                    <input 
                      type="date" 
                      required
                      value={newArticle.date}
                      onChange={e => setNewArticle({...newArticle, date: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">URL de l'image</label>
                  <input 
                    type="text" 
                    value={newArticle.image}
                    onChange={e => setNewArticle({...newArticle, image: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contenu de l'article</label>
                  <textarea 
                    rows={8}
                    required
                    value={newArticle.content}
                    onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
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
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditNewsModal && editingArticle && (
        <div className="fixed inset-0 z-[110] bg-petrol-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-petrol-dark uppercase tracking-tight">Modifier l'Article</h4>
              <button onClick={() => setShowEditNewsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditNews} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre de l'article</label>
                  <input 
                    type="text" 
                    required
                    value={editingArticle.title}
                    onChange={e => setEditingArticle({...editingArticle, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                    <input 
                      type="text" 
                      required
                      value={editingArticle.category}
                      onChange={e => setEditingArticle({...editingArticle, category: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date de publication</label>
                    <input 
                      type="date" 
                      required
                      value={editingArticle.date}
                      onChange={e => setEditingArticle({...editingArticle, date: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">URL de l'image</label>
                  <input 
                    type="text" 
                    value={editingArticle.image}
                    onChange={e => setEditingArticle({...editingArticle, image: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contenu de l'article</label>
                  <textarea 
                    rows={8}
                    required
                    value={editingArticle.content}
                    onChange={e => setEditingArticle({...editingArticle, content: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowEditNewsModal(false)}
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
