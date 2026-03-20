import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Loader2, Mail, Linkedin, Twitter } from 'lucide-react';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'team';
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTeamMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading && teamMembers.length === 0) {
    return null; // Don't show anything if loading and no data
  }

  if (teamMembers.length === 0) {
    return null; // Don't show the section if no members
  }

  return (
    <section id="team" className="py-32 bg-white overflow-hidden relative">
      {/* Subtle Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 transform origin-top-right -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
            Notre Équipe
          </div>
          <h2 className="text-5xl sm:text-7xl font-black text-petrol-dark leading-[1] tracking-tighter mb-8">
            Les Experts d'<span className="text-accent">EDCMIZ</span> SARL
          </h2>
          <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-3xl mx-auto">
            Une équipe pluridisciplinaire dévouée à la réussite de vos projets, 
            alliant expertise technique et engagement professionnel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="group"
            >
              <div className="relative mb-10 aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-2xl">
                <img
                  src={member.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark via-petrol-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="flex items-center gap-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <a href="#" className="w-12 h-12 bg-accent text-petrol-dark rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 active:scale-90 transition-all shadow-xl">
                      <Linkedin size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 bg-accent text-petrol-dark rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 active:scale-90 transition-all shadow-xl">
                      <Twitter size={20} />
                    </a>
                    <a href={`mailto:${member.email || 'info@edcmiz.com'}`} className="w-12 h-12 bg-accent text-petrol-dark rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 active:scale-90 transition-all shadow-xl">
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="text-center px-4">
                <h4 className="text-2xl font-black text-petrol-dark mb-2 tracking-tight group-hover:text-accent transition-colors duration-300">
                  {member.name}
                </h4>
                <div className="inline-block px-3 py-1 bg-slate-50 text-accent text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
                  {member.role}
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
