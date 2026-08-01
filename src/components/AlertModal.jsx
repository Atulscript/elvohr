import React from 'react';
import { X, Briefcase } from 'lucide-react';
import './AlertModal.css';

const AlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div 
        className="alert-modal-content card animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="alert-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="alert-modal-icon-wrapper">
          <Briefcase size={36} className="alert-modal-icon" />
          <div className="alert-modal-icon-pulse"></div>
        </div>

        <h3 className="alert-modal-title">Job Search Portal</h3>
        <span className="alert-modal-badge">COMING SOON</span>

        <p className="alert-modal-description">
          We are currently building a powerful job search platform to connect you with leading organizations. 
        </p>
        
        <p className="alert-modal-subtext">
          In the meantime, you can upload your resume on the Careers page or connect with our recruiting specialists directly.
        </p>

        <div className="alert-modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
