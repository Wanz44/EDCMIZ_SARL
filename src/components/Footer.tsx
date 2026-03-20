import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp, MessageCircle } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-petrol-dark text-white pt-32 pb-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-petrol rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          {/* Company Info */}
          <div className="space-y-10">
            <div className="flex items-center">
              <img 
                src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" 
                alt="EDCMIZ Logo" 
                className="h-20 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-white/50 text-base leading-relaxed font-medium">
              Votre partenaire de confiance pour des infrastructures solides et des solutions numériques innovantes en RDC.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/243829002360" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-2xl hover:bg-accent hover:text-petrol-dark transition-all duration-300 shadow-lg">
                <MessageCircle size={20} />
              </a>
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-2xl hover:bg-accent hover:text-petrol-dark transition-all duration-300 shadow-lg">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black mb-10 uppercase tracking-[0.3em] text-accent">Navigation</h4>
            <ul className="space-y-6">
              {['Accueil', 'Services', 'Projets', 'Contact', 'À Propos'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-white/40 hover:text-white transition-colors text-sm font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] font-black mb-10 uppercase tracking-[0.3em] text-accent">Nos Pôles</h4>
            <ul className="space-y-6">
              {['BTP & Ingénierie', 'Infrastructures Routières', 'Adduction d\'Eau', 'Solutions Cloud', 'Analyse de Données'].map((service) => (
                <li key={service}>
                  <span className="text-white/40 text-sm font-medium">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* QR Code & Contact */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-[10px] font-black mb-10 uppercase tracking-[0.3em] text-accent">Scan & Connect</h4>
            <div className="bg-white p-5 rounded-[2rem] mb-6 shadow-2xl">
              <img 
                src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/code_barre.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9jb2RlX2JhcnJlLnBuZyIsImlhdCI6MTc3MzMzMzUzNCwiZXhwIjoyMDg4NjkzNTM0fQ.V2eG6Ip_tyHTDdLmNFt-wEw7zcVYHSEMxFmQSmLhTls" 
                alt="QR Code EDCMIZ" 
                className="w-32 h-32 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.2em] text-center lg:text-left">
              Scannez pour nos coordonnées
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} EDCMIZ sarl. Tous droits réservés.
          </p>
          <div className="flex space-x-10 text-[10px] font-black uppercase tracking-widest text-white/30">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
          <button 
            onClick={scrollToTop}
            className="bg-accent text-petrol-dark p-4 rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl active:scale-90"
          >
            <ArrowUp size={24} />
          </button>
        </div>
      </div>
    </footer>
  );
}
