import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Droplets, 
  Route, 
  Building2, 
  Sprout, 
  Cloud, 
  Database, 
  Network,
  Code,
  CheckCircle2,
  Server,
  Cpu,
  BarChart3,
  PieChart,
  Search,
  ShieldCheck,
  Lock,
  Globe,
  Smartphone,
  Monitor,
  Hammer,
  Paintbrush,
  ClipboardList,
  HardHat,
  ChevronRight,
  FileSearch,
  Layout,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const iconMap: Record<string, any> = {
  Droplets, Route, Building2, Sprout, Cloud, Database, Network, Code,
  Server, Cpu, BarChart3, PieChart, Search, ShieldCheck, Lock, Globe,
  Smartphone, Monitor, Hammer, Paintbrush, ClipboardList, HardHat,
  FileSearch, Layout, Settings, ShieldAlert
};

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesData);
    });
    return () => unsub();
  }, []);

  const btpServices = services.filter(s => s.category === 'BTP');
  const digitalServices = services.filter(s => s.category === 'Digital');

  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 bg-petrol/10 text-petrol text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Nos Expertises
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-petrol-dark leading-[1.1] tracking-tighter">
              Une Dualité de <span className="text-accent">Compétences</span>
            </h2>
          </div>
          <p className="text-slate-500 text-lg max-w-md font-medium leading-relaxed">
            Nous combinons expertise technique en BTP et innovation digitale pour des solutions complètes et durables.
          </p>
        </div>

        {/* BTP Section */}
        <div className="mb-32">
          <div className="flex items-center mb-12 group">
            <div className="w-14 h-14 bg-petrol-dark text-accent rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <Building2 size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-petrol-dark uppercase tracking-tight">Pôle BTP & Ingénierie</h4>
              <div className="w-12 h-1 bg-accent mt-1" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {btpServices.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Building2;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={service.image || "https://images.unsplash.com/photo-1503387762-592dee58c160?auto=format&fit=crop&q=80&w=800"} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark/80 via-petrol-dark/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-white border border-white/20">
                        <IconComponent size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h5 className="text-xl font-black text-petrol-dark mb-4 group-hover:text-accent transition-colors duration-300">{service.title}</h5>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Digital Section */}
        <div className="bg-petrol-dark rounded-[3rem] p-8 sm:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-petrol/20 rounded-full blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <div className="flex items-center mb-16 group">
              <div className="w-14 h-14 bg-accent text-petrol-dark rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:-rotate-12 transition-transform duration-500">
                <Cloud size={28} />
              </div>
              <h4 className="text-3xl font-black text-white uppercase tracking-tight">Pôle Solutions Digitales</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {digitalServices.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Cloud;
                return (
                  <motion.div 
                    key={service.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl p-10 border border-white/10 transition-all duration-500 rounded-[2rem] hover:bg-white/10 hover:border-accent/30 group"
                  >
                    <div className="w-16 h-16 bg-accent text-petrol-dark rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <IconComponent size={32} />
                    </div>
                    <h5 className="text-2xl font-black text-white mb-6 leading-tight group-hover:text-accent transition-colors">{service.title}</h5>
                    
                    <ul className="space-y-4">
                      {service.features?.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start text-xs text-white/60 font-medium group-hover:text-white/80 transition-colors">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Work Process Section */}
      <div className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Méthodologie
            </div>
            <h3 className="text-4xl sm:text-6xl font-black text-petrol-dark tracking-tighter">Notre Processus de Réalisation</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { step: "01", title: "Étude & Analyse", icon: FileSearch, desc: "Analyse approfondie des besoins, études de faisabilité et conception technique." },
              { step: "02", title: "Planification", icon: Layout, desc: "Établissement du planning, mobilisation des ressources et logistique." },
              { step: "03", title: "Exécution", icon: Settings, desc: "Mise en œuvre rigoureuse sur le terrain avec surveillance constante." },
              { step: "04", title: "Livraison & Suivi", icon: ShieldAlert, desc: "Contrôle qualité final, remise des clés et maintenance préventive." }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10 bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 group"
              >
                <div className="w-20 h-20 bg-petrol-dark text-accent rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                  <item.icon size={36} />
                </div>
                <span className="text-7xl font-black text-slate-50 absolute top-6 right-6 group-hover:text-accent/10 transition-colors duration-500">{item.step}</span>
                <h5 className="text-2xl font-black text-petrol-dark mb-4 tracking-tight">{item.title}</h5>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                <div className="mt-8 flex items-center text-accent font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Détails du processus <ChevronRight size={14} className="ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
