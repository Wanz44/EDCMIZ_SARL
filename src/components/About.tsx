import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Users, Target } from 'lucide-react';

const stats = [
  { label: 'Projets Réalisés', value: '150+' },
  { label: 'Années d\'Expérience', value: '12+' },
  { label: 'Experts Qualifiés', value: '45+' },
  { label: 'Clients Satisfaits', value: '100%' },
];

export default function About() {
  return (
    <section id="about" className="py-24 overflow-hidden">
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
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
                alt="Bâtiment moderne à Kinshasa"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent diamond-clip z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-petrol/10 diamond-clip z-0" />
            
            <div className="absolute bottom-6 left-6 bg-white p-6 shadow-xl rounded-sm z-20 hidden sm:block">
              <p className="text-petrol-dark font-black text-4xl">12+</p>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Ans d'Excellence</p>
            </div>
          </motion.div>

          <div>
            <h2 className="text-petrol font-bold uppercase tracking-widest mb-4">À Propos de Nous</h2>
            <h3 className="text-4xl font-black text-petrol-dark mb-6 leading-tight">
              Une société multidisciplinaire basée à la <span className="text-accent">Gombe</span>
            </h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              EDCMIZ sarl est une entreprise leader en République Démocratique du Congo, 
              spécialisée dans la construction, l'ingénierie civile et les solutions numériques. 
              Notre approche repose sur une surveillance rigoureuse des travaux et une innovation constante.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-start value-item"
              >
                <div className="bg-petrol/10 p-3 rounded-sm mr-4">
                  <Shield className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-petrol-dark">Rigueur & Qualité</h4>
                  <p className="text-sm text-slate-500">Standards internationaux appliqués à chaque projet.</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-start value-item"
              >
                <div className="bg-petrol/10 p-3 rounded-sm mr-4">
                  <Zap className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-petrol-dark">Innovation</h4>
                  <p className="text-sm text-slate-500">Utilisation des dernières technologies BTP et Digital.</p>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-petrol">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
