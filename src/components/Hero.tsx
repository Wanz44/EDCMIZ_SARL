import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden bg-petrol-dark">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/Architecture/ABC03.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9BcmNoaXRlY3R1cmUvQUJDMDMuanBnIiwiaWF0IjoxNzczNDQwMTk0LCJleHAiOjIwODg4MDAxOTR9.B3nGI31ZEc9sWtFkRIco6Ee3EM5DkBftHKsm9uArwjY"
          alt="EDCMIZ Background"
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol-dark via-petrol-dark/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="max-w-3xl lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-accent font-bold uppercase tracking-[0.3em] mb-4 text-sm sm:text-base">
                Entreprise de Construction MIZAKU SARL
              </h2>
              <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight mb-8">
                L'Excellence en <br />
                <span className="text-accent">Construction</span> Générale.
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
                Spécialiste des travaux de bâtiment, génie civil et rénovation. 
                Nous bâtissons des structures solides et durables, adaptées à vos besoins les plus exigeants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="https://wa.me/243829002360?text=Bonjour%20EDCMIZ,%20je%20souhaite%20demander%20un%20devis%20pour%20mon%20projet."
                  target="_blank"
                  rel="noopener noreferrer"
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

          {/* 3D Floating Element */}
          <div className="hidden lg:block lg:w-1/3 relative">
            <motion.div
              initial={{ opacity: 0, rotateY: 45, translateZ: -100 }}
              animate={{ 
                opacity: 1, 
                rotateY: 0, 
                translateZ: 0,
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 4,
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10"
            >
              <div className="w-64 h-64 bg-accent/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center p-8 transform rotate-12 shadow-2xl">
                <div className="text-center">
                  <p className="text-white text-4xl font-black mb-2">3+</p>
                  <p className="text-accent text-xs font-bold uppercase tracking-widest">Années d'Expérience</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center transform -rotate-12">
                <div className="text-center">
                  <p className="text-white text-xl font-bold">100%</p>
                  <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">Qualité</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Diamond Shape */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[500px] bg-accent/10 diamond-clip hidden lg:block" />
      <div className="absolute right-[5%] top-[15%] w-[300px] h-[300px] bg-white/5 diamond-clip hidden lg:block animate-pulse" />
    </section>
  );
}
