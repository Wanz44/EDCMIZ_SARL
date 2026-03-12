import React from 'react';
import { motion } from 'motion/react';
import { Cpu, BarChart3, Cloud, Construction, Zap, ShieldCheck } from 'lucide-react';

const reasons = [
  {
    icon: Cloud,
    title: "Suivi Cloud & Reporting",
    description: "Accédez à un tableau de bord en temps réel pour suivre l'avancement de vos travaux, les rapports journaliers et la consommation des ressources via notre plateforme cloud sécurisée."
  },
  {
    icon: BarChart3,
    title: "Analyse Prédictive des Coûts",
    description: "Grâce à l'analyse de données historiques, nous optimisons l'approvisionnement en matériaux, réduisant les gaspillages de 15% et garantissant le respect strict de votre budget."
  },
  {
    icon: Cpu,
    title: "Ingénierie Assistée par IA",
    description: "Nous utilisons des algorithmes d'optimisation pour concevoir des structures plus résistantes avec moins de matériaux, alliant durabilité écologique et économie financière."
  },
  {
    icon: ShieldCheck,
    title: "Sécurité & Transparence",
    description: "La traçabilité numérique de chaque étape du chantier garantit une transparence totale et une conformité rigoureuse aux normes de sécurité internationales."
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
            <h3 className="text-4xl font-black text-petrol-dark mb-6">La Synergie Unique <br /><span className="text-petrol">BTP + Digital</span></h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              EDCMIZ sarl n'est pas une entreprise de construction ordinaire. Nous sommes des pionniers de l'ingénierie moderne en RDC, fusionnant l'expertise du bâtiment avec la puissance du numérique.
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
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" 
                alt="Ingénieur utilisant une tablette sur un chantier"
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
