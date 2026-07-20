import React, { useState } from 'react';
import './IndustrySection.css';
import { 
  Landmark, Factory, Cpu, Truck, Radio, ShoppingBag, 
  GraduationCap, Building, Heart, Settings, HardHat, Sprout,
  ChevronLeft, ChevronRight, Quote
} from 'lucide-react';

const IndustrySection = () => {
  const industries = [
    {
      id: 'bfsi',
      name: 'BFSI',
      icon: <Landmark size={22} />,
      colorClass: 'bfsi-theme',
      description: 'Need reliable talent to drive your BFSI operations? We provide top-tier staffing, payroll management, and permanent recruitment solutions to help your financial institution thrive in today\'s dynamic financial landscape.',
      testimonial: {
        quote: 'ELVO HR helped us scale our retail banking division during a critical expansion phase. Their compliant staffing solutions saved us significant time.',
        author: 'Aditya Sharma',
        role: 'Operations Head'
      }
    },
    {
      id: 'industrial',
      name: 'Industrial',
      icon: <Factory size={22} />,
      colorClass: 'industrial-theme',
      description: 'Power your industrial projects with certified skilled workforce. We source production floor executives, site supervisors, and technical workforce to keep your operations running safely and efficiently.',
      testimonial: {
        quote: 'Their deep understanding of industrial labor compliance made partnering with ELVO HR an easy decision for our new manufacturing plant.',
        author: 'Rajesh Mehta',
        role: 'Plant Director'
      }
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: <Cpu size={22} />,
      colorClass: 'tech-theme',
      description: 'Stay ahead of the tech curve. We recruit elite software developers, systems architects, product managers, and IT support teams tailored for startups and global capability centers.',
      testimonial: {
        quote: 'Finding specialized AI engineers was a hurdle until we engaged ELVO. They brought us qualified candidates within two weeks.',
        author: 'Nisha Rao',
        role: 'VP of Engineering'
      }
    },
    {
      id: 'logistic',
      name: 'SCM/Logistic',
      icon: <Truck size={22} />,
      colorClass: 'logistic-theme',
      description: 'Optimize your supply chain. We deliver end-to-end recruitment for warehouse managers, dispatch officers, fleet supervisors, and last-mile delivery workforce.',
      testimonial: {
        quote: 'During festive season demand spikes, ELVO HR sourced over 200 contract workers in record time, keeping our logistics seamless.',
        author: 'Vikram Singh',
        role: 'Supply Chain VP'
      }
    },
    {
      id: 'telecom',
      name: 'Telecom',
      icon: <Radio size={22} />,
      colorClass: 'telecom-theme',
      description: 'Deploy networks seamlessly. We recruit highly capable network engineers, field executives, and customer relations teams for leading telecom providers.',
      testimonial: {
        quote: 'ELVO\'s staffing solutions for our fiber rollouts ensured our field operations were completed well ahead of the deadline.',
        author: 'Amit Verma',
        role: 'Infrastructure Lead'
      }
    },
    {
      id: 'ecommerce',
      name: 'Ecommerce',
      icon: <ShoppingBag size={22} />,
      colorClass: 'ecommerce-theme',
      description: 'Fuel your digital store growth. We supply digital marketers, customer support associates, catalog specialists, and inventory management talent.',
      testimonial: {
        quote: 'Their E-commerce support personnel have helped us maintain our 5-star customer experience rating during high volume sales.',
        author: 'Priya Iyer',
        role: 'Customer Support Lead'
      }
    },
    {
      id: 'education',
      name: 'Education',
      icon: <GraduationCap size={22} />,
      colorClass: 'education-theme',
      description: 'Empower minds with premier educators. We source administration heads, professors, subject matter experts, and academic counselors for institutions.',
      testimonial: {
        quote: 'Recruiting qualified professors was streamlined. Their candidate filtering matched our academic requirements perfectly.',
        author: 'Dr. Sandeep K.',
        role: 'Dean of Academics'
      }
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      icon: <Building size={22} />,
      colorClass: 'infra-theme',
      description: 'Construct the future with expert talent. We source civil engineers, safety officers, project managers, and operations personnel for large-scale infra development.',
      testimonial: {
        quote: 'A reliable workforce partner is crucial for infrastructure projects. ELVO\'s compliance checks are robust and stress-free.',
        author: 'Rohan Joshi',
        role: 'Project Director'
      }
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: <Heart size={22} />,
      colorClass: 'health-theme',
      description: 'Provide exceptional care with premium medical professionals. We recruit nurses, medical lab technicians, admin heads, and operational support staff.',
      testimonial: {
        quote: 'ELVO HR sourced experienced laboratory technicians quickly, ensuring our diagnostics center met immediate clinical demands.',
        author: 'Dr. Anjali Sen',
        role: 'Medical Director'
      }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      icon: <Settings size={22} />,
      colorClass: 'manufacturing-theme',
      description: 'Optimize manufacturing output. We supply assembly line personnel, quality assurance testers, shift coordinators, and maintenance engineers.',
      testimonial: {
        quote: 'Partnering with ELVO HR for factory personnel has significantly reduced our hiring turnaround time.',
        author: 'Sanjay Gupta',
        role: 'Operations VP'
      }
    },
    {
      id: 'construction',
      name: 'Construction',
      icon: <HardHat size={22} />,
      colorClass: 'construction-theme',
      description: 'Accelerate building timelines safely. We connect you with site managers, safety supervisors, structural consultants, and heavy machinery operators.',
      testimonial: {
        quote: 'Their structural recruitment team understood the exact skills needed for our commercial high-rise projects.',
        author: 'Alok Trivedi',
        role: 'Construction Head'
      }
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      icon: <Sprout size={22} />,
      colorClass: 'agriculture-theme',
      description: 'Innovate your agricultural operations. We deliver talent for agricultural research, farm management, agrochemical sales, and supply chain logistics.',
      testimonial: {
        quote: 'Finding agronomists who are ready for field deployment was simplified thanks to ELVO\'s comprehensive database.',
        author: 'Harpreet Singh',
        role: 'Agro Operations Head'
      }
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndustry = industries[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % industries.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + industries.length) % industries.length);
  };

  return (
    <section className="section modern-industry-section">
      <div className="container">
        
        <div className="section-header text-center">
          <h2>We know your <span className="text-accent">Industry</span></h2>
          <p className="subtitle">Interactive industry-focused workforce solutions matching elite talent with leading sectors.</p>
        </div>

        {/* 1. Horizontal Scrollable Navigation Tab Bar */}
        <div className="industry-tab-scroller">
          <div className="industry-tabs-container">
            {industries.map((ind, idx) => (
              <button 
                key={ind.id} 
                className={`industry-tab-btn ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <span className="tab-icon">{ind.icon}</span>
                <span className="tab-text">{ind.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Split Screen Showcase Panel */}
        <div className="industry-showcase-panel card">
          {/* Left Column: Visual Brand Box with dynamic gradients */}
          <div className={`showcase-visual-box ${activeIndustry.colorClass}`}>
            <div className="visual-graphic-glow"></div>
            <div className="visual-icon-large">
              {activeIndustry.icon}
            </div>
            <h3 className="visual-title">{activeIndustry.name} Solutions</h3>
          </div>

          {/* Right Column: Descriptions and Quote details */}
          <div className="showcase-content-box">
            <div className="showcase-header">
              <span className="industry-tag">Sector Profile</span>
              <h2>{activeIndustry.name}</h2>
            </div>
            
            <p className="industry-description">{activeIndustry.description}</p>
            
            <div className="showcase-testimonial">
              <Quote className="quote-mark-icon" size={32} />
              <blockquote className="quote-text">
                "{activeIndustry.testimonial.quote}"
              </blockquote>
              
              <div className="showcase-testimonial-footer">
                <div className="author-meta">
                  <strong>{activeIndustry.testimonial.author}</strong>
                  <span>{activeIndustry.testimonial.role}</span>
                </div>
                
                <div className="slider-controls">
                  <button className="slider-btn" onClick={handlePrev} aria-label="Previous Industry">
                    <ChevronLeft size={18} />
                  </button>
                  <button className="slider-btn" onClick={handleNext} aria-label="Next Industry">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default IndustrySection;
