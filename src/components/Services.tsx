import React from 'react';
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
  CheckCircle2
} from 'lucide-react';

const btpServices = [
  {
    title: "Adduction d'eau",
    description: "Solutions complètes pour l'approvisionnement et la distribution d'eau potable.",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Infrastructures Routières",
    description: "Construction et entretien de routes asphaltées et en terre battue.",
    icon: Route,
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Construction Générale",
    description: "Bâtiments résidentiels, commerciaux et industriels de haute qualité.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1503387762-592dee58c160?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Agriculture",
    description: "Aménagements hydro-agricoles et infrastructures pour le secteur rural.",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
  }
];

const digitalServices = [
  {
    title: "Cloud & Hosting",
    description: "Solutions d'hébergement sécurisées et évolutives pour vos entreprises.",
    icon: Cloud
  },
  {
    title: "Analyse de Données",
    description: "Transformation de vos données brutes en informations stratégiques.",
    icon: Database
  },
  {
    title: "Réseaux & Sécurité",
    description: "Conception et maintenance d'infrastructures réseau robustes.",
    icon: Network
  },
  {
    title: "Ingénierie Informatique",
    description: "Développement sur mesure d'applications Web, Mobiles et Desktop performantes.",
    icon: Code
  }
];

export default function Services() {
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
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {btpServices.map((service, index) => (
              <motion.div
                key={service.title}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="bg-white rounded-sm shadow-xl overflow-hidden group border-b-4 border-transparent hover:border-accent transition-all service-card-decoration relative"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-petrol/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="p-6">
                  <div className="w-14 h-14 bg-petrol text-white polygon-clip flex items-center justify-center mb-4">
                    <service.icon size={24} />
                  </div>
                  <h5 className="text-xl font-bold text-petrol-dark mb-2">{service.title}</h5>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {digitalServices.map((service) => (
                <motion.div 
                  key={service.title} 
                  whileHover={{ 
                    y: -8,
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    borderColor: "rgba(212, 161, 62, 0.4)"
                  }}
                  className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 transition-all rounded-sm service-card-decoration relative cursor-default"
                >
                  <div className="w-16 h-16 bg-accent text-petrol-dark polygon-clip flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <service.icon size={32} />
                  </div>
                  <h5 className="text-xl font-bold text-white mb-4">{service.title}</h5>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {['Performance', 'Sécurité', 'Innovation'].map((item) => (
                      <li key={item} className="flex items-center text-xs text-accent/80">
                        <CheckCircle2 size={14} className="mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
