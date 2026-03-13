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
            {isSuccess ? (
              <div className="bg-white p-12 rounded-sm shadow-xl flex flex-col items-center justify-center text-center h-full">
                <CheckCircle2 size={64} className="text-emerald-500 mb-6" />
                <h4 className="text-2xl font-black text-petrol-dark mb-2">Message Envoyé !</h4>
                <p className="text-slate-600">Merci pour votre confiance. Nous avons bien reçu votre demande et nous vous contacterons très prochainement.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-accent font-bold uppercase tracking-widest text-sm hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nom Complet *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-light-gray border border-medium-gray focus:border-accent outline-none transition-all rounded-sm"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Téléphone *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 bg-light-gray border border-medium-gray focus:border-accent outline-none transition-all rounded-sm"
                    placeholder="+243 ..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email (Optionnel)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 bg-light-gray border border-medium-gray focus:border-accent outline-none transition-all rounded-sm"
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="space-y-2">
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
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message *</label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-4 bg-light-gray border border-medium-gray focus:border-accent outline-none transition-all rounded-sm"
                    placeholder="Comment pouvons-nous vous aider ?"
                  ></textarea>
                </div>
                <div className="sm:col-span-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-accent text-petrol-dark font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-accent-light transition-all flex items-center justify-center group shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                    <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-widest font-bold">
                    Votre demande sera enregistrée et vous serez redirigé vers WhatsApp
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
