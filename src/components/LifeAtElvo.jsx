import React from 'react';
import './LifeAtElvo.css';

const LifeAtElvo = () => {
  const galleryItems = [
    { image: `${import.meta.env.BASE_URL}life-office.png`, title: "Modern Office Workspace" },
    { image: `${import.meta.env.BASE_URL}life-coffee.png`, title: "Collaborative Culture" },
    { image: `${import.meta.env.BASE_URL}life-laptop.png`, title: "Team Synergy" },
    { image: `${import.meta.env.BASE_URL}life-cheer.jpg`, title: "Employee Celebrations" }
  ];

  return (
    <section id="life" className="section life-section">
      <div className="container">
        <div className="section-header text-center">
          <h2>Life at ELVO HR</h2>
          <p className="subtitle">
            Culture, Celebrations, and the People who make it happen.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <div key={index} className={`gallery-item item-${index + 1}`}>
              <img src={item.image} alt={item.title} className="gallery-img" />
              <div className="gallery-overlay">
                <span className="gallery-title">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifeAtElvo;
