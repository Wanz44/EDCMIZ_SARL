import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  ShieldAlert, 
  Mail, 
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import firebaseConfig from '../../../firebase-applet-config.json';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt?: any;
}

export function UsersView() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'editor' as const });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setUsers(usersData);
      setIsLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    let tempApp;
    try {
      // 1. Create user in Firebase Auth using a temporary app instance
      // This prevents the current admin from being logged out
      const appName = `temp-app-${Date.now()}`;
      tempApp = initializeApp(firebaseConfig, appName);
      const tempAuth = getAuth(tempApp);
      
      const userCredential = await createUserWithEmailAndPassword(tempAuth, newUser.email, newUser.password);
      const uid = userCredential.user.uid;

      // 2. Create user profile in Firestore
      await setDoc(doc(db, 'users', uid), {
        email: newUser.email,
        role: newUser.role,
        createdAt: serverTimestamp()
      });

      // 3. Clean up temp app
      await signOut(tempAuth);
      
      setSuccess(`Utilisateur ${newUser.email} créé avec succès.`);
      setIsAddingUser(false);
      setNewUser({ email: '', password: '', role: 'editor' });
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError(err.message || 'Une erreur est survenue lors de la création de l\'utilisateur.');
    } finally {
      if (tempApp) {
        await deleteApp(tempApp);
      }
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'editor') => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      setSuccess('Rôle mis à jour avec succès.');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ? Notez que cela ne supprimera pas son compte Auth Firebase, seulement ses privilèges dans l'application.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      setSuccess('Utilisateur supprimé de la liste des privilèges.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>
        <button
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 bg-accent text-petrol-dark px-6 py-2 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <UserPlus size={18} />
          Nouvel Utilisateur
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-500 text-sm">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Utilisateur</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-accent" size={32} />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{user.email}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <ShieldAlert size={16} className="text-red-500" />
                        ) : (
                          <Shield size={16} className="text-blue-500" />
                        )}
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as 'admin' | 'editor')}
                          className="bg-transparent border-none focus:ring-0 text-sm font-bold cursor-pointer"
                        >
                          <option value="admin">Administrateur</option>
                          <option value="editor">Éditeur</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Supprimer les privilèges"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddingUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingUser(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight uppercase">Nouvel Utilisateur</h3>
                <button onClick={() => setIsAddingUser(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    placeholder="ex: collaborateur@edcmiz.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Mot de passe provisoire</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-[9px] text-slate-400 italic">Minimum 6 caractères.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Rôle</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'editor' })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm font-bold"
                  >
                    <option value="editor">Éditeur (Gestion du contenu)</option>
                    <option value="admin">Administrateur (Accès total)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-accent text-petrol-dark px-4 py-3 rounded-xl font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Création...
                      </>
                    ) : (
                      'Créer le compte'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
