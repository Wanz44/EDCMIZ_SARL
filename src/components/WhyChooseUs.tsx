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
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Polygonal background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-petrol/5 polygon-clip -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-accent font-bold uppercase tracking-widest mb-2">{content.title}</h2>
            <h3 className="text-4xl font-black text-petrol-dark mb-6">{content.subtitle}</h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {content.description}
            </p>
            
            <div className="space-y-6 mb-10">
              {content.reasons.map((reason: any, index: number) => {
                const IconComponent = iconMap[reason.icon] || CheckCircle2;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start p-4 bg-white rounded-sm shadow-sm border-l-4 border-accent"
                  >
                    <div className="bg-petrol/10 p-3 rounded-sm mr-4 text-petrol">
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-petrol-dark mb-1">{reason.title}</h4>
                      <p className="text-sm text-slate-500">{reason.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              {content.stats.map((stat: any, index: number) => (
                <div key={index}>
                  <p className="text-2xl font-black text-accent">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl">
              <img 
                src={content.imageUrl} 
                alt="Travaux de construction EDCMIZ"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative diamond */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent diamond-clip -z-10 opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
