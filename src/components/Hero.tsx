import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden bg-petrol-dark">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2070"
          alt="Chantier de construction moderne"
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol-dark via-petrol-dark/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-accent font-bold uppercase tracking-[0.3em] mb-4 text-sm sm:text-base">
              Entreprise de Construction MIZAKU SARL
            </h2>
            <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight mb-8">
              Bâtir l'avenir, <br />
              <span className="text-accent">Connecter</span> les infrastructures.
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
              Expertise multidisciplinaire en BTP, Ingénierie et Solutions Digitales. 
              Nous transformons vos visions en réalités durables avec rigueur et innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#contact"
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.03, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-accent text-petrol-dark px-10 py-5 rounded-sm font-extrabold text-xl hover:bg-white hover:scale-105 transition-all flex items-center justify-center group shadow-[0_0_20px_rgba(212,161,62,0.4)]"
              >
                Demander un devis gratuit
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
              </motion.a>
              <a
                href="#services"
                className="border-2 border-white/30 text-white px-10 py-5 rounded-sm font-bold text-lg hover:bg-white hover:text-petrol-dark transition-all text-center backdrop-blur-sm"
              >
                Nos Services
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Diamond Shape */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[500px] bg-accent/10 diamond-clip hidden lg:block" />
      <div className="absolute right-[5%] top-[15%] w-[300px] h-[300px] bg-white/5 diamond-clip hidden lg:block animate-pulse" />
    </section>
  );
}
