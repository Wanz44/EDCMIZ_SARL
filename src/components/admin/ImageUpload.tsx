import React, { useState, useRef } from 'react';
import { Upload, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { storage } from '../../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { cn } from '@/src/lib/utils';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  className?: string;
  folder?: string;
}

export function ImageUpload({ onUpload, currentUrl, label, className, folder = 'general' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse (max 5Mo)');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error('Upload error:', error);
        setError('Erreur lors de l\'envoi de l\'image');
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUpload(downloadURL);
          setSuccess(true);
          setIsUploading(false);
          // Reset after 3 seconds
          setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
          console.error('Error getting download URL:', err);
          setError('Erreur lors de la récupération du lien');
          setIsUploading(false);
        }
      }
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
          {label}
        </label>
      )}
      
      <div className="relative group">
        <div 
          className={cn(
            "relative h-32 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden bg-slate-50",
            isUploading ? "border-accent bg-accent/5" : "border-slate-200 hover:border-accent hover:bg-slate-100",
            error ? "border-red-300 bg-red-50" : "",
            success ? "border-emerald-300 bg-emerald-50" : ""
          )}
        >
          {currentUrl && !isUploading && !success && !error && (
            <img 
              src={currentUrl} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity"
              referrerPolicy="no-referrer"
            />
          )}

          <div className="relative z-10 flex flex-col items-center gap-2 p-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="animate-spin text-accent" size={24} />
                <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-accent transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{Math.round(progress)}%</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="text-emerald-500" size={24} />
                <span className="text-xs font-bold text-emerald-600">Image envoyée !</span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="text-red-500" size={24} />
                <span className="text-xs font-bold text-red-600">{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline"
                >
                  Réessayer
                </button>
              </>
            ) : (
              <>
                <Upload className="text-slate-400 group-hover:text-accent transition-colors" size={24} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-600">
                    {currentUrl ? "Changer l'image" : "Ajouter une image"}
                  </p>
                  <p className="text-[10px] text-slate-400">JPG, PNG, WEBP (max 5Mo)</p>
                </div>
              </>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </div>

        {currentUrl && !isUploading && (
          <button 
            type="button"
            onClick={() => onUpload('')}
            className="absolute -top-2 -right-2 p-1 bg-white shadow-md rounded-full text-slate-400 hover:text-red-500 transition-colors z-20"
            title="Supprimer l'image"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
