import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Jean-Paul Kabamba",
    role: "Directeur Technique, SNEL",
    text: "EDCMIZ a transformé notre approche de la maintenance des infrastructures. Leur suivi digital nous a permis de réduire les délais de 30%.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Marie-Claire Tshimanga",
    role: "Promotrice Immobilière",
    text: "Un professionnalisme rare à Kinshasa. La transparence sur les coûts et l'avancement des travaux via leur plateforme est un vrai plus.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  }
];

const partners = [
  { name: "EDC MIZ", logo: "https://picsum.photos/seed/edcmiz/200/100" },
  { name: "Gouvernement RDC", logo: "https://picsum.photos/seed/rdc/200/100" },
  { name: "Banque Centrale", logo: "https://picsum.photos/seed/bcc/200/100" },
  { name: "Regideso", logo: "https://picsum.photos/seed/regideso/200/100" },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Ils nous font confiance</h2>
          <h3 className="text-4xl font-black text-petrol-dark">Témoignages & Partenaires</h3>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-50 p-8 rounded-sm relative"
            >
              <Quote className="absolute top-6 right-6 text-petrol/10" size={48} />
              <p className="text-slate-600 italic mb-6 leading-relaxed relative z-10">
                "{t.text}"
              </p>
              <div className="flex items-center">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-accent"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-petrol-dark">{t.name}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all">
            {partners.map((p) => (
              <div key={p.name} className="flex justify-center">
                <img 
                  src={p.logo} 
                  alt={p.name} 
                  className="h-12 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
