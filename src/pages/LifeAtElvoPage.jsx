import React from 'react';
import LifeAtElvo from '../components/LifeAtElvo';
import SEO from '../components/SEO';

const LifeAtElvoPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <SEO 
        title="Life at ELVO - Culture, Community & Team Spirit | ELVO HR"
        description="Experience the dynamic workplace culture, team celebrations, corporate offsites, and community impact at ELVO HR."
        keywords="life at ELVO HR, ELVO HR company culture, employee celebrations, work life balance, team collaboration, modern office culture Delhi, associate wellness programs"
        canonical="/life-at-elvo"
      />
      <LifeAtElvo isPage={true} />
    </div>
  );
};

export default LifeAtElvoPage;
