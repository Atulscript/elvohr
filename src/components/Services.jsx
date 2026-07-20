import React from 'react';
import './Services.css';
import { Briefcase, Users, FileText, CheckSquare, Globe, Building } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Users size={32} />,
      title: "Recruitment & Staffing",
      description: "End-to-end recruitment solutions for permanent, temporary, and contract staffing across various industries."
    },
    {
      icon: <FileText size={32} />,
      title: "Payroll Management",
      description: "Accurate, compliant, and timely payroll administration to streamline your HR operations."
    },
    {
      icon: <CheckSquare size={32} />,
      title: "Compliance Services",
      description: "Ensuring your organization meets all statutory and regulatory compliance requirements."
    },
    {
      icon: <Globe size={32} />,
      title: "Employer of Record (EOR)",
      description: "Expand globally without the hassle of setting up legal entities. We act as your official employer."
    },
    {
      icon: <Briefcase size={32} />,
      title: "HR Operations",
      description: "Comprehensive HR support to manage employee lifecycles and day-to-day HR tasks efficiently."
    },
    {
      icon: <Building size={32} />,
      title: "Custom Solutions",
      description: "Tailored strategic HR solutions designed specifically for your organization's unique challenges."
    }
  ];

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="section-header text-center">
          <h2>Our Services</h2>
          <p className="subtitle">
            Comprehensive HR solutions tailored to your unique business needs.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
