import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Plus } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Construction route Gombe',
    category: 'BTP',
    location: 'Kinshasa, Gombe',
    duration: '6 mois',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
    description: 'Réfection complète de 5km de voirie urbaine avec assainissement moderne.'
  },
  {
    id: 2,
    title: "Réseau d'eau potable",
    category: 'BTP',
    location: 'Maluku, Kinshasa',
    duration: '4 mois',
    image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=800',
    description: "Adduction d'eau pour 10 000 habitants, incluant forage et châteaux d'eau."
  },
  {
    id: 3,
    title: 'Cloud Infrastructure',
    category: 'Digital',
    location: 'Kinshasa, Gombe',
    duration: '3 mois',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    description: 'Migration cloud hybride sécurisée pour une institution bancaire majeure.'
  },
  {
    id: 4,
    title: 'Immeuble R+5',
    category: 'BTP',
    location: 'Lubumbashi',
    duration: '18 mois',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    description: "Construction d'un immeuble de bureaux intelligent avec gestion technique centralisée."
  },
  {
    id: 5,
    title: 'Data Center',
    category: 'Digital',
    location: 'Kinshasa, Limete',
    duration: '8 mois',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
    description: "Installation d'un centre de données de haute disponibilité avec redondance énergétique."
  }
];

const categories = ["Tous", "BTP", "Digital"];

export default function Projects() {
  const [filter, setFilter] = useState("Tous");

  const filteredProjects = filter === "Tous" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-petrol-dark text-white relative overflow-hidden">
      {/* Polygonal background */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/5 polygon-clip -z-10 opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Nos Réalisations</h2>
            <h3 className="text-4xl font-black">Projets Phares & Études de Cas</h3>
            <p className="text-white/60 mt-4 max-w-xl">
              Découvrez comment nous transformons les défis en infrastructures durables à travers la RDC.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${
                  filter === cat 
                    ? "bg-accent text-petrol-dark" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative h-[450px] overflow-hidden rounded-sm shadow-2xl"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark via-petrol-dark/40 to-transparent opacity-90" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-accent text-xs font-bold uppercase tracking-widest">{project.category}</p>
                    <span className="text-[10px] bg-white/20 px-2 py-1 rounded-sm uppercase font-bold">{project.duration}</span>
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-2">{project.title}</h4>
                  <p className="text-accent/80 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
                    <ExternalLink size={14} className="mr-2" /> {project.location}
                  </p>
                  
                  <p className="text-white/70 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-accent text-petrol-dark px-6 py-2 rounded-sm font-bold uppercase text-xs tracking-widest flex items-center hover:bg-white transition-colors">
                      <Plus size={16} className="mr-2" /> Étude de cas
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
