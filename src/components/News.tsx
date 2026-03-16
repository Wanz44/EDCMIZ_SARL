import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNews(newsData);
      setLoading(false);
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
    <section id="news" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Actualités</h2>
            <h3 className="text-4xl font-black text-petrol-dark">Dernières Nouvelles</h3>
          </div>
        </div>

        <div className="relative h-[600px] md:h-[450px] group/carousel">
          {/* Navigation Arrows Overlay */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-petrol hover:bg-accent hover:text-petrol-dark transition-all opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-4 hidden md:flex"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-petrol hover:bg-accent hover:text-petrol-dark transition-all opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:-translate-x-4 hidden md:flex"
          >
            <ChevronRight size={28} />
          </button>

          {/* Mobile Navigation Arrows */}
          <div className="absolute -bottom-16 left-0 right-0 flex justify-between md:hidden px-4">
             <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-petrol"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-petrol"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="h-64 md:h-full relative overflow-hidden">
                <img 
                  src={news[currentIndex].imageUrl} 
                  alt={news[currentIndex].title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 bg-accent text-petrol-dark px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm shadow-lg">
                  {news[currentIndex].category}
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center text-slate-400 text-sm mb-6">
                  <Calendar size={18} className="mr-2" />
                  {new Date(news[currentIndex].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-petrol-dark mb-6 leading-tight">
                  {news[currentIndex].title}
                </h4>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                  {news[currentIndex].excerpt}
                </p>
                <div className="mt-auto">
                  <button className="bg-petrol text-white px-8 py-4 rounded-sm font-bold text-sm uppercase tracking-widest flex items-center hover:bg-accent hover:text-petrol-dark transition-all group">
                    Lire l'article complet <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-12 gap-3">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-accent w-8' : 'bg-petrol/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
