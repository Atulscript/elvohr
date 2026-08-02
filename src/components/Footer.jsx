import React, { useState } from 'react';
import './Footer.css';
import logoImg from '../assets/logo.png';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showExpertise, setShowExpertise] = useState(false);

  const expertiseLinks = [
    "Staffing Companies in India", "Contract Staffing Services", "Contract Staffing in India",
    "Temporary Staffing Agencies", "Placement Agencies in India", "Job Recruitment Agencies",
    "Top Managed Service Providers", "Top Consulting Firms in India", "Top HR Consultancy",
    "Compliance Management Services", "Permanent Recruitment Services", "Recruitment Agencies"
  ];

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Row */}
        <div className="footer-main-grid">
          {/* Column 1: Address */}
          <div className="footer-col office-col">
            <div className="footer-logo-container">
              <img src={logoImg} alt="ELVO HR Logo" className="footer-logo-img" />
            </div>
            <div className="office-details">
              <h4>Registered Office</h4>
              <p>ELVO HR Services Pvt. Ltd.</p>
              <p>Pocket D, Okhla phase-2,</p>
              <p>Delhi - 110020</p>
              <p className="cin-text">CIN No: U74900MH2016PTC273940</p>
            </div>
          </div>

          {/* Column 2: Links & Button */}
          <div className="footer-col links-col">
            <h3>Important Links</h3>
            <div className="links-subgrid">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><a href="#">CSR</a></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
              <ul>
                <li><Link to="/services">Permanent Recruitment</Link></li>
                <li><Link to="/services">Managed Services</Link></li>
                <li><Link to="/services">Compliance Management</Link></li>
                <li><Link to="/services">General Staffing</Link></li>
              </ul>
            </div>
            
            <a href="#" className="associate-btn">
              Training for Associates <ArrowRight size={18} />
            </a>
          </div>

          {/* Column 3: Contact Box (Dotted Outline) */}
          <div className="footer-col contact-box">
            <div className="contact-box-inner">
              <div className="contact-item">
                <Phone size={20} className="icon" />
                <div>
                  <h4>Contact</h4>
                  <p>Toll Free : 1800 22 4456</p>
                </div>
              </div>
              
              <div className="contact-item">
                <Mail size={20} className="icon" />
                <div>
                  <h4>Email</h4>
                  <p>Sales Query: <a href="mailto:sales@elvohr.com">sales@elvohr.com</a></p>
                  <p>Associates: <a href="mailto:ar@elvohr.com">ar@elvohr.com</a></p>
                  <p>Jobs: <a href="mailto:jobs@elvohr.com">jobs@elvohr.com</a></p>
                </div>
              </div>
            </div>
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
          <div className="platform-logo">
            <h3>ELVO <span>Group</span></h3>
            <p>Building Partnerships, Creating Value</p>
          </div>
          <div className="platform-desc">
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
            <Link to="/terms">Terms of Use</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>

          <div className="bottom-socials">
            <a href="#" aria-label="LinkedIn"><FaLinkedin size={18} /></a>
            <a href="#" aria-label="Twitter"><FaTwitter size={18} /></a>
            <a href="#" aria-label="Facebook"><FaFacebook size={18} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" aria-label="YouTube"><FaYoutube size={18} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
