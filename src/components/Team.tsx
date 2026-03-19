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
    <section id="team" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-petrol font-bold uppercase tracking-widest mb-2">Notre Équipe</h2>
          <h3 className="text-4xl font-black text-petrol-dark">Les Experts d'EDCMIZ SARL</h3>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-6" />
          <p className="text-slate-500 mt-6 max-w-2xl mx-auto">
            Une équipe pluridisciplinaire dévouée à la réussite de vos projets, 
            alliant expertise technique et engagement professionnel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-sm bg-slate-100">
                <img
                  src={member.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-petrol-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a href="#" className="w-10 h-10 bg-accent text-petrol-dark rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-accent text-petrol-dark rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href={`mailto:${member.email || 'info@edcmiz.com'}`} className="w-10 h-10 bg-accent text-petrol-dark rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-black text-petrol-dark mb-1">{member.name}</h4>
                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">{member.role}</p>
                <p className="text-slate-500 text-sm line-clamp-3 px-4">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
