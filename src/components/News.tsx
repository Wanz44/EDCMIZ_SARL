import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';

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
  }
];

export default function News() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Actualités</h2>
            <h3 className="text-4xl font-black text-petrol-dark">Dernières Nouvelles</h3>
          </div>
          <button className="text-petrol font-bold uppercase tracking-widest flex items-center hover:text-accent transition-colors">
            Voir tout le blog <ArrowRight className="ml-2" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-sm shadow-lg overflow-hidden group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-accent text-petrol-dark px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-slate-400 text-xs mb-3">
                  <Calendar size={14} className="mr-2" />
                  {item.date}
                </div>
                <h4 className="text-lg font-bold text-petrol-dark mb-3 group-hover:text-petrol transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {item.excerpt}
                </p>
                <button className="text-accent font-bold text-xs uppercase tracking-widest flex items-center group-hover:underline">
                  Lire la suite <ArrowRight className="ml-2" size={14} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
