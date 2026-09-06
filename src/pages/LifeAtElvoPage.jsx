import React from 'react';
import LifeAtElvo from '../components/LifeAtElvo';
import SEO from '../components/SEO';

const LifeAtElvoPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <SEO 
        title="Life at ELVO - Culture, Community & Team Spirit | ELVO HR"
        description="Experience the dynamic workplace culture, team celebrations, corporate offsites, and community impact at ELVO HR."
        canonical="/life-at-elvo"
      />
      <LifeAtElvo />
    </div>
  );
};

export default LifeAtElvoPage;
