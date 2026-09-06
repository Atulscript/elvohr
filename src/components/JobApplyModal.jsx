import React, { useState, useRef } from 'react';
import { 
  X, UploadCloud, FileText, CheckCircle, AlertCircle, 
  Loader2, User, Mail, Phone, GraduationCap, Briefcase, Link as LinkIcon, Send 
} from 'lucide-react';
import { submitApplication } from '../services/jobPortalService';
import './JobApplyModal.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const JobApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    degree: '',
    experience: 'Fresher / College Student',
    portfolioUrl: '',
    coverNote: ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccessData, setSubmitSuccessData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const jobTitle = job ? job.title : 'General Open Application';
  const jobId = job ? job.id : 'GENERAL';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = (file) => {
    if (!file) return false;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    // Check extension fallback if mime type is missing or generic
    const extension = file.name.split('.').pop().toLowerCase();
    const isExtAllowed = ['pdf', 'doc', 'docx'].includes(extension);

    if (!allowedTypes.includes(file.type) && !isExtAllowed) {
      setFileError('Please upload a valid PDF or Word document (.pdf, .doc, .docx)');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return false;
    }

    setFileError('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && validateFile(file)) {
      setResumeFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!resumeFile) {
      setFileError('Resume upload is required to submit your application.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitApplication({
        ...formData,
        jobId,
        jobTitle,
        resumeFile
      });

      if (res && res.success) {
        setSubmitSuccessData(res);
        if (onSuccess) onSuccess();
      } else {
        setSubmitError(res?.error || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setSubmitError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setFormData({
      candidateName: '',
      email: '',
      phone: '',
      degree: '',
      experience: 'Fresher / College Student',
      portfolioUrl: '',
      coverNote: ''
    });
    setResumeFile(null);
    setFileError('');
    setSubmitError('');
    setSubmitSuccessData(null);
    onClose();
  };

  return (
    <div className="apply-modal-overlay" onClick={resetModal}>
      <div 
        className="apply-modal-card animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="apply-modal-title"
      >
        <button className="apply-modal-close" onClick={resetModal} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitSuccessData ? (
          <div className="apply-success-view text-center">
            <div className="success-check-circle">
              <CheckCircle size={56} className="text-success" />
            </div>
            <h2 className="success-title">Application Submitted!</h2>
            <p className="success-subtitle">
              Thank you for applying for <strong>{jobTitle}</strong>. Your profile and resume have been securely dispatched to our hiring team via Google Workspace.
            </p>

            <div className="success-ref-box">
              <span className="ref-label">Application Reference ID:</span>
              <span className="ref-id">{submitSuccessData.applicationId}</span>
            </div>

            <div className="success-timeline">
              <p>✓ Resume uploaded securely to Google Drive</p>
              <p>✓ Application details logged in ELVO HR Talent Portal</p>
              <p>✓ Hiring manager notified for initial review</p>
            </div>

            <button className="btn btn-primary success-done-btn" onClick={resetModal}>
              Close Window
            </button>
          </div>
        ) : (
          <>
            <div className="apply-modal-header">
              <span className="apply-target-badge">Application Form</span>
              <h2 id="apply-modal-title" className="apply-modal-title">
                Apply for {jobTitle}
              </h2>
              <p className="apply-modal-subtitle">
                Fill in your credentials and attach your resume. All details are directly routed to our HR specialists.
              </p>
            </div>

            <form className="apply-modal-body" onSubmit={handleSubmit}>
              {submitError && (
                <div className="apply-alert-error">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="candidateName">
                    <User size={15} /> Full Name <span className="req">*</span>
                  </label>
                  <input
                    id="candidateName"
                    type="text"
                    name="candidateName"
                    placeholder="e.g. Rahul Verma"
                    required
                    value={formData.candidateName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={15} /> Email Address <span className="req">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="e.g. rahul@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={15} /> Phone Number <span className="req">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="e.g. +91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="degree">
                    <GraduationCap size={15} /> College / Degree <span className="req">*</span>
                  </label>
                  <input
                    id="degree"
                    type="text"
                    name="degree"
                    placeholder="e.g. B.Tech / MBA / BBA (2026 Batch)"
                    required
                    value={formData.degree}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="experience">
                    <Briefcase size={15} /> Experience Level
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  >
                    <option value="Fresher / College Student">Fresher / College Student</option>
                    <option value="0 - 1 Year">0 - 1 Year</option>
                    <option value="1 - 3 Years">1 - 3 Years</option>
                    <option value="3 - 5 Years">3 - 5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="portfolioUrl">
                    <LinkIcon size={15} /> LinkedIn / Portfolio URL
                  </label>
                  <input
                    id="portfolioUrl"
                    type="url"
                    name="portfolioUrl"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Resume Upload Dropzone */}
              <div className="form-group">
                <label className="upload-label">
                  <FileText size={15} /> Upload Resume (PDF or DOCX) <span className="req">*</span>
                </label>

                <div 
                  className={`resume-dropzone ${isDragging ? 'dragging' : ''} ${resumeFile ? 'has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                  />

                  {resumeFile ? (
                    <div className="dropzone-file-info">
                      <div className="file-icon-box">
                        <FileText size={28} className="file-icon" />
                      </div>
                      <div className="file-meta">
                        <span className="file-name">{resumeFile.name}</span>
                        <span className="file-size">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-prompt">
                      <UploadCloud size={36} className="upload-icon" />
                      <p className="dropzone-text">
                        <strong>Click to upload</strong> or drag and drop your resume here
                      </p>
                      <span className="dropzone-sub">Supported formats: PDF, DOC, DOCX (Max 5MB)</span>
                    </div>
                  )}
                </div>

                {fileError && <span className="input-error-msg">{fileError}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="coverNote">Note to Hiring Manager (Optional)</label>
                <textarea
                  id="coverNote"
                  name="coverNote"
                  rows={2}
                  placeholder="Tell us why you're a great fit for this role or what excites you about ELVO HR..."
                  value={formData.coverNote}
                  onChange={handleInputChange}
                />
              </div>

              <div className="apply-modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={resetModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button 
                  type="submit" 
                  className="btn btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting to Drive & Sheets...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default JobApplyModal;
