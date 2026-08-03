import React, { useState, useEffect } from 'react';
import { 
  MapPin, Users, LogIn, ChevronDown, 
  Home as HomeIcon, Briefcase, Info, Camera, Mail
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Utility Bar */}
      <div className="top-bar">
        <div className="container top-bar-container">
          <div className="top-bar-right">
            <Link to="/contact" className="top-tab-white">Request Talent</Link>
            <Link to="/contact" className="top-link"><MapPin size={13} /> Office Locations</Link>
            <Link to="/contact" className="top-link"><Users size={13} /> Associate Support</Link>
            <a href="#" className="top-link login-link"><LogIn size={13} /> Associate Login</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container nav-container">
          <NavLink to="/" className="logo-link">
            <img src={logoImg} alt="ELVO HR Logo" className="logo-img" />
          </NavLink>
          
          {/* Desktop Navigation links with Icons */}
          <div className="desktop-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
              <HomeIcon size={16} className="nav-icon-inline" /> Home
            </NavLink>
            
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <NavLink to="/services" className={({ isActive }) => `dropdown-trigger ${isActive ? "active-link" : ""}`}>
                <Briefcase size={16} className="nav-icon-inline" /> Our Services <ChevronDown size={12} className={`caret-icon ${servicesDropdownOpen ? 'rotated' : ''}`} />
              </NavLink>
              <div className={`dropdown-menu ${servicesDropdownOpen ? 'show' : ''}`}>
                <Link to="/services">Recruitment & Staffing</Link>
                <Link to="/services">Payroll Management</Link>
                <Link to="/services">Compliance Services</Link>
                <Link to="/services">Candidate Engagement & Success</Link>
                <Link to="/services">HR Operations</Link>
                <Link to="/services">Custom Solutions</Link>
              </div>
            </div>

            <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>
              <Info size={16} className="nav-icon-inline" /> About Us
            </NavLink>
            <NavLink to="/careers" className={({ isActive }) => isActive ? "active-link" : ""}>
              <Users size={16} className="nav-icon-inline" /> Careers
            </NavLink>
            <NavLink to="/life-at-elvo" className={({ isActive }) => isActive ? "active-link" : ""}>
              <Camera size={16} className="nav-icon-inline" /> Life at ELVO
            </NavLink>
          </div>

          {/* Actions: Contact Us CTA */}
          <div className="nav-actions">
            <NavLink to="/contact" className="btn btn-primary nav-cta">
              <Mail size={16} /> Contact Us
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
