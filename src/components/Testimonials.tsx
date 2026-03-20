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
    <section id="testimonials" className="py-32 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-petrol/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
            Témoignages
          </div>
          <h3 className="text-4xl sm:text-6xl font-black text-petrol-dark tracking-tighter">Ils nous font <span className="text-accent">confiance</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative bg-slate-50 p-12 rounded-[2.5rem] hover:bg-petrol-dark transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute top-10 right-10 text-accent/20 group-hover:text-accent/40 transition-colors duration-500">
                <Quote size={48} />
              </div>
              
              <div className="flex gap-1 mb-8">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="text-slate-500 text-lg italic mb-10 leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                "{t.content || t.text}"
              </p>

              <div className="flex items-center gap-5 pt-8 border-t border-slate-200 group-hover:border-white/10 transition-colors duration-500">
                {t.imageUrl && (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div>
                   <h4 className="font-black text-petrol-dark group-hover:text-white transition-colors duration-500">— {t.name}</h4>
                   {t.role && <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-accent transition-colors duration-500 mt-1">{t.role}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-24 border-t border-slate-100">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Nos Partenaires Stratégiques</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 items-center">
            {partners.map((p, i) => (
              <motion.div 
                key={p.name} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.4 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex justify-center grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
              >
                <img 
                  src={p.logo} 
                  alt={p.name} 
                  className="h-20 object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
