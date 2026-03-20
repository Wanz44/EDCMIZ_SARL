import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MessageCircle, Home, Info, Briefcase, HardHat, LayoutGrid, Newspaper, Send, FileText, Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { name: 'Accueil', href: '#home', icon: Home },
  { name: 'À Propos', href: '#about', icon: Info },
  { name: 'Services', href: '#services', icon: Briefcase },
  { name: 'Projets', href: '#projects', icon: HardHat },
  { name: 'Vitrine', href: '#showcase', icon: LayoutGrid },
  { name: 'Actualités', href: '#news', icon: Newspaper },
  { name: 'Contact', href: '#contact', icon: Send },
];

interface NavbarProps {
  onOpenPortal: () => void;
}

export default function Navbar({ onOpenPortal }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'fixed w-full z-50 transition-all duration-500',
          scrolled ? 'py-2' : 'py-6'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex justify-between items-center px-6 py-3 rounded-full transition-all duration-500",
            scrolled 
              ? "bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5 border border-white/20" 
              : "bg-transparent"
          )}>
            <div className="flex items-center">
              <a href="#home" className="flex items-center group">
                <div className="relative">
                  <img 
                    src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" 
                    alt="EDCMIZ Logo" 
                    className={cn(
                      "transition-all duration-500",
                      scrolled ? "h-10" : "h-14"
                    )}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -inset-2 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all duration-300 group overflow-hidden",
                    scrolled ? "text-petrol-dark" : "text-white"
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                  <motion.div 
                    className="absolute inset-0 bg-accent/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
              
              <div className="w-px h-6 bg-current opacity-10 mx-4" />

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenPortal}
                  className={cn(
                    "p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group relative",
                    scrolled ? "bg-petrol-dark text-white" : "bg-white/10 text-white backdrop-blur-md border border-white/20"
                  )}
                  title="Portail Admin"
                >
                  <Lock size={16} />
                </button>
                <a
                  href="https://wa.me/243829002360?text=Bonjour%20EDCMIZ,%20je%20souhaite%20demander%20un%20devis%20pour%20mon%20projet."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all duration-300 shadow-xl hover:scale-105 active:scale-95",
                    scrolled ? "bg-accent text-petrol-dark" : "bg-white text-petrol-dark"
                  )}
                >
                  Devis Gratuit
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  scrolled ? "text-petrol-dark hover:bg-slate-100" : "text-white hover:bg-white/10"
                )}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-8 grid grid-cols-2 gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center p-4 bg-slate-50 rounded-sm text-petrol-dark hover:bg-accent hover:text-petrol-dark transition-all group"
                  >
                    <link.icon size={20} className="mr-3 text-accent group-hover:text-petrol-dark" />
                    <span className="uppercase text-xs font-bold tracking-widest">
                      {link.name}
                    </span>
                  </a>
                ))}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPortal();
                  }}
                  className="col-span-2 flex items-center justify-center border border-petrol-dark text-petrol-dark p-4 rounded-sm font-bold uppercase text-sm tracking-widest"
                >
                  <Lock size={20} className="mr-3" />
                  Portail Client
                </button>
                <a
                  href="https://wa.me/243829002360?text=Bonjour%20EDCMIZ,%20je%20souhaite%20demander%20un%20devis%20pour%20mon%20projet."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="col-span-2 flex items-center justify-center bg-accent text-petrol-dark p-4 rounded-sm font-black uppercase text-sm tracking-widest shadow-inner"
                >
                  <FileText size={20} className="mr-3" />
                  Devis Gratuit
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/243829002360"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        title="Contactez-nous sur WhatsApp"
      >
        <span className="absolute right-full mr-4 bg-white text-slate-800 px-4 py-2 rounded-sm text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Besoin d'aide ? WhatsApp
        </span>
        <MessageCircle size={32} />
      </a>
    </>
  );
}
