import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Quote, Loader2, Star } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'testimonials';
    const q = query(collection(db, 'testimonials'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const testimonialsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonials(testimonialsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const partners = [
    { name: "EDC MIZ", logo: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" },
    { name: "Rawbank", logo: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/rawbank.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9yYXdiYW5rLnBuZyIsImlhdCI6MTc3MzMzNzc2NiwiZXhwIjoyMDg4Njk3NzY2fQ.6WnF8c66c9YkfUlzuHe6nsNb636OBgxoAW0UBpktS0M" },
    { name: "Wanzcorp", logo: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/WANZCORP%20copie.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9XQU5aQ09SUCBjb3BpZS5qcGciLCJpYXQiOjE3NzMzMzc1MDEsImV4cCI6MjA4ODY5NzUwMX0.OATK_QYI28usRRHpnkoOg5FDRkAiioV1Qqw5IkRw-gM" },
  ];

  if (loading) {
    return (
      <section className="py-24 bg-white flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" size={48} />
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Ils nous font confiance</h2>
          <h3 className="text-4xl font-black text-petrol-dark">Témoignages & Partenaires</h3>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-50 p-8 rounded-sm relative group hover:bg-petrol-dark transition-all duration-500"
            >
              <Quote className="absolute top-6 right-6 text-petrol/10 group-hover:text-accent/20" size={48} />
              
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="text-slate-600 italic mb-6 leading-relaxed relative z-10 group-hover:text-white/80 transition-colors">
                "{t.content || t.text}"
              </p>
              <div className="flex items-center gap-4">
                {t.imageUrl && (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div>
                   <h4 className="font-bold text-petrol-dark group-hover:text-white transition-colors">— {t.name}</h4>
                   {t.role && <p className="text-xs text-slate-400 group-hover:text-accent transition-colors">{t.role}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all">
            {partners.map((p) => (
              <div key={p.name} className="flex justify-center">
                <img 
                  src={p.logo} 
                  alt={p.name} 
                  className="h-24 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
