import React from 'react';
import './Values.css';

const Values = () => {
  const values = [
    { title: "Integrity", desc: "We uphold the highest ethical standards in every interaction, building relationships based on honesty, transparency, and trust." },
    { title: "Excellence", desc: "We continuously pursue quality and operational excellence to deliver exceptional outcomes for our clients and candidates." },
    { title: "Innovation", desc: "We embrace technology and creative thinking to develop smarter, more efficient HR solutions." },
    { title: "Collaboration", desc: "We believe the strongest results come from working closely with our clients, candidates, and partners." },
    { title: "Accountability", desc: "We take ownership of our commitments and consistently deliver on our promises." },
    { title: "People First", desc: "Every decision we make is guided by our belief that people are the most valuable asset of any organization." },
  ];

  return (
    <section className="section values-section">
      <div className="container">
        <div className="section-header text-center">
          <h2>Our Core Values</h2>
        </div>
        
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-item card">
              <h3 className="value-title">{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
