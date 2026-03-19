import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Image as ImageIcon, X, Maximize2, ChevronLeft, ChevronRight, MapPin, Clock, Info, Loader2 } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Showcase() {
  const [filter, setFilter] = useState('Tous');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'showcase';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGalleryItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['Tous', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const filteredItems = filter === 'Tous' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItem === null) return;
    const currentIndex = galleryItems.findIndex(item => item.id === selectedItem);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setSelectedItem(galleryItems[nextIndex].id);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItem === null) return;
    const currentIndex = galleryItems.findIndex(item => item.id === selectedItem);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedItem(galleryItems[prevIndex].id);
  };

  const currentMedia = galleryItems.find(item => item.id === selectedItem);

  if (loading && galleryItems.length === 0) {
    return (
      <section id="showcase" className="py-24 bg-slate-50 flex items-center justify-center min-h-[400px]">
        <Loader2 className="text-accent animate-spin" size={48} />
      </section>
    );
  }

  return (
    <section id="showcase" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-petrol font-bold uppercase tracking-widest mb-2">Vitrine Projets</h2>
          <h3 className="text-4xl font-black text-petrol-dark">Images & Vidéos de nos Chantiers</h3>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-6" />
          <p className="text-slate-500 mt-6 max-w-2xl mx-auto">
            Plongez au cœur de nos réalisations à travers cette galerie multimédia. 
            Découvrez l'excellence de nos travaux en images et en mouvement.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-sm border ${
                filter === cat 
                  ? "bg-petrol-dark text-accent border-petrol-dark" 
                  : "bg-white text-petrol-dark border-slate-200 hover:border-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 [perspective:1000px]"
        >
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  y: -5,
                  rotateX: 2,
                  rotateY: 2,
                  scale: 1.02
                }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer bg-petrol-dark transform-gpu"
                onClick={() => setSelectedItem(item.id)}
              >
                <img
                  src={item.type === 'video' ? (item.thumbnail || item.src) : item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-4 right-4 w-10 h-10 bg-accent text-petrol-dark rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  {item.type === 'video' ? <Play size={20} fill="currentColor" /> : <Maximize2 size={20} />}
                </div>

                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{item.category}</p>
                  <h4 className="text-white font-bold text-sm leading-tight">{item.title}</h4>
                </div>

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                      <Play size={32} fill="white" className="ml-1" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-16 text-center">
          <a 
            href="https://wa.me/243829002360?text=Bonjour%20EDCMIZ,%20je%20souhaite%20voir%20plus%20de%20vidéos%20de%20vos%20projets."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-petrol-dark text-white px-8 py-4 rounded-sm font-bold hover:bg-accent hover:text-petrol-dark transition-all group"
          >
            Voir plus sur nos réseaux
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem !== null && currentMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-petrol-dark/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedItem(null)}
            >
              <X size={40} />
            </button>

            <button 
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] bg-white/5 p-4 rounded-full"
              onClick={handlePrev}
            >
              <ChevronLeft size={40} />
            </button>

            <button 
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] bg-white/5 p-4 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight size={40} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full bg-white rounded-sm overflow-hidden shadow-2xl flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Section */}
              <div className="lg:w-2/3 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[500px]">
                {currentMedia.type === 'video' ? (
                  <video 
                    src={currentMedia.src} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img 
                    src={currentMedia.src} 
                    alt={currentMedia.title} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              
              {/* Info Section */}
              <div className="lg:w-1/3 p-8 sm:p-12 flex flex-col bg-white">
                <div className="mb-8">
                  <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">{currentMedia.category}</p>
                  <h4 className="text-petrol-dark text-3xl font-black leading-tight">{currentMedia.title}</h4>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-petrol mr-4 shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Localisation</p>
                      <p className="text-petrol-dark font-bold">{currentMedia.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-petrol mr-4 shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Durée du projet</p>
                      <p className="text-petrol-dark font-bold">{currentMedia.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-petrol mr-4 shrink-0">
                      <Info size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Description</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{currentMedia.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={handlePrev}
                    className="flex-1 bg-slate-100 text-petrol-dark py-3 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Précédent
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-1 bg-petrol-dark text-white py-3 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-accent hover:text-petrol-dark transition-colors flex items-center justify-center"
                  >
                    Suivant <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
