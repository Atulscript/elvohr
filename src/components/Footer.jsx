import React, { useState } from 'react';
import './Footer.css';
import logoImg from '../assets/logo-footer.png';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showExpertise, setShowExpertise] = useState(false);
  const [showBranding, setShowBranding] = useState(false);

  const expertiseLinks = [
    "Staffing Companies in India", "Contract Staffing Services", "Contract Staffing in India",
    "Temporary Staffing Agencies", "Placement Agencies in India", "Job Recruitment Agencies",
    "Top Managed Service Providers", "Top Consulting Firms in India", "Top HR Consultancy",
    "Compliance Management Services", "Permanent Recruitment Services", "Recruitment Agencies"
  ];

  return (
    <footer className="footer">
      <div className="container">
        {/* 4-Column Grid */}
        <div className="footer-grid">
          
          {/* Column 1: Logo & Socials */}
          <div className="footer-col col-info">
            <div className="footer-logo-container">
              <img src={logoImg} alt="ELVO HR Logo" className="footer-logo-img" />
            </div>
            <p className="footer-desc">
              Your trusted partner for end-to-end HR solutions. Empowering lives. Valuing organizations.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="LinkedIn"><FaLinkedin size={18} /></a>
              <a href="#" aria-label="Twitter"><FaTwitter size={18} /></a>
              <a href="#" aria-label="Facebook"><FaFacebook size={18} /></a>
              <a href="#" aria-label="Instagram"><FaInstagram size={18} /></a>
              <a href="#" aria-label="YouTube"><FaYoutube size={18} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/life-at-elvo">Life at ELVO</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="footer-col">
            <h3>Our Services</h3>
            <ul className="footer-links">
              <li><Link to="/services">Recruitment & Staffing</Link></li>
              <li><Link to="/services">Payroll Management</Link></li>
              <li><Link to="/services">Compliance Services</Link></li>
              <li><Link to="/services">Candidate Engagement & Success</Link></li>
              <li><Link to="/services">HR Operations</Link></li>
              <li><Link to="/services">Custom Solutions</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="footer-col col-contact">
            <h3>Contact Us</h3>
            <ul className="contact-details">
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>Pocket D, Okhla phase-2, Delhi - 110020</span>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <span>Toll Free: 1800 22 4456</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <a href="mailto:info@elvohr.com">info@elvohr.com</a>
              </li>
            </ul>
            <a href="#" className="associate-btn-compact">
              Training for Associates <ArrowRight size={14} />
            </a>
          </div>

        </div>

        {/* Areas of Expertise Collapse Section */}
        <div className="expertise-section">
          <button 
            className="expertise-toggle" 
            onClick={() => setShowExpertise(!showExpertise)}
          >
            Areas of Expertise {showExpertise ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <div className={`expertise-content ${showExpertise ? 'show' : ''}`}>
            <ul className="expertise-list">
              {expertiseLinks.map((link, i) => (
                <li key={i}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Platform/First Meridian Branding Section */}
        <div className="platform-branding-section">
          <div 
            className="platform-logo" 
            onClick={() => setShowBranding(!showBranding)}
          >
            <div className="logo-title-row">
              <h3>ELVO <span>Group</span></h3>
              <span className="mobile-toggle-icon">
                {showBranding ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>
            <p>Building Partnerships, Creating Value</p>
          </div>
          <div className={`platform-desc ${showBranding ? 'show-mobile' : ''}`}>
            <p>
              We are a growing Human Resources solutions company dedicated to helping organizations build high-performing teams and empowering professionals with meaningful career opportunities. We offer end-to-end HR solutions, including Recruitment, Staffing, Payroll, HR Operations, Compliance, and HR Consulting, tailored to the unique needs of businesses across industries. With a people-first approach, industry expertise, and a commitment to quality, integrity, and innovation, we strive to become a trusted HR partner, delivering solutions that enable organizations and individuals to grow together.
            </p>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            Copyright &copy; {new Date().getFullYear()} ELVO HR Services Pvt. Ltd. All Rights Reserved.
          </p>
          
          <div className="bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="divider">|</span>
            <Link to="/terms">Terms of Use</Link>
            <span className="divider">|</span>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
