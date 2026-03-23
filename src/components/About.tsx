import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Users, Target, Loader2 } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function About() {
  const [content, setContent] = useState<any>({
    title: "Bâtir avec Rigueur, Innover avec Passion",
    description: "Depuis sa création, EDCMIZ sarl s'est imposée comme un acteur majeur du BTP en République Démocratique du Congo. Notre mission est de transformer les défis techniques en réalisations durables, en alliant savoir-faire traditionnel et technologies de pointe.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    experienceYears: "6+"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'content/site';
    const unsubscribe = onSnapshot(doc(db, 'content', 'site'), (doc) => {
      if (doc.exists() && doc.data().about) {
        setContent(doc.data().about);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
    return () => unsubscribe();
  }, []);

  if (loading && !content) {
    return (
      <section className="py-24 bg-white flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" size={48} />
      </section>
    );
  }

  const stats = [
    { label: 'Projets Réalisés', value: '50+' },
    { label: 'D\'Expérience', value: content.experienceYears || '6+' },
    { label: 'Experts Qualifiés', value: 'Plusieurs' },
    { label: 'Clients Satisfaits', value: '100%' },
  ];

  return (
    <section id="about" className="py-32 bg-slate-50 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-petrol/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] aspect-[4/5]">
              <img 
                src={content.imageUrl} 
                alt="EDCMIZ Team" 
                className="w-full h-full object-cover transition-all duration-1000 hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark/60 to-transparent" />
            </div>
            
            {/* Floating Experience Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 -right-10 bg-white p-10 shadow-2xl rounded-3xl z-20 hidden md:block border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-4 rounded-2xl text-accent">
                  <Users size={32} />
                </div>
                <div>
                  <p className="text-petrol-dark font-black text-5xl leading-none">{content.experienceYears}</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Ans d'Expertise</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative Dots */}
            <div className="absolute -top-10 -left-10 grid grid-cols-6 gap-2 opacity-20">
              {[...Array(36)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-petrol rounded-full" />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Notre Histoire
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-petrol-dark mb-8 leading-[1.1] tracking-tighter">
              {content.title}
            </h2>
            <p className="text-slate-500 text-lg sm:text-xl mb-12 leading-relaxed font-medium">
              {content.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
              {[
                { icon: Shield, title: "Qualité Certifiée", desc: "Normes internationales" },
                { icon: Zap, title: "Exécution Rapide", desc: "Respect des délais" },
                { icon: Users, title: "Équipe d'Experts", desc: "Ingénieurs qualifiés" },
                { icon: Target, title: "Vision Moderne", desc: "Innovation continue" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="bg-white p-4 rounded-2xl text-petrol shadow-sm group-hover:bg-accent group-hover:text-petrol-dark transition-colors duration-300">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-petrol-dark uppercase text-xs tracking-widest mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-xs font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 pt-12 border-t border-slate-200">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-3xl font-black text-petrol-dark tracking-tighter">{stat.value}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
