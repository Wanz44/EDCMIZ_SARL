import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Inbox, 
  Send, 
  Search, 
  Mail, 
  Loader2, 
  BarChart3,
  ChevronRight,
  User,
  Clock,
  Trash2,
  Phone
} from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

export function EmailView() {
  const [messages, setMessages] = useState<any[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [view, setView] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  useEffect(() => {
    const path = 'prospects';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const path = 'sent_emails';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSentEmails(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'sent_emails';
    try {
      await addDoc(collection(db, path), {
        ...composeData,
        createdAt: Timestamp.now(),
        status: 'sent'
      });
      
      const mailtoUrl = `mailto:${composeData.to}?subject=${encodeURIComponent(composeData.subject)}&body=${encodeURIComponent(composeData.body)}`;
      window.open(mailtoUrl);
      
      setView('sent');
      setComposeData({ to: '', subject: '', body: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const generateDraft = async () => {
    if (!selectedMessage) return;
    setIsDrafting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Rédige une réponse professionnelle et courtoise en français pour EDCMIZ SARL (entreprise de construction en RDC) à ce message de prospect:
        Nom: ${selectedMessage.name}
        Message: ${selectedMessage.message}
        
        La réponse doit être chaleureuse, professionnelle et inviter à un rendez-vous ou un appel.`,
      });
      
      setComposeData({
        to: selectedMessage.email,
        subject: `Réponse à votre demande - EDCMIZ SARL`,
        body: response.text || ''
      });
      setView('compose');
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-[calc(100vh-200px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Email Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-4">
          <button 
            onClick={() => setView('compose')}
            className="w-full py-3 bg-accent text-petrol-dark rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/90 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Nouveau Message
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button 
            onClick={() => setView('inbox')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
              view === 'inbox' ? "bg-white dark:bg-slate-800 text-petrol dark:text-accent shadow-sm" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50"
            )}
          >
            <Inbox size={16} /> Boîte de réception
            {messages.length > 0 && (
              <span className="ml-auto bg-accent text-petrol-dark px-1.5 py-0.5 rounded-full text-[10px]">
                {messages.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setView('sent')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
              view === 'sent' ? "bg-white dark:bg-slate-800 text-petrol dark:text-accent shadow-sm" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50"
            )}
          >
            <Send size={16} /> Messages envoyés
          </button>
        </nav>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
        <AnimatePresence mode="wait">
          {view === 'compose' ? (
            <motion.div 
              key="compose"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 max-w-3xl overflow-y-auto custom-scrollbar"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <Send size={20} className="text-accent" /> Nouveau Message
              </h3>
              <form onSubmit={handleSend} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">À (Email)</label>
                  <input 
                    type="email" 
                    required
                    value={composeData.to}
                    onChange={e => setComposeData({...composeData, to: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200" 
                    placeholder="client@exemple.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sujet</label>
                  <input 
                    type="text" 
                    required
                    value={composeData.subject}
                    onChange={e => setComposeData({...composeData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200" 
                    placeholder="Sujet de votre message"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</label>
                  <textarea 
                    rows={12} 
                    required
                    value={composeData.body}
                    onChange={e => setComposeData({...composeData, body: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-sans focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200 custom-scrollbar" 
                    placeholder="Écrivez votre message ici..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setView('inbox')}
                    className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-petrol-dark dark:bg-accent text-white dark:text-petrol-dark rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Send size={16} /> Envoyer
                  </button>
                </div>
              </form>
            </motion.div>
          ) : view === 'sent' ? (
            <motion.div 
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto custom-scrollbar"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Historique des envois</h3>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{sentEmails.length} messages</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sentEmails.map((email) => (
                  <div key={email.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-accent transition-colors">{email.subject}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">À: {email.to}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <Clock size={12} />
                        {email.createdAt instanceof Timestamp ? email.createdAt.toDate().toLocaleString() : 'Récemment'}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 whitespace-pre-wrap leading-relaxed">{email.body}</p>
                  </div>
                ))}
                {sentEmails.length === 0 && (
                  <div className="p-24 text-center flex flex-col items-center gap-3 text-slate-400 dark:text-slate-600">
                    <Send size={48} className="opacity-10" />
                    <p className="italic text-sm">Aucun message envoyé.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="inbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 overflow-hidden"
            >
              {/* List */}
              <div className="w-1/2 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 sticky top-0 z-10 backdrop-blur-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Rechercher un message..." 
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {messages.map((msg) => (
                    <button 
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={cn(
                        "w-full p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex flex-col gap-1 relative group",
                        selectedMessage?.id === msg.id ? "bg-slate-50 dark:bg-slate-800/80" : ""
                      )}
                    >
                      {selectedMessage?.id === msg.id && (
                        <motion.div 
                          layoutId="active-message"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-accent"
                        />
                      )}
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-accent transition-colors">{msg.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {msg.createdAt instanceof Timestamp ? msg.createdAt.toDate().toLocaleDateString() : 'Récemment'}
                        </span>
                      </div>
                      <span className="text-xs text-petrol dark:text-accent/80 font-medium truncate">{msg.email}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{msg.message}</p>
                    </button>
                  ))}
                  {messages.length === 0 && (
                    <div className="p-24 text-center flex flex-col items-center gap-3 text-slate-400 dark:text-slate-600">
                      <Inbox size={48} className="opacity-10" />
                      <p className="italic text-sm">Aucun message reçu.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail */}
              <div className="flex-1 bg-slate-50/30 dark:bg-slate-900/30 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {selectedMessage ? (
                    <motion.div 
                      key={selectedMessage.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8"
                    >
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                              <User size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-petrol-dark dark:text-white">{selectedMessage.name}</h3>
                              <p className="text-sm text-accent font-bold">{selectedMessage.email}</p>
                              {selectedMessage.phone && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                  <Phone size={10} /> {selectedMessage.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reçu le</p>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                              {selectedMessage.createdAt instanceof Timestamp ? selectedMessage.createdAt.toDate().toLocaleString() : 'Récemment'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl mb-8 border-l-4 border-accent/30">
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed italic">
                            "{selectedMessage.message}"
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button 
                            onClick={() => {
                              setComposeData({
                                to: selectedMessage.email,
                                subject: `Re: Demande de contact - EDCMIZ SARL`,
                                body: `Bonjour ${selectedMessage.name},\n\nMerci pour votre message.\n\n`
                              });
                              setView('compose');
                            }}
                            className="px-6 py-2.5 bg-petrol-dark dark:bg-accent text-white dark:text-petrol-dark rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
                          >
                            <Mail size={16} /> Répondre
                          </button>
                          <button 
                            onClick={generateDraft}
                            disabled={isDrafting}
                            className="px-6 py-2.5 border border-accent text-accent rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-accent/10"
                          >
                            {isDrafting ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
                            Brouillon IA
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 p-8 text-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Mail size={80} className="mb-4 opacity-20" />
                      </motion.div>
                      <p className="text-sm font-bold uppercase tracking-widest opacity-50">Sélectionnez un message pour le lire</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
