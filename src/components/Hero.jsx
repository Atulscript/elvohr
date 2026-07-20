import React from 'react';
import './Hero.css';
import { ArrowRight, Search, Building2, Users2, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-grid-split">
          
          <div className="hero-text-content">
            <h1 className="animate-fade-in">
              Empowering Lives.<br/>
              <span className="text-accent">Valuing Organizations.</span>
            </h1>
            <p className="hero-subtitle animate-fade-in delay-1">
              Your trusted Human Resources solutions partner. We help businesses attract, manage, and retain talent while enabling professionals to build meaningful careers.
            </p>
            
            <div className="hero-cta animate-fade-in delay-2">
              <Link to="/careers" className="btn btn-secondary">
                Search Jobs <Search size={18} />
              </Link>
              <Link to="/contact" className="btn btn-primary">
                Partner With Us <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          <div className="hero-creative-container animate-fade-in delay-2">
            <img src="/hero-creative.jpg" alt="ELVO HR Connecting Talent" className="hero-creative-image" />
          </div>

        </div>

        <div className="hero-stats animate-fade-in delay-3">
          <div className="stat-item card">
            <Building2 size={32} className="stat-icon" />
            <h3>500+</h3>
            <p>Organizations</p>
          </div>
          <div className="stat-item card">
            <Users2 size={32} className="stat-icon" />
            <h3>10k+</h3>
            <p>Careers Built</p>
          </div>
          <div className="stat-item card">
            <LineChart size={32} className="stat-icon" />
            <h3>15+</h3>
            <p>Industries</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
