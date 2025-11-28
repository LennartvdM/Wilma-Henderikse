import React from 'react';
import Hero from '../components/Hero';
import Quote from '../components/Quote';
import Work from '../components/Work';
import PublicationsGallery from '../components/PublicationsGallery';
import About from '../components/About';
import Contact from '../components/Contact';
import './Home.css';

function Home() {
  return (
    <div className="page-container">
      <main className="main-content">
        <Hero />
        <Quote />
        <Work />
        <PublicationsGallery />
        <About />
        <Contact />
      </main>
    </div>
  );
}

export default Home;

