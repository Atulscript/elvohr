import React from 'react';
import './Careers.css';
import { Search, Upload, Mail } from 'lucide-react';

const Careers = () => {
  const industries = [
    "Information Technology (IT)", "Banking & Financial Services (BFSI)", 
    "Healthcare & Life Sciences", "Manufacturing", "Automobile", 
    "Retail & E-commerce", "Logistics & Supply Chain", "Engineering", 
    "Telecom", "FMCG", "Pharmaceuticals", "Education", 
    "Hospitality", "Startups & GCCs"
  ];

  const opportunities = [
    "Permanent Jobs", "Contract Jobs", "Remote Jobs", 
    "Hybrid Jobs", "Executive & Leadership Roles", 
    "IT Jobs", "Non-IT Jobs", "Freshers Opportunities", 
    "Internship Programs"
  ];

  return (
    <section id="careers" className="section careers-section">
      <div className="container">
        <div className="section-header text-center">
          <h2>Build Your Future with ELVO HR</h2>
          <p className="subtitle">
            Connecting Exceptional Talent with Great Organizations
          </p>
        </div>

        <div className="careers-intro text-center card">
          <p>
            At ELVO HR, we believe every career has the potential to create a lasting impact. Whether you're a fresh graduate taking your first step, an experienced professional seeking new challenges, or a leader ready to drive transformation, we're here to help you find the right opportunity.
          </p>
          <div className="careers-cta">
            <button className="btn btn-primary"><Search size={18}/> Search Jobs</button>
            <button className="btn btn-secondary"><Upload size={18}/> Upload Resume</button>
            <button className="btn btn-outline"><Mail size={18}/> Connect with Recruiter</button>
          </div>
        </div>

        <div className="careers-grid">
          <div className="careers-list-box card">
            <h3>Find Opportunities Across Industries</h3>
            <ul className="pill-list">
              {industries.map((ind, i) => <li key={i} className="pill">{ind}</li>)}
            </ul>
          </div>
          
          <div className="careers-list-box card">
            <h3>Explore Opportunities</h3>
            <ul className="pill-list">
              {opportunities.map((opp, i) => <li key={i} className="pill">{opp}</li>)}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Careers;
