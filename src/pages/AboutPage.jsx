import React from 'react';
import About from '../components/About';
import Values from '../components/Values';
import SEO from '../components/SEO';

const AboutPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <SEO 
        title="About Us - Mission, Leadership & Values | ELVO HR"
        description="Learn about ELVO HR's leadership, client-first philosophy, corporate governance, and commitment to empowering lives while valuing organizations."
        canonical="/about"
      />
      <About />
      <Values />
    </div>
  );
};

export default AboutPage;
