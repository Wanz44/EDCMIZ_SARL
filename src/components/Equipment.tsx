import React from 'react';
import { motion } from 'motion/react';
import { Truck, HardHat, Ruler, Server, Database, Shield, Droplets, Smartphone, Lock } from 'lucide-react';

const equipment = [
  {
    category: "Génie Civil & BTP",
    items: [
      { name: "Parc d'engins lourds", icon: Truck, detail: "Bulldozers D8, excavatrices 30T et chargeuses articulées." },
      { name: "Matériel de Forage", icon: Droplets, detail: "Foreuses hydrauliques pour puits artésiens et études de sol." },
      { name: "Topographie Laser", icon: Ruler, detail: "Stations totales Leica et drones RTK pour relevés millimétriques." },
      { name: "Sécurité & HSE", icon: Shield, detail: "Équipements de protection certifiés et balisage de chantier haute visibilité." }
    ]
  },
  {
    category: "Infrastructure Digitale",
    items: [
      { name: "Serveurs Enterprise", icon: Server, detail: "Clusters haute disponibilité et stockage SAN redondant." },
      { name: "Laboratoire Réseau", icon: Database, detail: "Bancs de test pour fibre optique et équipements Cisco/Ubiquiti." },
      { name: "Unités Mobiles", icon: Smartphone, detail: "Kits de connectivité satellite pour chantiers en zones reculées." },
      { name: "Sécurité Cyber", icon: Lock, detail: "Firewalls physiques et solutions de chiffrement de bout en bout." }
    ]
  }
];

export default function Equipment() {
  return (
    <section className="py-32 bg-petrol-dark text-white overflow-hidden relative">
      {/* Technical Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-petrol-dark via-transparent to-petrol-dark" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
            Nos Moyens Logistiques
          </div>
          <h2 className="text-5xl sm:text-7xl font-black leading-[1] tracking-tighter mb-8">
            Équipements & <span className="text-accent">Technologie</span>
          </h2>
          <p className="text-white/50 text-xl font-medium leading-relaxed max-w-3xl mx-auto">
            Nous investissons massivement dans notre propre matériel pour garantir une autonomie totale et une réactivité maximale sur tous nos chantiers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {equipment.map((group, gIndex) => (
            <div key={group.category} className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/30" />
                <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.4em] whitespace-nowrap">
                  {group.category}
                </h4>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/30" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {group.items.map((item, iIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: iIndex * 0.1, duration: 0.5 }}
                    className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-start relative z-10">
                      <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-petrol-dark mr-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                        <item.icon size={32} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-black text-xl tracking-tight group-hover:text-accent transition-colors duration-300">
                            {item.name}
                          </h5>
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            0{iIndex + 1}
                          </div>
                        </div>
                        <p className="text-base text-white/40 font-medium leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                    
                    {/* Bottom Status Bar */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Opérationnel</span>
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-accent transition-colors">
                        Détails Techniques
                      </div>
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
