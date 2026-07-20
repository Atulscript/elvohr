import React from 'react';
import './About.css';
import { Target, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        
        <div className="section-header text-center">
          <h2>Who We Are</h2>
          <p className="subtitle">
            ELVO HR is a comprehensive Human Resources consulting and workforce solutions company dedicated to helping organizations build agile, compliant, and high-performing workforces.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-content">
            <h3 className="text-accent">Our Story</h3>
            <p>
              Founded with a vision to simplify and transform workforce management, ELVO HR delivers comprehensive HR solutions that support organizations through every stage of their growth journey. From recruitment and staffing to payroll administration, HR operations, compliance, and Employer of Record (EOR) services, we provide end-to-end solutions tailored to each client's unique business needs.
            </p>
            <p>
              Whether supporting startups establishing their first teams, growing enterprises expanding across India, or global organizations entering new markets, ELVO HR serves as a reliable extension of your HR function.
            </p>
          </div>
          
          <div className="about-meaning card">
            <h3>What ELVO Means</h3>
            <ul className="meaning-list">
              <li><strong>E – Empowering:</strong> Helping individuals realize their full potential.</li>
              <li><strong>L – Lives:</strong> Supporting employees in building rewarding journeys.</li>
              <li><strong>V – Valuing:</strong> Recognizing that every employee deserves respect.</li>
              <li><strong>O – Organizations:</strong> Partnering with businesses to build resilient teams.</li>
            </ul>
          </div>
        </div>

        <div className="vision-mission-grid">
          <div className="vm-card card text-center">
            <div className="icon-wrapper"><Target size={40} /></div>
            <h3>Our Mission</h3>
            <p>To empower organizations through strategic human resource solutions while creating meaningful career opportunities for individuals. We strive to deliver excellence through integrity, innovation, collaboration, and an unwavering commitment to client success.</p>
          </div>
          
          <div className="vm-card card text-center">
            <div className="icon-wrapper"><Lightbulb size={40} /></div>
            <h3>Our Vision</h3>
            <p>To become one of India's most trusted and respected HR solutions companies by delivering innovative, people-centric workforce solutions that create lasting value for businesses and professionals.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
