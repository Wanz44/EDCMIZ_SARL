import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Users, Target, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const stats = [
  { label: 'Projets Réalisés', value: '50+' },
  { label: 'D\'Expérience', value: '6+' },
  { label: 'Experts Qualifiés', value: 'Plusieurs' },
  { label: 'Clients Satisfaits', value: '100%' },
];

export default function About() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'content', 'site'), (doc) => {
      if (doc.exists()) {
        setContent(doc.data().about);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!content) {
    return (
      <section className="py-24 bg-white flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" size={48} />
      </section>
    );
  }

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl">
              <img 
                src={content.imageUrl} 
                alt="EDCMIZ Team" 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent diamond-clip z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-petrol/10 diamond-clip z-0" />
            
            <div className="absolute bottom-6 left-6 bg-white p-6 shadow-xl rounded-sm z-20 hidden sm:block">
              <p className="text-petrol-dark font-black text-4xl">{content.experienceYears}</p>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Ans d'Expérience</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-accent font-bold uppercase tracking-widest mb-2">À Propos de Nous</h2>
            <h3 className="text-4xl font-black text-petrol-dark mb-6 leading-tight">
              {content.title}
            </h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {content.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="bg-petrol/5 p-3 rounded-sm text-petrol">
                  <Shield size={24} />
                </div>
                <span className="font-bold text-petrol-dark">Qualité Certifiée</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-petrol/5 p-3 rounded-sm text-petrol">
                  <Zap size={24} />
                </div>
                <span className="font-bold text-petrol-dark">Exécution Rapide</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-petrol/5 p-3 rounded-sm text-petrol">
                  <Users size={24} />
                </div>
                <span className="font-bold text-petrol-dark">Équipe d'Experts</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-petrol/5 p-3 rounded-sm text-petrol">
                  <Target size={24} />
                </div>
                <span className="font-bold text-petrol-dark">Vision Moderne</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-slate-100">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-petrol-dark">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
