import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Plus, MapPin, Calendar, Clock } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Réfection Boulevard du 30 Juin',
    category: 'BTP',
    location: 'Kinshasa, Gombe',
    duration: '12 mois',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
    description: 'Réfection complète de la voirie urbaine avec assainissement moderne et éclairage public solaire.'
  },
  {
    id: 2,
    title: "Adduction d'eau potable",
    category: 'BTP',
    location: 'Maluku, Kinshasa',
    duration: '8 mois',
    image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=800',
    description: "Forage industriel et réseau de distribution pour 15 000 habitants, incluant châteaux d'eau."
  },
  {
    id: 3,
    title: 'Rénovation Siège Social',
    category: 'BTP',
    location: 'Kinshasa, Gombe',
    duration: '5 mois',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    description: "Modernisation complète d'un immeuble de bureaux : façades, intérieur et domotique."
  },
  {
    id: 4,
    title: 'Étude Technique Pont Lualaba',
    category: 'BTP',
    location: 'Kolwezi, Lualaba',
    duration: '4 mois',
    image: 'https://images.unsplash.com/photo-1503387762-592dee58c160?auto=format&fit=crop&q=80&w=800',
    description: "Étude de faisabilité technique et plans d'ingénierie pour un pont de 120m."
  },
  {
    id: 5,
    title: 'Infrastructure Cloud Bancaire',
    category: 'Digital',
    location: 'Kinshasa, Gombe',
    duration: '6 mois',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    description: 'Migration cloud hybride sécurisée pour une institution financière internationale.'
  },
  {
    id: 6,
    title: 'Surveillance Chantier Immeuble R+10',
    category: 'BTP',
    location: 'Lubumbashi',
    duration: 'En cours',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800',
    description: "Supervision technique et contrôle qualité pour la construction d'un complexe résidentiel."
  }
];

const categories = ["Tous", "BTP", "Digital"];

export default function Projects() {
  const [filter, setFilter] = useState("Tous");

  const filteredProjects = filter === "Tous" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-32 bg-petrol-dark text-white relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
              Nos Réalisations
            </div>
            <h2 className="text-5xl sm:text-7xl font-black leading-[1] tracking-tighter mb-8">
              Projets <span className="text-accent">Phares</span> & Études de Cas
            </h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed">
              Découvrez comment nous transformons les défis complexes en infrastructures durables et solutions numériques à travers la RDC.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 bg-white/5 p-2 rounded-3xl backdrop-blur-xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-2xl ${
                  filter === cat 
                    ? "bg-accent text-petrol-dark shadow-xl scale-105" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group relative h-[550px] overflow-hidden rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] border border-white/5"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark via-petrol-dark/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="flex justify-between items-start mb-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="px-4 py-1.5 bg-accent text-petrol-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                      {project.category}
                    </div>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/60 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                      <Clock size={14} className="mr-2 text-accent" /> {project.duration}
                    </div>
                  </div>
                  
                  <h4 className="text-3xl md:text-4xl font-black mb-4 leading-[1.1] tracking-tighter translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {project.title}
                  </h4>
                  
                  <div className="flex items-center text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    <MapPin size={16} className="mr-3" /> {project.location}
                  </div>
                  
                  <p className="text-white/50 text-base font-medium mb-10 line-clamp-3 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-150">
                    {project.description}
                  </p>
                  
                  <div className="translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <button className="bg-white text-petrol-dark px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center hover:bg-accent transition-all duration-300 shadow-2xl active:scale-95">
                      <Plus size={18} className="mr-4" /> Étude de cas
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
