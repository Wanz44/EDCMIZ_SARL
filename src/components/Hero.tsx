import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Hero() {
  const [content, setContent] = useState<any>({
    hero: {
      title: "L'Excellence dans la Construction. Partout en RDC.",
      subtitle: "EDCMIZ SARL - BTP & GÉNIE CIVIL",
      description: "Spécialiste en construction générale, adduction d'eau et solutions d'ingénierie moderne. Nous bâtissons l'avenir de la République Démocratique du Congo avec rigueur et expertise.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80",
      ctaText: "Démarrer un Projet",
      ctaLink: "https://wa.me/243829002360"
    },
    about: {
      experienceYears: "6+"
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'content/site';
    const unsubscribe = onSnapshot(doc(db, 'content', 'site'), (doc) => {
      if (doc.exists()) {
        setContent(doc.data());
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

  const heroContent = content.hero || {};
  const aboutContent = content.about || {};

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-petrol-dark pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src={heroContent.imageUrl}
          alt="EDCMIZ Background"
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-petrol-dark/80 via-transparent to-petrol-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol-dark via-petrol-dark/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 backdrop-blur-md border border-accent/20 rounded-full mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                  {heroContent.subtitle}
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                {heroContent.title?.split('.').map((part: string, i: number) => (
                  <React.Fragment key={i}>
                    <span className={i === 0 ? "text-white" : "text-accent"}>
                      {part}{i === 0 && heroContent.title.includes('.') && '.'}
                    </span>
                    {i === 0 && <br className="hidden sm:block" />}
                  </React.Fragment>
                ))}
              </h1>

              <p className="text-lg sm:text-xl text-white/70 mb-12 leading-relaxed max-w-2xl font-medium">
                {heroContent.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <motion.a
                  href={heroContent.ctaLink || "https://wa.me/243829002360"}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-accent text-petrol-dark px-12 py-6 rounded-sm font-black text-xl hover:bg-white transition-all flex items-center justify-center group shadow-2xl shadow-accent/20"
                >
                  {heroContent.ctaText}
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
                </motion.a>
                <a
                  href="#services"
                  className="group relative px-12 py-6 rounded-sm font-bold text-lg text-white transition-all text-center flex items-center justify-center overflow-hidden"
                >
                  <span className="absolute inset-0 border-2 border-white/20 group-hover:border-white/50 transition-colors" />
                  <span className="relative z-10">Nos Services</span>
                  <motion.div 
                    className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Modern Floating Stats Card */}
          <div className="hidden lg:block lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-accent/30 blur-3xl rounded-full opacity-20 animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="space-y-8">
                  <div>
                    <p className="text-accent text-5xl font-black leading-none">{aboutContent.experienceYears || '6+'}</p>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2">Années d'Expérience</p>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div>
                    <p className="text-white text-4xl font-black leading-none">100%</p>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2">Satisfaction Client</p>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div>
                    <p className="text-white text-4xl font-black leading-none">50+</p>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2">Projets Réalisés</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">Découvrir</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
      </motion.div>
    </section>
  );
}
