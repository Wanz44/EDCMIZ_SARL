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
    <section id="showcase" className="py-32 bg-slate-50 overflow-hidden relative">
      {/* Atmospheric Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-petrol/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
            Vitrine Projets
          </div>
          <h2 className="text-5xl sm:text-7xl font-black text-petrol-dark leading-[1] tracking-tighter mb-8">
            Images & <span className="text-accent">Vidéos</span> de nos Chantiers
          </h2>
          <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-3xl mx-auto">
            Plongez au cœur de nos réalisations à travers cette galerie multimédia immersive. 
            Découvrez l'excellence de nos travaux en images et en mouvement.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-2xl border-2 ${
                filter === cat 
                  ? "bg-petrol-dark text-accent border-petrol-dark shadow-xl scale-105" 
                  : "bg-white text-petrol-dark border-slate-100 hover:border-accent hover:text-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] cursor-pointer bg-petrol-dark shadow-2xl"
                onClick={() => setSelectedItem(item.id)}
              >
                <img
                  src={item.type === 'video' ? (item.thumbnail || item.src) : item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark via-petrol-dark/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-6 right-6 w-14 h-14 bg-accent text-petrol-dark rounded-2xl flex items-center justify-center shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {item.type === 'video' ? <Play size={24} fill="currentColor" /> : <Maximize2 size={24} />}
                </div>

                <div className="absolute bottom-8 left-8 right-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-3">{item.category}</p>
                  <h4 className="text-white font-black text-xl leading-tight tracking-tight">{item.title}</h4>
                </div>

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform duration-500">
                      <Play size={32} fill="white" className="ml-1" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-24 text-center">
          <a 
            href="https://wa.me/243829002360?text=Bonjour%20EDCMIZ,%20je%20souhaite%20voir%20plus%20de%20vidéos%20de%20vos%20projets."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-petrol-dark text-white px-12 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:text-petrol-dark transition-all duration-300 group shadow-2xl active:scale-95"
          >
            Voir plus sur nos réseaux
            <ChevronRight className="ml-4 group-hover:translate-x-2 transition-transform duration-300" size={20} />
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
            className="fixed inset-0 z-[100] bg-petrol-dark/98 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-12"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[110] hover:scale-110 active:scale-90 duration-300"
              onClick={() => setSelectedItem(null)}
            >
              <X size={48} />
            </button>

            <button 
              className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all z-[110] bg-white/5 p-6 rounded-3xl hover:bg-white/10 hover:scale-110 active:scale-90 duration-300"
              onClick={handlePrev}
            >
              <ChevronLeft size={48} />
            </button>

            <button 
              className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all z-[110] bg-white/5 p-6 rounded-3xl hover:bg-white/10 hover:scale-110 active:scale-90 duration-300"
              onClick={handleNext}
            >
              <ChevronRight size={48} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-7xl w-full bg-white rounded-[3rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Section */}
              <div className="lg:w-2/3 bg-black flex items-center justify-center min-h-[400px] sm:min-h-[600px] relative">
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
                <div className="absolute top-8 left-8 bg-accent text-petrol-dark px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                  {currentMedia.category}
                </div>
              </div>
              
              {/* Info Section */}
              <div className="lg:w-1/3 p-12 sm:p-20 flex flex-col bg-white">
                <div className="mb-12">
                  <h4 className="text-petrol-dark text-4xl sm:text-5xl font-black leading-[1.1] tracking-tighter mb-6">
                    {currentMedia.title}
                  </h4>
                  <div className="h-1.5 w-20 bg-accent rounded-full" />
                </div>

                <div className="space-y-10 mb-16">
                  <div className="flex items-start group">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-accent mr-6 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Localisation</p>
                      <p className="text-petrol-dark font-black text-lg tracking-tight">{currentMedia.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-accent mr-6 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Durée du projet</p>
                      <p className="text-petrol-dark font-black text-lg tracking-tight">{currentMedia.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-accent mr-6 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Info size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Description</p>
                      <p className="text-slate-500 text-base font-medium leading-relaxed">{currentMedia.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-12 border-t border-slate-100 flex gap-6">
                  <button 
                    onClick={handlePrev}
                    className="flex-1 bg-slate-50 text-petrol-dark py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-100 transition-all duration-300 flex items-center justify-center active:scale-95"
                  >
                    <ChevronLeft size={20} className="mr-2" /> Précédent
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-1 bg-petrol-dark text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-accent hover:text-petrol-dark transition-all duration-300 flex items-center justify-center shadow-xl active:scale-95"
                  >
                    Suivant <ChevronRight size={20} className="ml-2" />
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
