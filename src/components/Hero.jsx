import React, { useContext } from 'react';
import './Hero.css';
import { ArrowRight, Search, Building2, Users2, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlertContext } from '../App';

const Hero = () => {
  const openAlert = useContext(AlertContext);

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-grid-split">
          
          <div className="hero-text-content">
            <h1 className="animate-fade-in">
              <span>Empowering <span className="text-accent">Lives.</span></span><br/>
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                Valuing <span className="text-accent">Organizations.</span>
              </span>
            </h1>
            <p className="hero-subtitle animate-fade-in delay-1">
              Your trusted Human Resources solutions partner. We help businesses attract, manage, and retain talent while enabling professionals to build meaningful careers.
            </p>
            
            <div className="hero-cta animate-fade-in delay-2">
              <button onClick={openAlert} className="btn btn-primary">
                Search Jobs <Search size={18} />
              </button>
              <Link to="/contact" className="btn btn-secondary">
                Business Enquiries <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          <div className="hero-creative-container animate-fade-in delay-2">
            <img src={`${import.meta.env.BASE_URL}hero-creative.png`} alt="ELVO HR Connecting Talent" className="hero-creative-image" />
          </div>

        </div>

        <div className="hero-stats animate-fade-in delay-3">
          <div className="stat-item card">
            <div className="stat-icon-circle">
              <Building2 size={32} className="stat-icon" />
            </div>
            <div className="stat-text">
              <h3>50+</h3>
              <p>Organizations</p>
            </div>
          </div>
          <div className="stat-item card">
            <div className="stat-icon-circle">
              <Users2 size={32} className="stat-icon" />
            </div>
            <div className="stat-text">
              <h3>1k+</h3>
              <p>Careers Built</p>
            </div>
          </div>
          <div className="stat-item card">
            <div className="stat-icon-circle">
              <LineChart size={32} className="stat-icon" />
            </div>
            <div className="stat-text">
              <h3>15+</h3>
              <p>Industries</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
