import React from 'react';
import { motion } from 'motion/react';
import { Truck, HardHat, Ruler, Server, Database, Shield } from 'lucide-react';

const equipment = [
  {
    category: "Génie Civil & BTP",
    items: [
      { name: "Parc d'engins lourds", icon: Truck, detail: "Bulldozers, excavatrices et chargeuses de dernière génération." },
      { name: "Outils de topographie", icon: Ruler, detail: "Stations totales et drones pour relevés de précision." },
      { name: "Équipements de sécurité", icon: Shield, detail: "Protection individuelle et collective aux normes ISO." }
    ]
  },
  {
    category: "Infrastructure Digitale",
    items: [
      { name: "Serveurs Haute Performance", icon: Server, detail: "Infrastructures locales et cloud sécurisées." },
      { name: "Solutions de Stockage", icon: Database, detail: "Redondance des données et sauvegardes automatisées." },
      { name: "Matériel Réseau", icon: HardHat, detail: "Équipements fibre optique et réseaux sans fil industriels." }
    ]
  }
];

export default function Equipment() {
  return (
    <section className="py-24 bg-petrol-dark text-white overflow-hidden relative">
      {/* Polygonal overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/5 polygon-clip -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Nos Moyens Logistiques</h2>
          <h3 className="text-4xl font-black">Équipements & Technologie</h3>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Nous investissons massivement dans notre propre matériel pour garantir une autonomie totale et une réactivité maximale sur tous nos chantiers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {equipment.map((group, gIndex) => (
            <div key={group.category}>
              <h4 className="text-xl font-bold text-accent mb-8 flex items-center">
                <span className="w-8 h-1 bg-accent mr-4" />
                {group.category}
              </h4>
              <div className="space-y-6">
                {group.items.map((item, iIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: gIndex === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: iIndex * 0.1 }}
                    className="flex items-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm hover:bg-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 bg-accent text-petrol-dark polygon-clip flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-1">{item.name}</h5>
                      <p className="text-sm text-white/50">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
