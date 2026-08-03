import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Search, ArrowRight } from 'lucide-react';
import { AlertContext } from '../App';
import './CtaBanner.css';

const CtaBanner = () => {
  const openAlert = useContext(AlertContext);

  return (
    <section className="cta-banner-section">
      <div className="container">
        <div className="cta-banner-card">
          <div className="cta-banner-left">
            <div className="cta-icon-circle">
              <Headphones size={42} className="cta-phone-icon" />
            </div>
            <div className="cta-text-content">
              <h3>Looking for the right talent or your next opportunity?</h3>
              <p>We're here to help you take the next step.</p>
            </div>
          </div>
          <div className="cta-banner-right">
            <button onClick={openAlert} className="cta-btn cta-btn-white">
              Search Jobs <Search size={18} />
            </button>
            <Link to="/contact" className="cta-btn cta-btn-outline">
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
