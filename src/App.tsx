import React from 'react';
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

export default function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-accent selection:text-petrol-dark">
      <Navbar />
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
  );
}
