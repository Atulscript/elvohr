import React from 'react';
import { useLocation } from 'react-router-dom';
import './LegalPage.css';

const LegalPage = () => {
  const { pathname } = useLocation();

  const getContent = () => {
    switch (pathname) {
      case '/privacy':
        return {
          title: 'Privacy Policy',
          lastUpdated: 'July 2026',
          sections: [
            {
              heading: '1. Information We Collect',
              text: 'ELVO HR Services collects personal information that you provide voluntarily when submitting requests, registering for services, or applying for jobs. This information may include your name, email address, phone number, work experience, resume details, and professional qualifications.'
            },
            {
              heading: '2. How We Use Your Information',
              text: 'We use the collected information to process job applications, manage payroll services, connect talent with enterprise partners, respond to inquiries, and comply with statutory employment and tax laws in active regions.'
            },
            {
              heading: '3. Data Security',
              text: 'We deploy administrative, technical, and physical security measures designed to protect your personal data against unauthorized access, loss, alteration, or disclosure. However, no electronic transmission over the internet can be guaranteed 100% secure.'
            },
            {
              heading: '4. Third-Party Sharing',
              text: 'We do not sell or rent your personal information to third parties. We share data only with trusted partner enterprises (for recruitment purposes) and regulatory authorities (for tax and employment compliance) under strict confidentiality agreements.'
            }
          ]
        };
      case '/terms':
        return {
          title: 'Terms of Use',
          lastUpdated: 'July 2026',
          sections: [
            {
              heading: '1. Acceptance of Terms',
              text: 'By accessing or using the ELVO HR website and recruiting platform, you agree to be bound by these Terms of Use and all applicable local labor and data protection laws.'
            },
            {
              heading: '2. Scope of Services',
              text: 'ELVO HR provides permanent recruitment, temporary staffing, payroll administration, and employer of record (EOR) services. All job listings and recruitment information are subject to change without prior notice.'
            },
            {
              heading: '3. User Account Responsibilities',
              text: 'If you register on our platform as an associate or enterprise partner, you are responsible for maintaining the confidentiality of your credentials and all activities occurring under your account.'
            },
            {
              heading: '4. Intellectual Property Rights',
              text: 'All branding elements, designs, text, icons, graphics, and code on this site are the exclusive intellectual property of ELVO HR Services Pvt. Ltd. and are protected by international trademark and copyright laws.'
            }
          ]
        };
      case '/cookies':
        return {
          title: 'Cookie Policy',
          lastUpdated: 'July 2026',
          sections: [
            {
              heading: '1. What Are Cookies?',
              text: 'Cookies are small text files stored on your computer or mobile device when you browse websites. They are widely used to make websites work efficiently, as well as to provide analytical information to site owners.'
            },
            {
              heading: '2. How We Use Cookies',
              text: 'ELVO HR uses cookies to understand how visitors interact with our pages, remember language preferences, manage secure logged-in sessions for talent associates, and optimize recruitment search performance.'
            },
            {
              heading: '3. Types of Cookies We Deploy',
              text: 'We use Essential Cookies (required for site functionality), Analytical Cookies (to track visitor analytics via Google/LinkedIn tags), and Preference Cookies (to remember login sessions and regional settings).'
            },
            {
              heading: '4. Managing Cookie Preferences',
              text: 'Most web browsers allow you to block or delete cookies through browser configuration panels. Please note that blocking essential cookies may affect the usability of the online login and job application systems.'
            }
          ]
        };
      default:
        return {
          title: 'Legal Notice',
          lastUpdated: 'July 2026',
          sections: [
            {
              heading: 'General Terms',
              text: 'Please choose a valid legal document from the page footer.'
            }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <div className="legal-page-wrapper section">
      <div className="container">
        <div className="legal-card card">
          <h1 className="legal-title">{content.title}</h1>
          <p className="legal-meta">Last updated: {content.lastUpdated}</p>
          <div className="legal-content">
            {content.sections.map((sec, idx) => (
              <div className="legal-section" key={idx}>
                <h3>{sec.heading}</h3>
                <p>{sec.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
