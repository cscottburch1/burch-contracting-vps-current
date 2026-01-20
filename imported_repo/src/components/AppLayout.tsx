import React from 'react';
import Header from './Header';
import Hero from './Hero';
import WhyChooseUs from './WhyChooseUs';
import Services from './Services';
import ServiceAreas from './ServiceAreas';
import Projects from './Projects';
import Testimonials from './Testimonials';
import ContactCTA from './ContactCTA';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <Services />
        <Projects />
        <ServiceAreas />
        <Testimonials />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
