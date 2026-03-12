import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Jean-Paul Kabamba",
    text: "EDCMIZ a transformé notre approche de la maintenance des infrastructures. Leur rigueur technique et leur expertise nous ont permis de gagner en efficacité sur tous nos projets."
  },
  {
    name: "Marie-Claire Tshimanga",
    text: "Un professionnalisme rare à Kinshasa. Le respect scrupuleux des budgets et la qualité des finitions sur nos chantiers font d'eux un partenaire de premier choix."
  }
];

const partners = [
  { name: "EDC MIZ", logo: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" },
  { name: "Rawbank", logo: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/rawbank.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9yYXdiYW5rLnBuZyIsImlhdCI6MTc3MzMzNzc2NiwiZXhwIjoyMDg4Njk3NzY2fQ.6WnF8c66c9YkfUlzuHe6nsNb636OBgxoAW0UBpktS0M" },
  { name: "Wanzcorp", logo: "https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/WANZCORP%20copie.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9XQU5aQ09SUCBjb3BpZS5qcGciLCJpYXQiOjE3NzMzMzc1MDEsImV4cCI6MjA4ODY5NzUwMX0.OATK_QYI28usRRHpnkoOg5FDRkAiioV1Qqw5IkRw-gM" },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-accent font-bold uppercase tracking-widest mb-2">Ils nous font confiance</h2>
          <h3 className="text-4xl font-black text-petrol-dark">Témoignages & Partenaires</h3>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-50 p-8 rounded-sm relative"
            >
              <Quote className="absolute top-6 right-6 text-petrol/10" size={48} />
              <p className="text-slate-600 italic mb-6 leading-relaxed relative z-10">
                "{t.text}"
              </p>
              <div className="flex items-center">
                <div>
                   <h4 className="font-bold text-petrol-dark">— {t.name}</h4>
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
