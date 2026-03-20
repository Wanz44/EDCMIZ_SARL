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
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-petrol font-bold uppercase tracking-widest mb-2">Nos Expertises</h2>
          <h3 className="text-4xl sm:text-5xl font-black text-petrol-dark">Une Dualité de Compétences</h3>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-6" />
        </div>

        {/* BTP Section */}
        <div className="mb-24">
          <div className="flex items-center mb-12">
            <div className="w-12 h-12 bg-petrol diamond-clip flex items-center justify-center text-white mr-4">
              <Building2 size={24} />
            </div>
            <h4 className="text-2xl font-bold text-petrol-dark uppercase tracking-tight">Pôle BTP & Ingénierie</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 [perspective:1000px]">
            {btpServices.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Building2;
              return (
                <motion.div
                  key={service.id}
                  whileHover={{ 
                    y: -10,
                    rotateX: 5,
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  className="bg-white rounded-sm shadow-xl overflow-hidden group border-b-4 border-transparent hover:border-accent transition-all service-card-decoration relative transform-gpu"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={service.image || "https://images.unsplash.com/photo-1503387762-592dee58c160?auto=format&fit=crop&q=80&w=800"} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-petrol/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="p-6">
                    <div className="w-14 h-14 bg-petrol text-white polygon-clip flex items-center justify-center mb-4 group-hover:rotate-[360deg] transition-transform duration-700">
                      <IconComponent size={24} />
                    </div>
                    <h5 className="text-xl font-bold text-petrol-dark mb-2">{service.title}</h5>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Digital Section */}
        <div className="bg-petrol-dark rounded-2xl p-8 sm:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 diamond-clip -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-center mb-12">
              <div className="w-12 h-12 bg-accent diamond-clip flex items-center justify-center text-petrol-dark mr-4">
                <Cloud size={24} />
              </div>
              <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Pôle Solutions Digitales</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 [perspective:1000px]">
              {digitalServices.map((service) => {
                const IconComponent = iconMap[service.icon] || Cloud;
                return (
                  <motion.div 
                    key={service.id} 
                    whileHover={{ 
                      y: -8,
                      rotateX: -5,
                      rotateY: 5,
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      borderColor: "rgba(212, 161, 62, 0.4)"
                    }}
                    className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 transition-all rounded-sm service-card-decoration relative cursor-default group transform-gpu"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-accent text-petrol-dark polygon-clip flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent size={28} />
                      </div>
                      <h5 className="text-xl font-bold text-white leading-tight">{service.title}</h5>
                    </div>
                    
                    <div className="flex gap-4 mb-8">
                      {service.features?.slice(0, 3).map((feature: string, idx: number) => (
                        <div key={idx} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-accent/80 hover:bg-accent hover:text-petrol-dark transition-colors">
                          <CheckCircle2 size={20} />
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-2">
                      {service.features?.map((item: string) => (
                        <li key={item} className="flex items-center text-xs text-accent/80">
                          <CheckCircle2 size={14} className="mr-2" />
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
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Notre Méthodologie</h2>
            <h3 className="text-4xl font-black text-petrol-dark">Comment nous réalisons vos travaux</h3>
            <div className="w-24 h-1.5 bg-accent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            
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
                className="relative z-10 bg-white p-8 rounded-sm border border-slate-100 shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="w-16 h-16 bg-petrol-dark text-accent diamond-clip flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon size={32} />
                </div>
                <span className="text-5xl font-black text-slate-100 absolute top-4 right-4 group-hover:text-accent/20 transition-colors">{item.step}</span>
                <h5 className="text-xl font-bold text-petrol-dark mb-4">{item.title}</h5>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-6 flex items-center text-accent font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  En savoir plus <ChevronRight size={14} className="ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
