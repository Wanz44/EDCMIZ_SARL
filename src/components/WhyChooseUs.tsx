import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Clock, Award, ShieldCheck } from 'lucide-react';

const reasons = [
  {
    icon: Clock,
    title: "Respect des Délais",
    description: "La ponctualité est au cœur de notre engagement. Nous mettons en œuvre une planification rigoureuse pour garantir la livraison de vos projets dans les temps convenus."
  },
  {
    icon: Award,
    title: "Expertise Technique Certifiée",
    description: "Nos équipes sont composées d'ingénieurs et de techniciens hautement qualifiés, assurant des constructions robustes conformes aux normes internationales."
  },
  {
    icon: BarChart3,
    title: "Optimisation des Budgets",
    description: "Nous maximisons l'efficacité de vos investissements en optimisant l'utilisation des matériaux et des ressources pour un rapport qualité-prix inégalé."
  }
];

export default function WhyChooseUs() {
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
            <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Pourquoi nous choisir ?</h2>
            <h3 className="text-4xl font-black text-petrol-dark mb-6">Une Expertise Reconnue <br /><span className="text-petrol">dans le BTP & l'Ingénierie</span></h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              EDCMIZ sarl est une entreprise de construction de référence en RDC. Nous sommes des pionniers de l'ingénierie moderne, mettant notre savoir-faire au service de projets d'envergure avec une rigueur et une qualité inégalées.
            </p>
            
            <div className="space-y-6 mb-10">
              {reasons.map((reason, index) => (
                <motion.div 
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start p-4 bg-white rounded-sm shadow-sm border-l-4 border-accent"
                >
                  <div className="bg-petrol/10 p-3 rounded-sm mr-4 text-petrol">
                    <reason.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-petrol-dark mb-1">{reason.title}</h4>
                    <p className="text-sm text-slate-500">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div>
                <p className="text-2xl font-black text-accent">-20%</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Coûts de matériaux</p>
              </div>
              <div>
                <p className="text-2xl font-black text-accent">+35%</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Vitesse d'exécution</p>
              </div>
              <div>
                <p className="text-2xl font-black text-accent">100%</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Transparence</p>
              </div>
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
                src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/images_traveau.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9pbWFnZXNfdHJhdmVhdS5wbmciLCJpYXQiOjE3NzMzMzY5MDQsImV4cCI6MjA4ODY5NjkwNH0.w8sWBaxjN5at8k9OM1J0JHRTo4P44I55Y1QG6ZgVcWc" 
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
