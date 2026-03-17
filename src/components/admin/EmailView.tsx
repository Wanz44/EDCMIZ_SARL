import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Inbox, 
  Send, 
  Search, 
  Mail, 
  Loader2, 
  BarChart3 
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
      
      // Open mailto as a fallback for real sending
      const mailtoUrl = `mailto:${composeData.to}?subject=${encodeURIComponent(composeData.subject)}&body=${encodeURIComponent(composeData.body)}`;
      window.open(mailtoUrl);
      
      alert('Email enregistré dans l\'historique et prêt à être envoyé via votre client mail.');
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
      alert('Erreur lors de la génération du brouillon.');
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="flex h-full bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Email Sidebar */}
      <div className="w-64 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <button 
            onClick={() => setView('compose')}
            className="w-full py-2 bg-accent text-petrol-dark rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/90 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Nouveau Message
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button 
            onClick={() => setView('inbox')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              view === 'inbox' ? "bg-slate-100 text-petrol" : "text-slate-500 hover:bg-slate-50"
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
              "w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              view === 'sent' ? "bg-slate-100 text-petrol" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Send size={16} /> Messages envoyés
          </button>
        </nav>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === 'compose' ? (
          <div className="p-8 max-w-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
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
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
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
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" 
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
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-sans" 
                  placeholder="Écrivez votre message ici..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setView('inbox')}
                  className="px-6 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-petrol-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
                >
                  <Send size={16} /> Envoyer
                </button>
              </div>
            </form>
          </div>
        ) : view === 'sent' ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Historique des envois</h3>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{sentEmails.length} messages</span>
            </div>
            <div className="divide-y divide-slate-100">
              {sentEmails.map((email) => (
                <div key={email.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800">{email.subject}</h4>
                      <p className="text-xs text-slate-500">À: {email.to}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {email.createdAt instanceof Timestamp ? email.createdAt.toDate().toLocaleString() : 'Récemment'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 whitespace-pre-wrap">{email.body}</p>
                </div>
              ))}
              {sentEmails.length === 0 && (
                <div className="p-12 text-center text-slate-400 italic text-sm">
                  Aucun message envoyé.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* List */}
            <div className="w-1/2 border-r border-slate-100 overflow-y-auto">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un message..." 
                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <button 
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-slate-50 transition-colors flex flex-col gap-1",
                      selectedMessage?.id === msg.id ? "bg-slate-50 border-l-4 border-accent" : "border-l-4 border-transparent"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-sm">{msg.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {msg.createdAt instanceof Timestamp ? msg.createdAt.toDate().toLocaleDateString() : 'Récemment'}
                      </span>
                    </div>
                    <span className="text-xs text-petrol font-medium truncate">{msg.email}</span>
                    <p className="text-xs text-slate-500 line-clamp-1">{msg.message}</p>
                  </button>
                ))}
                {messages.length === 0 && (
                  <div className="p-12 text-center text-slate-400 italic text-sm">
                    Aucun message reçu.
                  </div>
                )}
              </div>
            </div>

            {/* Detail */}
            <div className="flex-1 bg-slate-50/30 overflow-y-auto">
              {selectedMessage ? (
                <div className="p-8">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-black text-petrol-dark">{selectedMessage.name}</h3>
                        <p className="text-sm text-accent font-bold">{selectedMessage.email}</p>
                        {selectedMessage.phone && <p className="text-xs text-slate-400 mt-1">{selectedMessage.phone}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reçu le</p>
                        <p className="text-xs font-bold text-slate-600">
                          {selectedMessage.createdAt instanceof Timestamp ? selectedMessage.createdAt.toDate().toLocaleString() : 'Récemment'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-xl mb-8 border-l-4 border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setComposeData({
                            to: selectedMessage.email,
                            subject: `Re: Demande de contact - EDCMIZ SARL`,
                            body: `Bonjour ${selectedMessage.name},\n\nMerci pour votre message.\n\n`
                          });
                          setView('compose');
                        }}
                        className="px-6 py-2 bg-petrol-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2"
                      >
                        <Mail size={16} /> Répondre
                      </button>
                      <button 
                        onClick={generateDraft}
                        disabled={isDrafting}
                        className="px-6 py-2 border border-accent text-accent rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-petrol-dark transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isDrafting ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
                        Brouillon IA
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                  <Mail size={64} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">Sélectionnez un message pour le lire</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
