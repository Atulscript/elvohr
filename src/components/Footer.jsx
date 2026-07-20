import React, { useState } from 'react';
import './Footer.css';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showExpertise, setShowExpertise] = useState(false);

  const expertiseLinks = [
    "Staffing Companies in India", "Contract Staffing Services", "Contract Staffing in India",
    "Temporary Staffing Agencies", "Placement Agencies in India", "Job Recruitment Agencies",
    "Top Managed Service Providers", "Top Consulting Firms in India", "Top HR Consultancy",
    "Facility Management Services Provider", "Permanent Recruitment Services", "Recruitment Agencies"
  ];

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Row */}
        <div className="footer-main-grid">
          {/* Column 1: Address */}
          <div className="footer-col office-col">
            <h2 className="logo">ELVO <span>HR</span></h2>
            <div className="office-details">
              <h4>Registered Office</h4>
              <p>ELVO HR Services Pvt. Ltd.</p>
              <p>Unit No 401, OM Sadan, Mehra Industrial Estate,</p>
              <p>Lal Bahadur Shastri Marg, Behind Jaswanti Landmark,</p>
              <p>Vikhroli West, Mumbai, Maharashtra - 400079</p>
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
                <li><a href="#">Blogs</a></li>
              </ul>
              <ul>
                <li><Link to="/services">Permanent Recruitment</Link></li>
                <li><Link to="/services">Managed Services</Link></li>
                <li><Link to="/services">Facility Management</Link></li>
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
            <h3>ELVO <span>Global</span></h3>
            <p>Building Partnerships, Creating Value</p>
          </div>
          <div className="platform-desc">
            <p>
              We are a human resources investment platform formed by world-renowned investors with the objective to deliver end-to-end HR solutions and build a winning workforce that thrives in change. We provide work to 126,824 people who serve 1200+ clients across 3500+ locations through our branch network. Our customers span across industry sectors, including Telecom, Retail, BFSI, IT, ITES, E-Commerce, Manufacturing, Engineering and Logistics. <a href="#" className="read-more">Know More</a>
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
            <a href="#"><FaLinkedin size={18} /></a>
            <a href="#"><FaTwitter size={18} /></a>
            <a href="#"><FaFacebook size={18} /></a>
            <a href="#"><FaInstagram size={18} /></a>
            <a href="#"><FaYoutube size={18} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
