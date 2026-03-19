import React, { useState, useEffect, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Team from './components/Team';
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
import { doc, getDocFromServer, getDoc } from 'firebase/firestore';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-500">
            <h2 className="text-xl font-black text-petrol-dark mb-4 uppercase tracking-tight">Une erreur est survenue</h2>
            <div className="bg-red-50 p-4 rounded-xl mb-6">
              <p className="text-xs font-mono text-red-700 break-all">
                {(this.state as any).error?.message || 'Erreur inconnue'}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-petrol-dark text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-accent hover:text-petrol-dark transition-all"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
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
    
    async function fetchSEO() {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const seo = data.seo?.home || {};
          if (seo.title) document.title = seo.title;
          if (seo.description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.setAttribute('name', 'description');
              document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', seo.description);
          }
        }
      } catch (error) {
        console.error("Error fetching SEO:", error);
      }
    }

    testConnection();
    fetchSEO();
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
          <Team />
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
