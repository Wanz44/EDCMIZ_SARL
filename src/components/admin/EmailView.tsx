import React, { useState, useEffect, useCallback } from 'react';
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
  Phone,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle2
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
  const [gmailMessages, setGmailMessages] = useState<any[]>([]);
  const [isGmailConnected, setIsGmailConnected] = useState<boolean | null>(null);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [isLoadingGmail, setIsLoadingGmail] = useState(false);
  const [view, setView] = useState<'inbox' | 'gmail' | 'sent' | 'compose'>('gmail');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: '',
    threadId: ''
  });

  const fetchGmailMessages = useCallback(async () => {
    setIsLoadingGmail(true);
    setGmailError(null);
    try {
      // First check status
      const statusRes = await fetch('/api/auth/google/status');
      const statusData = await statusRes.json();
      
      if (!statusData.connected) {
        setIsGmailConnected(false);
        if (statusData.error) setGmailError(statusData.error);
        setIsLoadingGmail(false);
        return;
      }

      const response = await fetch('/api/gmail/messages');
      if (response.status === 401) {
        setIsGmailConnected(false);
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch Gmail messages');
      const data = await response.json();
      setGmailMessages(data);
      setIsGmailConnected(true);
    } catch (error: any) {
      console.error('Error fetching Gmail:', error);
      setIsGmailConnected(false);
      setGmailError(error.message);
    } finally {
      setIsLoadingGmail(false);
    }
  }, []);

  useEffect(() => {
    fetchGmailMessages();
  }, [fetchGmailMessages]);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchGmailMessages();
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [fetchGmailMessages]);

  const handleConnectGmail = async () => {
    setGmailError(null);
    try {
      // Check if server is up
      const healthRes = await fetch('/api/health');
      if (!healthRes.ok) {
        throw new Error('Le serveur backend ne répond pas. Veuillez patienter quelques secondes et réessayer.');
      }

      const response = await fetch('/api/auth/google/url');
      const data = await response.json();
      
      if (!response.ok) {
        setGmailError(data.error || 'Erreur lors de la récupération de l\'URL d\'authentification');
        return;
      }

      window.open(data.url, 'gmail_oauth', 'width=600,height=700');
    } catch (error: any) {
      console.error('Error getting auth URL:', error);
      setGmailError(error.message || 'Impossible de contacter le serveur d\'authentification. Le serveur est peut-être en train de redémarrer.');
    }
  };

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
    setIsSending(true);
    try {
      // If Gmail is connected, send via Gmail API
      if (isGmailConnected) {
        const response = await fetch('/api/gmail/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(composeData)
        });
        if (!response.ok) throw new Error('Failed to send email via Gmail');
      } else {
        // Fallback to mailto and Firestore
        const path = 'sent_emails';
        await addDoc(collection(db, path), {
          ...composeData,
          createdAt: Timestamp.now(),
          status: 'sent'
        });
        const mailtoUrl = `mailto:${composeData.to}?subject=${encodeURIComponent(composeData.subject)}&body=${encodeURIComponent(composeData.body)}`;
        window.open(mailtoUrl);
      }
      
      setView('sent');
      setComposeData({ to: '', subject: '', body: '', threadId: '' });
      if (isGmailConnected) fetchGmailMessages();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getHeaderValue = (headers: any[], name: string) => {
    return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
  };

  const extractEmail = (from: string) => {
    const match = from.match(/<(.+?)>/);
    return match ? match[1] : from;
  };

  const decodeGmailBody = (payload: any) => {
    if (!payload) return '';
    
    // Helper to decode base64safe
    const decode = (data: string) => {
      try {
        return decodeURIComponent(escape(atob(data.replace(/-/g, '+').replace(/_/g, '/'))));
      } catch (e) {
        return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    };

    if (payload.body?.data) {
      return decode(payload.body.data);
    }

    if (payload.parts) {
      // Prefer HTML if available
      const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html');
      if (htmlPart?.body?.data) return decode(htmlPart.body.data);
      
      const plainPart = payload.parts.find((p: any) => p.mimeType === 'text/plain');
      if (plainPart?.body?.data) return decode(plainPart.body.data);

      // Recursive check for nested parts
      for (const part of payload.parts) {
        if (part.parts) {
          const nested = decodeGmailBody(part);
          if (nested) return nested;
        }
      }
    }
    return '';
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
      className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
          <img 
            src="https://efzybrnlapxwxkorddtv.supabase.co/storage/v1/object/sign/EDCMIZ_SARL/EDC-LOGO%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MTdmZmQ5ZS1jYWE3LTRmY2MtYTgzNS1mYzgwZGE1YWY0ZjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFRENNSVpfU0FSTC9FREMtTE9HTyAucG5nIiwiaWF0IjoxNzczMzMxNzE1LCJleHAiOjIwODg2OTE3MTV9.aG4aw3zsLEJkR-StBowbh7hfSA9nR0_lSP4LijFcyns" 
            alt="EDCMIZ" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight">Messagerie & IA</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Gérez vos communications et générez des réponses avec l'IA.</p>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
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
            onClick={() => setView('gmail')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
              view === 'gmail' ? "bg-white dark:bg-slate-800 text-petrol dark:text-accent shadow-sm" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50"
            )}
          >
            <Mail size={16} /> Gmail (edcmiz2)
            {isGmailConnected && gmailMessages.length > 0 && (
              <span className="ml-auto bg-accent text-petrol-dark px-1.5 py-0.5 rounded-full text-[10px]">
                {gmailMessages.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setView('inbox')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
              view === 'inbox' ? "bg-white dark:bg-slate-800 text-petrol dark:text-accent shadow-sm" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50"
            )}
          >
            <Inbox size={16} /> Prospects Site
            {messages.length > 0 && (
              <span className="ml-auto bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full text-[10px]">
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
                    disabled={isSending}
                    className="px-6 py-2.5 bg-petrol-dark dark:bg-accent text-white dark:text-petrol-dark rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 
                    {isSending ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : view === 'gmail' ? (
            <motion.div 
              key="gmail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 overflow-hidden"
            >
              {!isGmailConnected ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <Mail size={40} />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-xl font-black text-petrol-dark dark:text-white mb-2">Connectez votre Gmail</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      Gérez les emails de <span className="font-bold text-accent">edcmiz2@gmail.com</span> directement depuis votre portail admin.
                    </p>
                    
                    {gmailError && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold">
                        <AlertCircle size={16} />
                        {gmailError}
                      </div>
                    )}

                    <button 
                      onClick={handleConnectGmail}
                      className="px-8 py-4 bg-petrol-dark dark:bg-accent text-white dark:text-petrol-dark rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 mx-auto"
                    >
                      <ExternalLink size={18} />
                      Se connecter avec Google
                    </button>
                    
                    <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] text-slate-400 text-left space-y-2">
                      <p className="font-bold uppercase tracking-widest text-slate-500 mb-1">Instructions de configuration :</p>
                      <p>1. Allez sur la console Google Cloud.</p>
                      <p>2. Activez l'API Gmail.</p>
                      <p>3. Créez des identifiants OAuth 2.0 (ID Client et Code Secret).</p>
                      <p>4. Ajoutez l'URI de redirection suivante :</p>
                      <code className="block p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 break-all select-all">
                        {window.location.origin}/auth/google/callback
                      </code>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Gmail List */}
                  <div className="w-1/2 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 sticky top-0 z-10 backdrop-blur-md flex items-center gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="Rechercher dans Gmail..." 
                          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-accent/50 outline-none transition-all text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <button 
                        onClick={fetchGmailMessages}
                        disabled={isLoadingGmail}
                        className="p-2 text-slate-400 hover:text-accent transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={16} className={cn(isLoadingGmail && "animate-spin")} />
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {gmailMessages.map((msg) => {
                        const subject = getHeaderValue(msg.payload.headers, 'Subject');
                        const from = getHeaderValue(msg.payload.headers, 'From');
                        const date = getHeaderValue(msg.payload.headers, 'Date');
                        return (
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
                                layoutId="active-gmail"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-accent"
                              />
                            )}
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-accent transition-colors truncate max-w-[70%]">{extractEmail(from)}</span>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {new Date(date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-xs text-petrol dark:text-accent/80 font-medium truncate">{subject}</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{msg.snippet}</p>
                          </button>
                        );
                      })}
                      {isLoadingGmail && gmailMessages.length === 0 && (
                        <div className="p-24 text-center flex flex-col items-center gap-3 text-slate-400">
                          <Loader2 size={48} className="animate-spin opacity-20" />
                          <p className="italic text-sm">Chargement des messages...</p>
                        </div>
                      )}
                      {!isLoadingGmail && gmailMessages.length === 0 && (
                        <div className="p-24 text-center flex flex-col items-center gap-3 text-slate-400 dark:text-slate-600">
                          <Inbox size={48} className="opacity-10" />
                          <p className="italic text-sm">Aucun message trouvé.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gmail Detail */}
                  <div className="flex-1 bg-slate-50/30 dark:bg-slate-900/30 overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                      {selectedMessage && selectedMessage.payload ? (
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
                                  <h3 className="text-xl font-black text-petrol-dark dark:text-white">{getHeaderValue(selectedMessage.payload.headers, 'From')}</h3>
                                  <p className="text-sm text-accent font-bold">{extractEmail(getHeaderValue(selectedMessage.payload.headers, 'From'))}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{getHeaderValue(selectedMessage.payload.headers, 'Subject')}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Date</p>
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                  {new Date(getHeaderValue(selectedMessage.payload.headers, 'Date')).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl mb-8 border-l-4 border-accent/30 overflow-x-auto">
                              <div 
                                className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: decodeGmailBody(selectedMessage.payload) }}
                              />
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <button 
                                onClick={() => {
                                  const from = getHeaderValue(selectedMessage.payload.headers, 'From');
                                  const emailMatch = from.match(/<(.+?)>/) || [null, from];
                                  const email = emailMatch[1];
                                  const subject = getHeaderValue(selectedMessage.payload.headers, 'Subject');
                                  
                                  setComposeData({
                                    to: email,
                                    subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
                                    body: `\n\n--- En réponse à ---\n${decodeGmailBody(selectedMessage.payload)}`,
                                    threadId: selectedMessage.threadId
                                  });
                                  setView('compose');
                                }}
                                className="px-6 py-2.5 bg-petrol-dark dark:bg-accent text-white dark:text-petrol-dark rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
                              >
                                <Mail size={16} /> Répondre
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
                          <p className="text-sm font-bold uppercase tracking-widest opacity-50">Sélectionnez un email pour le lire</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
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
    </div>
  </motion.div>
);
}
