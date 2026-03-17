import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  Filter, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

export function CRMView() {
  const [prospects, setProspects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const path = 'prospects';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProspects(data);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => {
      unsubscribe();
      setSearchTerm(''); // Clear search on unmount
    };
  }, []);

  const filteredProspects = prospects.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'prospects', id), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `prospects/${id}`);
    }
  };

  const deleteProspect = async (id: string) => {
    if (!window.confirm('Supprimer ce prospect ?')) return;
    try {
      await deleteDoc(doc(db, 'prospects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `prospects/${id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-100 text-blue-700';
      case 'Contacté': return 'bg-orange-100 text-orange-700';
      case 'Devis envoyé': return 'bg-purple-100 text-purple-700';
      case 'Gagné': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un prospect..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Filter size={18} /> Filtrer
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Prospect</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Type de Travaux</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProspects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.phone}</p>
                    {p.email && <p className="text-[10px] text-slate-400 italic">{p.email}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{p.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{p.budget || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full outline-none border-none cursor-pointer", getStatusColor(p.status))}
                    >
                      <option value="Nouveau">Nouveau</option>
                      <option value="Contacté">Contacté</option>
                      <option value="Devis envoyé">Devis envoyé</option>
                      <option value="Gagné">Gagné</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {p.createdAt instanceof Timestamp ? p.createdAt.toDate().toLocaleDateString() : 'Récemment'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteProspect(p.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <AlertCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProspects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                    Aucun prospect trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
