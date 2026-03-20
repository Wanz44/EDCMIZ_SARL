import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const path = 'news';
    const q = query(collection(db, 'news'), orderBy('date', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNews(newsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const nextSlide = () => {
    if (news.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    if (news.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  useEffect(() => {
    if (news.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, news.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (loading) {
    return (
      <section className="py-24 bg-slate-50 flex items-center justify-center min-h-[600px]">
        <Loader2 className="text-accent animate-spin" size={48} />
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section id="news" className="py-32 bg-slate-50 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-petrol/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Actualités
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-petrol-dark leading-[1.1] tracking-tighter">
              Dernières <span className="text-accent">Nouvelles</span> du Terrain
            </h2>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-petrol hover:bg-accent hover:text-petrol-dark transition-all duration-300 active:scale-90"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-petrol hover:bg-accent hover:text-petrol-dark transition-all duration-300 active:scale-90"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        <div className="relative h-[700px] md:h-[550px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 }
              }}
              className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100"
            >
              <div className="h-64 md:h-full relative overflow-hidden group">
                <img 
                  src={news[currentIndex].imageUrl} 
                  alt={news[currentIndex].title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark/60 to-transparent" />
                <div className="absolute top-8 left-8 bg-accent text-petrol-dark px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                  {news[currentIndex].category}
                </div>
              </div>
              <div className="p-10 md:p-20 flex flex-col justify-center">
                <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                  <Calendar size={16} className="mr-3 text-accent" />
                  {new Date(news[currentIndex].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h4 className="text-3xl md:text-5xl font-black text-petrol-dark mb-8 leading-[1.1] tracking-tighter">
                  {news[currentIndex].title}
                </h4>
                <p className="text-slate-500 text-lg mb-12 leading-relaxed font-medium line-clamp-3">
                  {news[currentIndex].excerpt}
                </p>
                <div className="mt-auto">
                  <button className="bg-petrol-dark text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center hover:bg-accent hover:text-petrol-dark transition-all duration-300 group shadow-xl active:scale-95">
                    Lire l'article complet 
                    <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform duration-300" size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-16 gap-4">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'bg-accent w-12' : 'bg-petrol/20 w-4 hover:bg-petrol/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
