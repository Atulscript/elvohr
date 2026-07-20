import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div className="section-header text-center">
          <h2>Contact Us</h2>
          <p className="subtitle">Get in touch with our HR consultants and hiring team.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info card">
            <h3>Get in Touch</h3>
            <p>Whether you're looking for stellar talent or your next career path, ELVO HR is here to support you.</p>
            
            <ul className="info-list">
              <li><MapPin className="icon" /> <span>123 Business Hub, New Delhi, India</span></li>
              <li><Phone className="icon" /> <span>+91 98765 43210</span></li>
              <li><Mail className="icon" /> <span>contact@elvohr.com</span></li>
            </ul>
          </div>

          <div className="contact-form-container card">
            {submitted ? (
              <div className="success-message">
                <h3>Thank you!</h3>
                <p>Your message has been received. Our team will get back to you shortly.</p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit Inquiry <Send size={18} /></button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
