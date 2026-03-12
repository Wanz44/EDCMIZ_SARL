import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Construction / BTP',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      alert('Veuillez remplir au moins votre nom et votre message');
      return;
    }
    
    const whatsappMessage = `Bonjour EDCMIZ,%0A%0A*Nouveau message de contact*%0A*Nom:* ${formData.name}%0A*Email:* ${formData.email || 'Non précisé'}%0A*Sujet:* ${formData.subject}%0A*Message:* ${formData.message}`;
    window.open(`https://wa.me/243829002360?text=${whatsappMessage}`, '_blank');
    
    setFormData({ name: '', email: '', subject: 'Construction / BTP', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Contactez-nous</h2>
          <h3 className="text-4xl font-black text-petrol-dark">Prêt à lancer votre projet ?</h3>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-sm shadow-md border-l-4 border-accent">
              <div className="flex items-start mb-8 info-item">
                <MapPin className="text-accent mr-4 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-petrol-dark uppercase text-sm tracking-widest mb-2">Notre Siège</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    3344 avenue des Aviateurs,<br />
                    Kinshasa/Gombe, RDC
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-8 info-item">
                <Phone className="text-accent mr-4 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-petrol-dark uppercase text-sm tracking-widest mb-2">WhatsApp / Tel</h4>
                  <p className="text-slate-600 text-sm">+243 829 002 360</p>
                </div>
              </div>
              <div className="flex items-start mb-8 info-item">
                <Mail className="text-accent mr-4 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-petrol-dark uppercase text-sm tracking-widest mb-2">Email</h4>
                  <p className="text-slate-600 text-sm">edcmiz2@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start info-item">
                <Clock className="text-accent mr-4 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-petrol-dark uppercase text-sm tracking-widest mb-2">Heures d'ouverture</h4>
                  <p className="text-slate-600 text-sm">Lun - Ven: 09h00 - 18h00</p>
                </div>
              </div>
            </div>

            {/* Google Maps Placeholder */}
            <div className="h-64 bg-slate-200 rounded-sm overflow-hidden relative shadow-md">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.123456789!2d15.312345!3d-4.312345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3123456789ab%3A0x123456789abcdef!2sAvenue%20des%20Aviateurs%2C%20Kinshasa!5e0!3m2!1sfr!2scd!4v1234567890123"
                className="w-full h-full border-0 grayscale"
                allowFullScreen
                loading="lazy"
              ></iframe>
              <div className="absolute inset-0 bg-petrol/10 pointer-events-none" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nom Complet</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-light-gray border border-medium-gray focus:border-accent outline-none transition-all rounded-sm"
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-light-gray border border-medium-gray focus:border-accent outline-none transition-all rounded-sm"
                  placeholder="votre@email.com"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Sujet</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full p-4 bg-light-gray border border-medium-gray focus:border-accent outline-none transition-all rounded-sm"
                >
                  <option>Construction / BTP</option>
                  <option>Ingénierie Civile</option>
                  <option>Solutions Digitales</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                <textarea 
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-4 bg-light-gray border border-medium-gray focus:border-accent outline-none transition-all rounded-sm"
                  placeholder="Comment pouvons-nous vous aider ?"
                ></textarea>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="w-full bg-accent text-petrol-dark font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-accent-light transition-all flex items-center justify-center group shadow-lg">
                  Envoyer via WhatsApp
                  <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-widest font-bold">
                  Tout message et devis sera envoyé directement sur notre numéro WhatsApp
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
