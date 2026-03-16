import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Hero() {
  const [content, setContent] = useState<any>({
    title: "L'Excellence dans la Construction. Partout en RDC.",
    subtitle: "EDCMIZ SARL - BTP & GÉNIE CIVIL",
    description: "Spécialiste en construction générale, adduction d'eau et solutions d'ingénierie moderne. Nous bâtissons l'avenir de la République Démocratique du Congo avec rigueur et expertise.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80",
    ctaText: "Démarrer un Projet",
    ctaLink: "https://wa.me/243829002360"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'content/site';
    const unsubscribe = onSnapshot(doc(db, 'content', 'site'), (doc) => {
      if (doc.exists() && doc.data().hero) {
        setContent(doc.data().hero);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
    return () => unsubscribe();
  }, []);

  if (loading && !content) {
    return (
      <section className="h-screen bg-petrol-dark flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" size={48} />
      </section>
    );
  }

  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden bg-petrol-dark">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.imageUrl}
          alt="EDCMIZ Background"
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol-dark via-petrol-dark/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="max-w-3xl lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-accent font-bold uppercase tracking-[0.3em] mb-4 text-sm sm:text-base">
                {content.subtitle}
              </h2>
              <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight mb-8">
                {content.title.split('.').map((part: string, i: number) => (
                  <React.Fragment key={i}>
                    {part}{i === 0 && content.title.includes('.') && '.'}
                    {i === 0 && <br />}
                  </React.Fragment>
                ))}
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
                {content.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href={content.ctaLink || "https://wa.me/243829002360"}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: [1, 1.03, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-accent text-petrol-dark px-10 py-5 rounded-sm font-extrabold text-xl hover:bg-white hover:scale-105 transition-all flex items-center justify-center group shadow-[0_0_20px_rgba(212,161,62,0.4)]"
                >
                  {content.ctaText}
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
                </motion.a>
                <a
                  href="#services"
                  className="border-2 border-white/30 text-white px-10 py-5 rounded-sm font-bold text-lg hover:bg-white hover:text-petrol-dark transition-all text-center backdrop-blur-sm"
                >
                  Nos Services
                </a>
              </div>
            </motion.div>
          </div>

          {/* 3D Floating Element */}
          <div className="hidden lg:block lg:w-1/3 relative">
            <motion.div
              initial={{ opacity: 0, rotateY: 45, translateZ: -100 }}
              animate={{ 
                opacity: 1, 
                rotateY: 0, 
                translateZ: 0,
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 4,
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10"
            >
              <div className="w-64 h-64 bg-accent/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center p-8 transform rotate-12 shadow-2xl">
                <div className="text-center">
                  <p className="text-white text-4xl font-black mb-2">6+</p>
                  <p className="text-accent text-xs font-bold uppercase tracking-widest">Années d'Expérience</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center transform -rotate-12">
                <div className="text-center">
                  <p className="text-white text-xl font-bold">100%</p>
                  <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">Qualité</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Diamond Shape */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[500px] bg-accent/10 diamond-clip hidden lg:block" />
      <div className="absolute right-[5%] top-[15%] w-[300px] h-[300px] bg-white/5 diamond-clip hidden lg:block animate-pulse" />
    </section>
  );
}
