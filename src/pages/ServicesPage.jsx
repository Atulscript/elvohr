import React from 'react';
import Services from '../components/Services';
import SEO from '../components/SEO';

const ServicesPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <SEO 
        title="HR Solutions & Staffing Services | ELVO HR"
        description="Comprehensive HR services: Permanent Recruitment, Contract Staffing, Payroll Management, Statutory Labor Compliance, and Custom Workforce Solutions."
        keywords="HR services India, permanent recruitment solutions, contract staffing agencies, payroll management outsourcing, statutory labor compliance services, employer of record EOR India, workforce solutions"
        canonical="/services"
      />
      <Services isPage={true} />
    </div>
  );
};

export default ServicesPage;
