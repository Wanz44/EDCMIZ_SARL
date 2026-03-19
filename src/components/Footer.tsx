import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp, MessageCircle } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-petrol-dark text-white pt-20 pb-10 relative overflow-hidden">
      {/* Decorative Diamond */}
      <div className="absolute left-[-5%] top-[-10%] w-64 h-64 bg-white/5 diamond-clip pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img 
                src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" 
                alt="EDCMIZ Logo" 
                className="h-48 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Votre partenaire de confiance pour des infrastructures solides et des solutions numériques innovantes en RDC.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/243829002360" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full hover:bg-accent hover:text-petrol-dark transition-all">
                <MessageCircle size={18} />
              </a>
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full hover:bg-accent hover:text-petrol-dark transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-accent">Navigation</h4>
            <ul className="space-y-4">
              {['Accueil', 'Services', 'Projets', 'Contact', 'À Propos'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-accent">Nos Pôles</h4>
            <ul className="space-y-4">
              {['BTP & Ingénierie', 'Infrastructures Routières', 'Adduction d\'Eau', 'Solutions Cloud', 'Analyse de Données'].map((service) => (
                <li key={service}>
                  <span className="text-white/60 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* QR Code & Contact */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-accent">Scan & Connect</h4>
            <div className="bg-white p-3 rounded-lg mb-4">
              <img 
                src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/code_barre.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9jb2RlX2JhcnJlLnBuZyIsImlhdCI6MTc3MzMzMzUzNCwiZXhwIjoyMDg4NjkzNTM0fQ.V2eG6Ip_tyHTDdLmNFt-wEw7zcVYHSEMxFmQSmLhTls" 
                alt="QR Code EDCMIZ" 
                className="w-32 h-32 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest text-center lg:text-left">
              Scannez pour nos coordonnées
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} EDCMIZ sarl. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-xs text-white/40">
            <a href="#" className="hover:text-white">Mentions Légales</a>
            <a href="#" className="hover:text-white">Confidentialité</a>
          </div>
          <button 
            onClick={scrollToTop}
            className="bg-accent text-petrol-dark p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}
