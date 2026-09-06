import React, { useState } from 'react';
import { X, MapPin, Clock, IndianRupee, CheckCircle2, Award, Calendar, ArrowRight, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import './JobDetailModal.css';

const JobDetailModal = ({ job, isOpen, onClose, onApply, onShare }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/careers/${job.id}` : '';

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const shareWhatsApp = () => {
    const text = `Explore this career opening at ELVO HR: *${job.title}* (${job.location})\nApply here: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div 
        className="job-modal-card animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-job-title"
      >
        <button className="job-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="job-modal-header">
          <div className="job-badge-row">
            <span className="job-badge job-badge-dept">{job.department}</span>
            <span className="job-badge job-badge-type">{job.type}</span>
            {job.status === 'Active' ? (
              <span className="job-badge job-badge-status-active">Actively Hiring</span>
            ) : (
              <span className="job-badge job-badge-status-closed">Closed</span>
            )}
          </div>
          <h2 id="modal-job-title" className="job-modal-title">{job.title}</h2>
          
          <div className="job-meta-grid">
            <div className="job-meta-item">
              <MapPin size={16} className="meta-icon" />
              <span>{job.location}</span>
            </div>
            <div className="job-meta-item">
              <Clock size={16} className="meta-icon" />
              <span>{job.experience}</span>
            </div>
            <div className="job-meta-item">
              <IndianRupee size={16} className="meta-icon" />
              <span>{job.salary}</span>
            </div>
            {job.postedDate && (
              <div className="job-meta-item">
                <Calendar size={16} className="meta-icon" />
                <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Direct Share Bar */}
          <div className="job-share-strip">
            <span className="share-strip-label"><Share2 size={13} /> Share opening:</span>
            <div className="share-strip-actions">
              <button 
                className={`share-btn-pill ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
                title="Copy direct shareable link"
              >
                {copied ? <><Check size={13} /> Copied Link!</> : <><Copy size={13} /> Copy Link</>}
              </button>
              <button 
                className="share-btn-pill whatsapp"
                onClick={shareWhatsApp}
                title="Share on WhatsApp"
              >
                WhatsApp
              </button>
              <button 
                className="share-btn-pill linkedin"
                onClick={shareLinkedIn}
                title="Share on LinkedIn"
              >
                LinkedIn
              </button>
            </div>
          </div>
        </div>

        <div className="job-modal-body">
          {job.overview && (
            <div className="job-section">
              <h3 className="job-section-title">About the Role</h3>
              <p className="job-overview-text">{job.overview}</p>
            </div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="job-section">
              <h3 className="job-section-title">Key Responsibilities</h3>
              <ul className="job-bullets">
                {job.responsibilities.map((resp, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} className="bullet-icon" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className="job-section">
              <h3 className="job-section-title">Who We're Looking For</h3>
              <ul className="job-bullets">
                {job.requirements.map((req, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} className="bullet-icon req-bullet" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="job-section">
              <h3 className="job-section-title">Perks & Benefits</h3>
              <div className="job-perks-wrap">
                {job.benefits.map((ben, i) => (
                  <div key={i} className="job-perk-pill">
                    <Award size={14} />
                    <span>{ben}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="job-modal-footer">
          <div className="footer-note">
            Job ID: <strong>{job.id}</strong> • Direct hiring via ELVO HR
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
            <button 
              className="btn btn-primary"
              disabled={job.status !== 'Active'}
              onClick={() => {
                onClose();
                onApply(job);
              }}
            >
              Apply for this Role <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
