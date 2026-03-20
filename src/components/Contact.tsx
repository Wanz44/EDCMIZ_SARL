import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Construction / BTP',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message || !formData.phone) {
      alert('Veuillez remplir votre nom, téléphone et votre message');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Firestore
      const path = 'prospects';
      await addDoc(collection(db, path), {
        name: formData.name,
        email: formData.email || '',
        phone: formData.phone,
        type: formData.subject,
        message: formData.message,
        status: 'Nouveau',
        createdAt: serverTimestamp()
      });

      // WhatsApp Redirect
      const whatsappMessage = `Bonjour EDCMIZ,%0A%0A*Nouveau message de contact*%0A*Nom:* ${formData.name}%0A*Email:* ${formData.email || 'Non précisé'}%0A*Tel:* ${formData.phone}%0A*Sujet:* ${formData.subject}%0A*Message:* ${formData.message}`;
      window.open(`https://wa.me/243829002360?text=${whatsappMessage}`, '_blank');
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: 'Construction / BTP', message: '' });
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'prospects');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-white overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Left Side: Content & Info */}
          <div className="space-y-16">
            <div>
              <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
                Contactez-nous
              </div>
              <h2 className="text-5xl sm:text-7xl font-black text-petrol-dark leading-[1] tracking-tighter mb-8">
                Prêt à <span className="text-accent">Bâtir</span> l'Avenir ?
              </h2>
              <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-lg">
                Que ce soit pour une infrastructure d'envergure ou une solution digitale innovante, notre équipe est prête à relever le défi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="group p-8 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <MapPin size={28} />
                </div>
                <h4 className="text-[10px] font-black text-petrol-dark uppercase tracking-[0.2em] mb-3">Notre Siège</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  3344 avenue des Aviateurs,<br />
                  Kinshasa/Gombe, RDC
                </p>
              </div>

              <div className="group p-8 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Phone size={28} />
                </div>
                <h4 className="text-[10px] font-black text-petrol-dark uppercase tracking-[0.2em] mb-3">WhatsApp / Tel</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">+243 829 002 360</p>
              </div>

              <div className="group p-8 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Mail size={28} />
                </div>
                <h4 className="text-[10px] font-black text-petrol-dark uppercase tracking-[0.2em] mb-3">Email</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">edcmiz2@gmail.com</p>
              </div>

              <div className="group p-8 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Clock size={28} />
                </div>
                <h4 className="text-[10px] font-black text-petrol-dark uppercase tracking-[0.2em] mb-3">Disponibilité</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Lun - Ven: 09h00 - 18h00</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-petrol-dark p-16 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center text-center h-full text-white"
              >
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 size={48} className="text-accent" />
                </div>
                <h4 className="text-4xl font-black mb-6 tracking-tighter">Message Envoyé !</h4>
                <p className="text-white/60 text-lg font-medium mb-12">
                  Merci pour votre confiance. Nous avons bien reçu votre demande et nous vous contacterons très prochainement.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="bg-accent text-petrol-dark px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <div className="bg-white p-10 sm:p-16 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nom Complet *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-5 bg-slate-50 border-none focus:ring-2 focus:ring-accent outline-none transition-all rounded-2xl font-medium text-petrol-dark placeholder:text-slate-300"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Téléphone *</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-5 bg-slate-50 border-none focus:ring-2 focus:ring-accent outline-none transition-all rounded-2xl font-medium text-petrol-dark placeholder:text-slate-300"
                        placeholder="+243 ..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Email (Optionnel)</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-5 bg-slate-50 border-none focus:ring-2 focus:ring-accent outline-none transition-all rounded-2xl font-medium text-petrol-dark placeholder:text-slate-300"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Sujet</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full p-5 bg-slate-50 border-none focus:ring-2 focus:ring-accent outline-none transition-all rounded-2xl font-medium text-petrol-dark appearance-none cursor-pointer"
                      >
                        <option>Construction / BTP</option>
                        <option>Ingénierie Civile</option>
                        <option>Solutions Digitales</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Message *</label>
                    <textarea 
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full p-5 bg-slate-50 border-none focus:ring-2 focus:ring-accent outline-none transition-all rounded-2xl font-medium text-petrol-dark placeholder:text-slate-300 resize-none"
                      placeholder="Comment pouvons-nous vous aider ?"
                    ></textarea>
                  </div>

                  <div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-petrol-dark text-white font-black uppercase tracking-[0.2em] text-[10px] py-6 rounded-2xl hover:bg-accent hover:text-petrol-dark transition-all duration-300 flex items-center justify-center group shadow-2xl disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                      <Send className="ml-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" size={20} />
                    </button>
                    <p className="text-[9px] text-slate-400 text-center mt-6 uppercase tracking-[0.2em] font-black">
                      Redirection vers WhatsApp après validation
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
