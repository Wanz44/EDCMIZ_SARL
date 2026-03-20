import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Clock, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const iconMap: Record<string, any> = {
  Clock,
  Award,
  BarChart3,
  ShieldCheck,
  CheckCircle2
};

export default function WhyChooseUs() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'site'), (doc) => {
      if (doc.exists()) {
        setContent(doc.data().why);
      }
    });
    return () => unsub();
  }, []);

  if (!content) return null;

  return (
    <section className="py-32 bg-petrol-dark relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-petrol/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
              {content.title}
            </div>
            <h2 className="text-4xl sm:text-7xl font-black text-white mb-10 leading-[1.1] tracking-tighter">
              {content.subtitle}
            </h2>
            <p className="text-white/60 text-lg sm:text-xl mb-16 leading-relaxed font-medium max-w-xl">
              {content.description}
            </p>

            <div className="space-y-8">
              {content.reasons.map((reason: any, index: number) => {
                const IconComponent = iconMap[reason.icon] || CheckCircle2;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-start gap-8 p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/30 transition-all duration-500"
                  >
                    <div className="w-16 h-16 bg-accent text-petrol-dark rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                      <IconComponent size={32} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-accent transition-colors">{reason.title}</h4>
                      <p className="text-white/50 leading-relaxed font-medium group-hover:text-white/70 transition-colors">{reason.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-12 pt-16 border-t border-white/10 mt-16">
              {content.stats.map((stat: any, index: number) => (
                <div key={index} className="text-center sm:text-left">
                  <p className="text-4xl font-black text-accent tracking-tighter">{stat.value}</p>
                  <p className="text-[9px] text-white/40 uppercase font-black tracking-[0.2em] mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] aspect-[4/5]">
              <img 
                src={content.imageUrl} 
                alt="Travaux de construction EDCMIZ" 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Achievement Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-12 -left-12 bg-accent p-10 rounded-[2.5rem] shadow-2xl z-20 hidden md:block"
            >
              <div className="flex items-center gap-6">
                <div className="bg-petrol-dark/10 p-4 rounded-2xl text-petrol-dark">
                  <Award size={40} />
                </div>
                <div>
                  <p className="text-petrol-dark font-black text-5xl leading-none">100%</p>
                  <p className="text-petrol-dark/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Engagement Qualité</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 -right-12 w-24 h-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl rotate-12 z-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
