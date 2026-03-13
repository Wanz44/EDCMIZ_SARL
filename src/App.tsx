import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Equipment from './components/Equipment';
import Showcase from './components/Showcase';
import News from './components/News';
import AdminPortal from './components/AdminPortal';
import { db } from './lib/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl border-t-4 border-red-500">
          <h2 className="text-xl font-black text-petrol-dark mb-4 uppercase tracking-tight">Une erreur est survenue</h2>
          <div className="bg-red-50 p-4 rounded-sm mb-6">
            <p className="text-xs font-mono text-red-700 break-all">
              {error.message || 'Erreur inconnue'}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-petrol-dark text-white py-3 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-accent hover:text-petrol-dark transition-all"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  if (showAdmin) {
    return (
      <ErrorBoundary>
        <AdminPortal onClose={() => setShowAdmin(false)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white selection:bg-accent selection:text-petrol-dark">
        <Navbar onOpenPortal={() => setShowAdmin(true)} />
        <main>
          <Hero />
          <About />
          <WhyChooseUs />
          <Services />
          <Equipment />
          <Projects />
          <Showcase />
          <Testimonials />
          <News />
          <Contact />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
