import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Users, Camera, Mail } from 'lucide-react';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Home size={18} />
        <span>Home</span>
      </NavLink>
      
      <NavLink to="/services" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Briefcase size={18} />
        <span>Services</span>
      </NavLink>

      <NavLink to="/careers" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Users size={18} />
        <span>Careers</span>
      </NavLink>

      <NavLink to="/life-at-elvo" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Camera size={18} />
        <span>Life</span>
      </NavLink>

      <NavLink to="/contact" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Mail size={18} />
        <span>Contact</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
