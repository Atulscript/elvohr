import React from 'react';
import './LifeAtElvo.css';

const LifeAtElvo = () => {
  const galleryItems = [
    { image: `${import.meta.env.BASE_URL}culture.jpg`, title: "Culture & Events" },
    { image: `${import.meta.env.BASE_URL}retreats.jpg`, title: "Team Celebrations" },
    { image: `${import.meta.env.BASE_URL}environment.jpg`, title: "Work Environment" },
    { image: `${import.meta.env.BASE_URL}hero-creative.jpg`, title: "Connecting Talent" }
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
