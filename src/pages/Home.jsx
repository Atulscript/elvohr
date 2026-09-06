import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import IndustrySection from '../components/IndustrySection';
import WhyUs from '../components/WhyUs';
import SEO from '../components/SEO';

const Home = () => {
  return (
    <>
      <SEO 
        title="ELVO HR - End-to-End HR & Workforce Management Solutions"
        description="Your trusted human resources solutions partner in India. Premier corporate staffing, executive recruitment, payroll outsourcing, and statutory labor compliance."
        canonical="/"
      />
      <Hero />
      <Services />
      <IndustrySection />
      <WhyUs />
    </>
  );
};

export default Home;
