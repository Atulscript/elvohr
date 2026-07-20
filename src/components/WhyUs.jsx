import React from 'react';
import './WhyUs.css';
import { CheckCircle } from 'lucide-react';

const WhyUs = () => {
  const points = [
    "Industry expertise combined with personalized service.",
    "Practical, scalable, and compliant HR solutions.",
    "Customized strategies that support long-term business growth.",
    "A trusted extension of your team."
  ];

  return (
    <section className="section why-us-section">
      <div className="container">
        <div className="why-us-content">
          <div className="why-us-text">
            <div className="section-header text-left">
              <h2>Why ELVO HR</h2>
            </div>
            <p className="subtitle text-accent">
              Organizations choose ELVO HR because we combine industry expertise with personalized service to deliver practical, scalable, and compliant HR solutions.
            </p>
            <p>
              Our strength lies in understanding each client's business, culture, and workforce requirements. Rather than offering standard solutions, we build customized strategies that support long-term business growth.
            </p>
            <p>
              Whether it's hiring specialized talent, managing payroll, ensuring statutory compliance, or supporting business expansion through Employer of Record services, ELVO HR becomes a trusted extension of your team.
            </p>
            
            <ul className="why-us-list">
              {points.map((point, index) => (
                <li key={index}>
                  <CheckCircle className="check-icon" size={24} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="why-us-image-container">
            <img src="/why-us.jpg" alt="Partner with ELVO HR" className="why-us-img" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
