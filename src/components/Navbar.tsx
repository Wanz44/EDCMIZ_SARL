import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navLinks = [
  { name: 'Accueil', href: '#home' },
  { name: 'À Propos', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projets', href: '#projects' },
  { name: 'Actualités', href: '#news' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
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
          'fixed w-full z-50 transition-all duration-300',
          scrolled ? 'bg-petrol-dark shadow-lg py-2' : 'bg-petrol py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-white tracking-tighter">
                  EDC<span className="text-accent">MIZ</span>
                </span>
                <span className="text-[8px] text-white/80 uppercase font-bold tracking-[0.2em] -mt-1">
                  Construction & Digital
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-accent font-medium transition-colors uppercase text-sm tracking-widest"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                className="bg-accent text-petrol-dark px-6 py-2 rounded-sm font-bold hover:bg-white transition-colors uppercase text-sm shadow-lg"
              >
                Devis Gratuit
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            'md:hidden bg-petrol-dark transition-all duration-300 overflow-hidden',
            isOpen ? 'max-h-[500px] py-4' : 'max-h-0'
          )}
        >
          <div className="px-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-accent font-medium uppercase text-sm tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block bg-accent text-petrol-dark px-6 py-3 rounded-sm font-bold text-center uppercase text-sm"
            >
              Devis Gratuit
            </a>
          </div>
        </div>
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
