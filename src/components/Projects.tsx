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
                    <span className="text-[10px] bg-white/20 px-2 py-1 rounded-sm uppercase font-bold flex items-center">
                      <Clock size={10} className="mr-1" /> {project.duration}
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-2 leading-tight">{project.title}</h4>
                  <p className="text-accent/80 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
                    <MapPin size={14} className="mr-2" /> {project.location}
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
