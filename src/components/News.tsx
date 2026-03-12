import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const news = [
  {
    title: "Lancement du chantier d'adduction d'eau à Maluku",
    date: "10 Mars 2026",
    category: "BTP",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
    excerpt: "Un nouveau projet vital pour les populations locales débute cette semaine avec nos équipes d'ingénierie."
  },
  {
    title: "Migration Cloud réussie pour la Banque Centrale",
    date: "02 Mars 2026",
    category: "Digital",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    excerpt: "Nos experts IT ont finalisé la migration des infrastructures critiques vers un cloud hybride sécurisé."
  },
  {
    title: "Nouveaux engins de terrassement réceptionnés",
    date: "25 Février 2026",
    category: "Logistique",
    image: "https://images.unsplash.com/photo-1579154273154-e66328906137?auto=format&fit=crop&q=80&w=800",
    excerpt: "EDCMIZ renforce son parc matériel avec 5 nouveaux bulldozers pour accélérer les chantiers routiers."
  },
  {
    title: "Inauguration du nouveau siège social",
    date: "15 Février 2026",
    category: "Corporate",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    excerpt: "Un espace moderne et écologique pour accueillir nos collaborateurs et clients dans les meilleures conditions."
  },
  {
    title: "Partenariat stratégique pour l'énergie solaire",
    date: "05 Février 2026",
    category: "Énergie",
    image: "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=800",
    excerpt: "EDCMIZ s'allie à un leader mondial pour proposer des solutions d'énergie renouvelable en RDC."
  }
];

export default function News() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Actualités</h2>
            <h3 className="text-4xl font-black text-petrol-dark">Dernières Nouvelles</h3>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-petrol/20 flex items-center justify-center text-petrol hover:bg-petrol hover:text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-petrol/20 flex items-center justify-center text-petrol hover:bg-petrol hover:text-white transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="relative h-[500px] md:h-[450px]">
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
                  src={news[currentIndex].image} 
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
                  {news[currentIndex].date}
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
