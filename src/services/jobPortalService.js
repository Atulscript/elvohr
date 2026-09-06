// jobPortalService.js - Google Workspace & Local Fallback Service for ELVO HR

const SCRIPT_STORAGE_KEY = 'elvo_google_script_url';
const LOCAL_JOBS_KEY = 'elvo_portal_jobs';
const LOCAL_APPS_KEY = 'elvo_portal_applications';
const LOCAL_ADMINS_KEY = 'elvo_portal_admins';
const CACHE_VERSION_KEY = 'elvo_portal_cache_version';
const CURRENT_CACHE_VERSION = 'v1.3.0_info_admin';

export const DEFAULT_ADMIN_PASSKEY = 'elvo2026';

/**
 * Automatic Cache Manager: Clears stale localStorage caches when version changes
 */
export function checkAndClearStaleCache() {
  try {
    const savedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    if (savedVersion !== CURRENT_CACHE_VERSION) {
      localStorage.removeItem(LOCAL_JOBS_KEY);
      localStorage.removeItem(LOCAL_ADMINS_KEY);
      localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
      console.log(`[Cache Manager] Automatically purged stale cache. Upgraded to ${CURRENT_CACHE_VERSION}`);
    }
  } catch (e) {
    console.warn('[Cache Manager] Cache verification error:', e);
  }
}

// Auto-run on load
checkAndClearStaleCache();

// 1. Rich Admin Users Dataset (Two Roles: Admin and User)
export const INITIAL_ADMINS = [
  {
    email: 'info@elvohr.com',
    password: 'admin123',
    name: 'ELVO HR Superadmin',
    role: 'Admin',
    status: 'Active',
    createdAt: '2026-08-15T00:00:00Z'
  },
  {
    email: 'recruiter@elvohr.com',
    password: 'user123',
    name: 'Rajesh Malhotra',
    role: 'User',
    status: 'Active',
    createdAt: '2026-08-20T00:00:00Z'
  },
  {
    email: 'associate@elvohr.com',
    password: 'user123',
    name: 'Ananya Das',
    role: 'User',
    status: 'Active',
    createdAt: '2026-08-22T00:00:00Z'
  }
];

export function normalizeRole(role) {
  if (!role) return 'User';
  const r = String(role).trim().toLowerCase();
  if (r === 'admin' || r === 'superadmin' || r.includes('admin') || r.includes('director')) return 'Admin';
  return 'User';
}

// 2. Rich Jobs Dataset (8 Comprehensive Real-World Openings)
export const INITIAL_JOBS = [
  {
    id: 'JOB-101',
    title: 'Talent Acquisition Specialist',
    department: 'Human Resources',
    location: 'Delhi / Okhla (Hybrid)',
    type: 'Full-time',
    experience: '1-3 Years',
    salary: '₹4.5L - ₹6.5L P.A.',
    overview: 'Lead end-to-end recruitment drives for premier enterprise clients across IT, Engineering, and BFSI verticals.',
    responsibilities: [
      'Source, screen, and interview qualified candidates for mid-to-senior level client roles.',
      'Coordinate interview schedules with client hiring managers and gather systematic feedback.',
      'Manage offer rollouts, compensation negotiations, and associate pre-boarding documentation.',
      'Build long-term talent pools through LinkedIn Recruiter, job portals, and campus networks.'
    ],
    requirements: [
      'Bachelor’s or Master’s degree in HR, Business Administration, or Psychology.',
      '1 to 3 years of verifiable recruitment or staffing agency experience.',
      'Exceptional verbal and written communication skills in English.',
      'Proficiency in Applicant Tracking Systems (ATS) and advanced spreadsheet reporting.'
    ],
    benefits: [
      'Comprehensive Group Health Insurance',
      'Quarterly Performance Incentive Bonuses',
      'Hybrid Working Model (2 days remote)',
      'Subsidized professional HR certifications'
    ],
    status: 'Active',
    postedDate: '2026-08-20T10:00:00Z'
  },
  {
    id: 'JOB-102',
    title: 'HR Operations & Compliance Intern',
    department: 'Human Resources',
    location: 'Delhi / Okhla (On-site)',
    type: 'Internship',
    experience: 'Freshers / College Students',
    salary: '₹18,000 - ₹22,000 / month',
    overview: 'Kickstart your HR career by working closely with our operations leaders on associate onboarding, statutory compliance, and payroll verification.',
    responsibilities: [
      'Assist in digitizing and auditing new associate background verification (BGV) files.',
      'Support HR associates with ESI, PF, and statutory labor documentation compliance.',
      'Handle employee query desk for basic HR documentation and letters.',
      'Participate in organizing monthly associate engagement activities and workshops.'
    ],
    requirements: [
      'Pursuing or recently completed BBA, MBA (HR), B.Com, or equivalent bachelor degree.',
      'High attention to detail, confidentiality, and data hygiene.',
      'Working knowledge of MS Excel / Google Sheets and Canva is a plus.',
      'Available for a 3 to 6-month full-time internship with high pre-placement offer (PPO) probability.'
    ],
    benefits: [
      'Hands-on mentorship from senior HR directors',
      'Direct conversion to full-time permanent associate role based on performance',
      'Internship completion certificate & letter of recommendation',
      'Daily office refreshments and team lunches'
    ],
    status: 'Active',
    postedDate: '2026-08-24T12:00:00Z'
  },
  {
    id: 'JOB-103',
    title: 'Business Development Executive - Staffing',
    department: 'Sales & Growth',
    location: 'Delhi NCR (Field / Hybrid)',
    type: 'Full-time',
    experience: '1-4 Years',
    salary: '₹5.5L - ₹8.5L P.A. + Uncapped Incentives',
    overview: 'Drive enterprise client acquisition for permanent staffing, contractual deployment, and payroll management contracts.',
    responsibilities: [
      'Identify enterprise corporate prospects, founders, and CHROs in Delhi NCR and north zone.',
      'Pitch ELVO HR services, draft staffing proposals, and negotiate MSAs.',
      'Maintain strong relationship with client HR leaders for repeat hiring mandates.',
      'Collaborate with internal delivery team to ensure prompt fulfillment of client requisitions.'
    ],
    requirements: [
      'Prior experience in B2B corporate sales, recruitment agency sales, or corporate services.',
      'Strong presentation, negotiation, and corporate relationship building abilities.',
      'Self-driven mindset with target-oriented approach.'
    ],
    benefits: [
      'Uncapped revenue-sharing monthly commission structure',
      'Travel and client entertainment allowances',
      'Executive leadership fast-track program'
    ],
    status: 'Active',
    postedDate: '2026-08-28T09:30:00Z'
  },
  {
    id: 'JOB-104',
    title: 'Payroll & Statutory Compliance Analyst',
    department: 'Finance & Compliance',
    location: 'Delhi / Okhla (On-site)',
    type: 'Full-time',
    experience: '2-5 Years',
    salary: '₹5.5L - ₹7.5L P.A.',
    overview: 'Manage monthly multi-client payroll processing, TDS calculations, and labor compliance filings.',
    responsibilities: [
      'Calculate monthly payroll cycles, deductions, overtime, and incentive payouts.',
      'Prepare and file PF, ESI, Professional Tax, and LWF returns within statutory deadlines.',
      'Reconcile payroll register with client finance teams and resolve associate discrepancies.'
    ],
    requirements: [
      'In-depth understanding of Indian labor statutory laws, PF, ESI, Gratuity, and TDS.',
      'Proven expertise with payroll software and advanced Excel (VLOOKUP, INDEX-MATCH, Pivot Tables).',
      'B.Com/M.Com or MBA in Finance.'
    ],
    benefits: [
      'Annual performance bonus',
      'Medical insurance coverage for family',
      '5-day work week'
    ],
    status: 'Active',
    postedDate: '2026-09-01T11:00:00Z'
  },
  {
    id: 'JOB-105',
    title: 'Full Stack Web Developer (Internal Tools)',
    department: 'Information Technology',
    location: 'Delhi / Remote (Hybrid)',
    type: 'Full-time',
    experience: '2-4 Years',
    salary: '₹8.0L - ₹13.0L P.A.',
    overview: 'Architect and scale our internal recruitment ATS, Google Workspace integrations, and associate self-service portals.',
    responsibilities: [
      'Develop modern React.js frontend interfaces and serverless API endpoints.',
      'Integrate third-party job boards, resume parsing APIs, and Google Cloud APIs.',
      'Ensure high standards of data security, responsiveness, and Core Web Vitals.',
      'Collaborate with HR operations to automate candidate communication and scheduling.'
    ],
    requirements: [
      'Strong proficiency in JavaScript (ES6+), React 18/19, Vite, and REST APIs.',
      'Experience with cloud serverless functions or Google Apps Script API integrations.',
      'Good understanding of database schemas and data protection standards.'
    ],
    benefits: [
      'Latest Apple MacBook Pro setup',
      'Flexible working hours & remote flexibility',
      'Annual tech conference and learning sponsorship'
    ],
    status: 'Active',
    postedDate: '2026-09-02T14:00:00Z'
  },
  {
    id: 'JOB-106',
    title: 'Campus Recruitment Coordinator',
    department: 'Human Resources',
    location: 'Delhi NCR (Travel Required)',
    type: 'Full-time',
    experience: '1-3 Years',
    salary: '₹4.0L - ₹5.5L P.A.',
    overview: 'Organize campus placement drives across Tier-1 & Tier-2 colleges in North India for our enterprise client mass-hiring programs.',
    responsibilities: [
      'Establish partnerships with college placement cells and university deans.',
      'Plan logistics, online assessment rounds, and interview panels for campus drives.',
      'Manage on-ground candidate screening and smooth offer letter distribution.',
      'Maintain campus hiring analytics and conversion ratios.'
    ],
    requirements: [
      'High energy with natural public speaking and crowd coordination skills.',
      'Willingness to travel across regional college campuses during placement seasons.',
      'Graduate or Post-graduate degree in any discipline.'
    ],
    benefits: [
      'Comprehensive travel and lodging expense reimbursement',
      'Direct client exposure with Fortune 500 corporate recruiters',
      'Generous placement drive incentives'
    ],
    status: 'Active',
    postedDate: '2026-09-03T10:15:00Z'
  },
  {
    id: 'JOB-107',
    title: 'Senior Technical Recruiter (IT & Cloud Staffing)',
    department: 'Human Resources',
    location: 'Delhi / Hybrid',
    type: 'Full-time',
    experience: '3-6 Years',
    salary: '₹7.5L - ₹11.5L P.A.',
    overview: 'Specialize in placing niche engineering talent (DevOps, Cloud Architects, AI/ML Engineers, and Tech Leads) for Global Capability Centers (GCCs).',
    responsibilities: [
      'Assess deep technical profiles, Github portfolios, and system architecture credentials.',
      'Manage specialized senior tech pipelines with rapid turnaround times.',
      'Engage with senior engineering directors to calibrate niche requisition criteria.'
    ],
    requirements: [
      '3+ years specifically in IT & software engineering recruitment.',
      'Strong familiarity with tech stacks (Java, Python, React, AWS, Azure, Kubernetes).',
      'Demonstrated track record of closing high-ticket senior tech positions.'
    ],
    benefits: [
      'Uncapped placement incentives',
      'Comprehensive family mediclaim',
      'High autonomy work culture'
    ],
    status: 'Active',
    postedDate: '2026-09-04T09:00:00Z'
  },
  {
    id: 'JOB-108',
    title: 'Executive Assistant to Managing Director',
    department: 'Executive Management',
    location: 'Delhi / Okhla (On-site)',
    type: 'Full-time',
    experience: '2-5 Years',
    salary: '₹5.0L - ₹7.0L P.A.',
    overview: 'Provide high-level confidential operational, communication, and scheduling support to executive leadership.',
    responsibilities: [
      'Manage executive calendars, client meetings, travel itineraries, and board presentations.',
      'Draft formal corporate correspondence, client minutes of meeting, and strategic memos.',
      'Coordinate cross-departmental follow-ups between recruitment, payroll, and sales heads.'
    ],
    requirements: [
      'Impeccable English written and spoken communication.',
      'High discretion, polish, and professionalism in executive environments.',
      'Expertise in Microsoft Office suite (Word, PowerPoint, Excel).'
    ],
    benefits: [
      'Direct strategic mentorship from business founders',
      'Annual executive retreat and performance bonuses',
      'Fast-track growth into HR leadership'
    ],
    status: 'Active',
    postedDate: '2026-09-05T12:00:00Z'
  },
  {
    id: 'JOB-109',
    title: 'HR Operations Manager (Corporate & Shared Services)',
    department: 'Human Resources',
    location: 'Delhi / Okhla (Hybrid)',
    type: 'Full-time',
    experience: '4-7 Years',
    salary: '₹9.0L - ₹14.0L P.A.',
    overview: 'Oversee corporate associate lifecycle operations, service level agreements (SLAs), and centralized HR workflow automation across national accounts.',
    responsibilities: [
      'Lead a high-performing team of 8 HR associates handling employee onboarding, documentation, and exits.',
      'Audit monthly client payroll reconciliations, statutory register maintenance, and vendor payouts.',
      'Implement digital workflow enhancements and streamline Google Workspace HR automation tools.'
    ],
    requirements: [
      'MBA in HR or equivalent operational leadership experience.',
      'Proven background leading corporate shared services or BPO/KPO human resources teams.',
      'Strong proficiency in HRMS software and analytics reporting.'
    ],
    benefits: [
      'Executive leadership incentive plan',
      'Comprehensive family health coverage',
      'Flexible hybrid working schedule'
    ],
    status: 'Active',
    postedDate: '2026-09-05T14:30:00Z'
  },
  {
    id: 'JOB-110',
    title: 'Talent Acquisition Sourcing Specialist (Remote)',
    department: 'Human Resources',
    location: 'Remote / Pan-India',
    type: 'Full-time',
    experience: '1-3 Years',
    salary: '₹4.0L - ₹6.0L P.A.',
    overview: 'Drive passive candidate outreach, Boolean search strings, and prospective talent pipelines for fast-scaling technology startups and multinational partners.',
    responsibilities: [
      'Formulate advanced Boolean search algorithms across LinkedIn Recruiter, GitHub, and job boards.',
      'Conduct initial screening conversations and qualify candidates on technical aptitude and cultural fit.',
      'Maintain clean candidate tracking in Google Sheets and recruitment databases.'
    ],
    requirements: [
      'Bachelor’s degree with solid experience in IT/Software recruitment sourcing.',
      'Strong knowledge of LinkedIn Recruiter and candidate outreach campaigns.',
      'Disciplined self-starter able to hit sourcing targets in a remote setup.'
    ],
    benefits: [
      '100% remote work flexibility',
      'Home office ergonomic setup allowance',
      'Performance-linked monthly sourcing bonuses'
    ],
    status: 'Active',
    postedDate: '2026-09-05T16:00:00Z'
  },
  {
    id: 'JOB-111',
    title: 'Enterprise Account Manager - B2B Staffing',
    department: 'Sales & Client Relations',
    location: 'Delhi NCR / Gurgaon',
    type: 'Full-time',
    experience: '3-5 Years',
    salary: '₹7.0L - ₹10.5L P.A.',
    overview: 'Nurture top-tier corporate client accounts, expand staffing mandates, and partner with client CXOs on comprehensive workforce solutions.',
    responsibilities: [
      'Serve as the primary strategic account partner for 15+ Fortune 500 corporate clients.',
      'Review service delivery SLAs with client hiring managers and resolve staffing bottlenecks.',
      'Identify cross-selling opportunities across contract staffing, payroll outsourcing, and executive search.'
    ],
    requirements: [
      '3+ years in B2B corporate staffing, recruitment agency, or client account management.',
      'Exceptional relationship-building, consultative selling, and presentation skills.',
      'Demonstrated track record of achieving annual account renewal targets.'
    ],
    benefits: [
      'Attractive commission and account expansion bonus pool',
      'Client entertainment and travel expense budget',
      'Fast-track career path to Regional Client Director'
    ],
    status: 'Active',
    postedDate: '2026-09-05T18:00:00Z'
  },
  {
    id: 'JOB-112',
    title: 'Associate Legal & Labor Compliance Executive',
    department: 'Legal & Compliance',
    location: 'Delhi / Okhla (On-site)',
    type: 'Full-time',
    experience: '1-3 Years',
    salary: '₹4.2L - ₹5.8L P.A.',
    overview: 'Ensure strict statutory alignment across factory labor codes, minimum wage legislation, and contract labor licensing for corporate clients.',
    responsibilities: [
      'Prepare and file periodic statutory returns under Factories Act, CLRA, Shops & Establishment Act.',
      'Conduct on-site compliance audits of vendor personnel and contractor wage disbursement records.',
      'Liaise with labor department officials during inspections and regulatory inquiries.'
    ],
    requirements: [
      'Bachelor of Laws (LL.B.) or PG Diploma in Labor Laws & Industrial Relations.',
      'Hands-on knowledge of Indian central and state labor regulations.',
      'High integrity, meticulous eye for detail, and documentation accuracy.'
    ],
    benefits: [
      'Specialized corporate legal mentorship',
      'Annual bar association subscription support',
      'Group health and accident coverage'
    ],
    status: 'Active',
    postedDate: '2026-09-05T19:30:00Z'
  },
  {
    id: 'JOB-113',
    title: 'Lead Campus Engagement & University Relations Officer',
    department: 'Human Resources',
    location: 'Delhi / Hybrid',
    type: 'Full-time',
    experience: '2-4 Years',
    salary: '₹5.0L - ₹7.2L P.A.',
    overview: 'Spearhead university relations, tier-1 engineering and management institute recruitment drives, and student ambassador programs.',
    responsibilities: [
      'Build strategic partnerships with TPOs (Training & Placement Officers) across 50+ leading Indian colleges.',
      'Coordinate end-to-end hackathons, campus recruitment days, and pre-placement talk sessions.',
      'Track campus intern retention and transition to permanent graduate hires.'
    ],
    requirements: [
      '2+ years experience in university recruitment, campus talent acquisition, or collegiate relations.',
      'Energetic communicator with natural stage presence and youth engagement skills.',
      'Open to seasonal regional travel during campus hiring periods.'
    ],
    benefits: [
      'All-inclusive travel and accommodation allowances',
      'Direct interaction with university leadership and deans',
      'Dynamic, youth-centric working environment'
    ],
    status: 'Active',
    postedDate: '2026-09-06T09:00:00Z'
  },
  {
    id: 'JOB-114',
    title: 'Senior UI/UX & Frontend Engineer',
    department: 'Information Technology',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '3-5 Years',
    salary: '₹9.5L - ₹15.0L P.A.',
    overview: 'Design and engineer next-generation internal portals, candidate application experiences, and Google Workspace cloud integrations.',
    responsibilities: [
      'Develop modern, ultra-responsive web applications using React, modern CSS, and Google Cloud APIs.',
      'Design clean, accessible design systems and interactive prototypes in Figma.',
      'Optimize web performance, Core Web Vitals, and mobile touch interactions across devices.'
    ],
    requirements: [
      '3+ years professional frontend engineering experience with React and modern CSS systems.',
      'Deep appreciation for micro-interactions, responsive design, and cross-browser accessibility.',
      'Experience integrating REST APIs, Google Cloud APIs, and serverless backends.'
    ],
    benefits: [
      'Modern M-series MacBook Pro supplied',
      'Annual tech conference and learning stipend',
      'Flexible working hours with generous leave policy'
    ],
    status: 'Active',
    postedDate: '2026-09-06T10:30:00Z'
  },
  {
    id: 'JOB-115',
    title: 'HR Generalist - Employee Engagement & Culture',
    department: 'Human Resources',
    location: 'Noida / Delhi NCR',
    type: 'Full-time',
    experience: '2-4 Years',
    salary: '₹5.0L - ₹7.0L P.A.',
    overview: 'Drive internal culture initiatives, performance appraisal cycles, pulse surveys, and employee well-being programs for 500+ associate staff.',
    responsibilities: [
      'Organize monthly employee recognition forums, town halls, and CSR community engagement events.',
      'Conduct bi-weekly new hire check-ins and quarterly employee sentiment reviews.',
      'Assist with performance management workflows, PIP calibrations, and career pathing matrices.'
    ],
    requirements: [
      'Degree in Human Resources, Psychology, or Organizational Behavior.',
      'Passionate about workplace culture, empathetic listener, and proactive problem-solver.',
      'Experience administering employee survey platforms and engagement initiatives.'
    ],
    benefits: [
      'Wellness and mental health assistance programs',
      'Annual company offsite retreats',
      'Merit-based fast-track annual appraisal cycles'
    ],
    status: 'Active',
    postedDate: '2026-09-06T11:45:00Z'
  },
  {
    id: 'JOB-116',
    title: 'Compensation & Benefits (C&B) Specialist',
    department: 'Finance & HR',
    location: 'Delhi / Hybrid',
    type: 'Full-time',
    experience: '3-6 Years',
    salary: '₹8.0L - ₹12.0L P.A.',
    overview: 'Formulate competitive salary structures, industry benchmark surveys, and executive incentive plans for enterprise staffing clients.',
    responsibilities: [
      'Conduct annual compensation market surveys (Aon, Mercer benchmarks) and analyze salary competitiveness.',
      'Design cost-to-company (CTC) structures, variable pay schemes, and retention equity mechanisms.',
      'Partner with client HR heads to audit pay equity and statutory compliance across job families.'
    ],
    requirements: [
      'MBA in HR or Finance with quantitative analytical focus.',
      'Strong financial modeling and advanced Microsoft Excel skills (VLOOKUP, Pivot Tables, regression).',
      'Solid understanding of Indian taxation laws (Section 10 exemptions, gratuity, superannuation).'
    ],
    benefits: [
      'Annual executive performance bonus',
      'Comprehensive parental insurance policy',
      'Hybrid work flexibility with subsidized wellness perks'
    ],
    status: 'Active',
    postedDate: '2026-09-06T12:30:00Z'
  }
];

// 3. Rich Candidate Applications Dataset (9 Detailed Student Submissions)
export const INITIAL_APPLICATIONS = [
  {
    applicationId: 'APP-901825',
    jobId: 'JOB-101',
    jobTitle: 'Talent Acquisition Specialist',
    candidateName: 'Priya Mehra',
    email: 'priya.mehra@example.com',
    phone: '+91 97123 45678',
    degree: 'MBA in Human Resources (Amity University, 2024)',
    experience: '2 Years Agency Experience',
    portfolioUrl: 'https://linkedin.com/in/priya-mehra-hr',
    coverNote: 'Have sourced and closed over 60+ engineers and commercial specialists in my previous agency role. Keen to drive corporate staffing at ELVO HR.',
    resumeFileName: 'Priya_Mehra_Resume.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-1/view',
    appliedAt: '2026-09-03T11:05:00Z',
    status: 'Shortlisted'
  },
  {
    applicationId: 'APP-901824',
    jobId: 'JOB-102',
    jobTitle: 'HR Operations & Compliance Intern',
    candidateName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98112 34567',
    degree: 'BBA - Final Year (Shaheed Bhagat Singh College, DU)',
    experience: 'Fresher / Student (2026 Batch)',
    portfolioUrl: 'https://linkedin.com/in/aarav-sharma-hr',
    coverNote: 'Excited to apply my HR fundamentals, assist with digital onboarding workflows, and learn labor compliance at ELVO HR.',
    resumeFileName: 'Aarav_Sharma_CV.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-2/view',
    appliedAt: '2026-09-02T14:22:00Z',
    status: 'Reviewing'
  },
  {
    applicationId: 'APP-901826',
    jobId: 'JOB-102',
    jobTitle: 'HR Operations & Compliance Intern',
    candidateName: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    phone: '+91 99887 11223',
    degree: 'B.Com Honours (IP University, Delhi)',
    experience: 'Fresher',
    portfolioUrl: 'https://linkedin.com/in/rohan-gupta-fin',
    coverNote: 'Strong interest in statutory documentation, background checks, and associate payroll record verification.',
    resumeFileName: 'Rohan_Gupta_Resume.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-3/view',
    appliedAt: '2026-09-04T16:40:00Z',
    status: 'New'
  },
  {
    applicationId: 'APP-901827',
    jobId: 'JOB-103',
    jobTitle: 'Business Development Executive - Staffing',
    candidateName: 'Vikramaditya Rao',
    email: 'vikram.rao@example.com',
    phone: '+91 98220 54321',
    degree: 'B.Tech + MBA Marketing (Symbiosis Pune)',
    experience: '2.5 Years Corporate Sales',
    portfolioUrl: 'https://linkedin.com/in/vikramaditya-rao',
    coverNote: 'Managed B2B corporate sales in Gurgaon and signed 14 enterprise clients for workforce management last fiscal year.',
    resumeFileName: 'Vikram_Rao_Profile.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-4/view',
    appliedAt: '2026-09-04T18:15:00Z',
    status: 'Shortlisted'
  },
  {
    applicationId: 'APP-901828',
    jobId: 'JOB-104',
    jobTitle: 'Payroll & Statutory Compliance Analyst',
    candidateName: 'Kavita Sundaram',
    email: 'kavita.sundaram@example.com',
    phone: '+91 98765 12340',
    degree: 'M.Com & PG Diploma in Labor Law',
    experience: '3 Years Payroll Experience',
    portfolioUrl: 'https://linkedin.com/in/kavita-payroll',
    coverNote: 'Specialized in multi-client monthly payroll disbursement, PF/ESI challan generation, and annual tax audits.',
    resumeFileName: 'Kavita_Sundaram_CV.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-5/view',
    appliedAt: '2026-09-05T09:30:00Z',
    status: 'Reviewing'
  },
  {
    applicationId: 'APP-901829',
    jobId: 'JOB-105',
    jobTitle: 'Full Stack Web Developer (Internal Tools)',
    candidateName: 'Akash Deep Singh',
    email: 'akash.dev@example.com',
    phone: '+91 99100 87654',
    degree: 'B.Tech Computer Science (DTU Delhi, 2023)',
    experience: '2 Years React & Node.js',
    portfolioUrl: 'https://github.com/akashdeep-dev',
    coverNote: 'Built internal HR portal dashboards, Google Apps Script extensions, and real-time candidate notification bots.',
    resumeFileName: 'Akash_Deep_Resume.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-6/view',
    appliedAt: '2026-09-05T13:45:00Z',
    status: 'New'
  },
  {
    applicationId: 'APP-901830',
    jobId: 'JOB-101',
    jobTitle: 'Talent Acquisition Specialist',
    candidateName: 'Simran Kaur',
    email: 'simran.kaur@example.com',
    phone: '+91 98991 22334',
    degree: 'BA Psychology (Lady Shri Ram College, DU)',
    experience: '1 Year Recruitment',
    portfolioUrl: 'https://linkedin.com/in/simran-recruits',
    coverNote: 'Passionate about candidate experience, behavioral psychometrics, and fast-track hiring for IT startups.',
    resumeFileName: 'Simran_Kaur_Resume.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-7/view',
    appliedAt: '2026-09-05T15:20:00Z',
    status: 'New'
  },
  {
    applicationId: 'APP-901831',
    jobId: 'JOB-106',
    jobTitle: 'Campus Recruitment Coordinator',
    candidateName: 'Harsh Vardhan Joshi',
    email: 'harsh.joshi@example.com',
    phone: '+91 97771 88990',
    degree: 'BBA in Event & HR Management (Christ University)',
    experience: '1.5 Years Campus Logistics',
    portfolioUrl: 'https://linkedin.com/in/harsh-joshi-campus',
    coverNote: 'Coordinated campus placement drives across 22 engineering colleges in North India. Great rapport with college placement directors.',
    resumeFileName: 'Harsh_Joshi_Resume.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-8/view',
    appliedAt: '2026-09-05T17:10:00Z',
    status: 'Shortlisted'
  },
  {
    applicationId: 'APP-901832',
    jobId: 'GENERAL',
    jobTitle: 'General Open Application',
    candidateName: 'Neha Deshmukh',
    email: 'neha.deshmukh@example.com',
    phone: '+91 98450 99887',
    degree: 'MBA Operations & Supply Chain (NMIMS Mumbai)',
    experience: '3 Years Corporate Operations',
    portfolioUrl: 'https://linkedin.com/in/neha-deshmukh-ops',
    coverNote: 'Open to senior HR operations or client project manager roles. Open to relocating to Delhi NCR.',
    resumeFileName: 'Neha_Deshmukh_CV.pdf',
    resumeDriveUrl: 'https://drive.google.com/file/d/sample-view-link-9/view',
    appliedAt: '2026-09-06T08:50:00Z',
    status: 'New'
  }
];

/**
 * Get the Google Apps Script Web App URL from localStorage or environment
 */
export function getScriptUrl() {
  const custom = localStorage.getItem(SCRIPT_STORAGE_KEY);
  if (custom && custom.trim()) {
    return custom.trim();
  }
  return import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';
}

/**
 * Save custom Apps Script URL in browser storage
 */
export function setScriptUrl(url) {
  if (!url) {
    localStorage.removeItem(SCRIPT_STORAGE_KEY);
  } else {
    localStorage.setItem(SCRIPT_STORAGE_KEY, url.trim());
  }
}

/**
 * Helper to convert a File to Base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Authenticate Admin User (Email & Password, with fallback passkey)
 */
export async function adminLogin(email, password) {
  const scriptUrl = getScriptUrl();

  // Master passkey bypass
  if (email === DEFAULT_ADMIN_PASSKEY || password === DEFAULT_ADMIN_PASSKEY) {
    return {
      success: true,
      user: { email: 'info@elvohr.com', name: 'Primary Administrator', role: 'Admin' }
    };
  }

  if (scriptUrl) {
    try {
      const payload = {
        action: 'adminLogin',
        email: email.trim().toLowerCase(),
        password: password.trim()
      };
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        return { 
          success: true, 
          user: { 
            ...data.user, 
            role: normalizeRole(data.user?.role) 
          } 
        };
      } else if (data && data.error) {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn('Apps Script login failed, testing against local admins:', err);
    }
  }

  // Local storage fallback
  const localAdmins = getLocalAdmins();
  const matched = localAdmins.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password.trim()
  );

  if (matched) {
    return {
      success: true,
      user: { 
        email: matched.email, 
        name: matched.name, 
        role: normalizeRole(matched.role) 
      }
    };
  }

  return { success: false, error: 'Invalid email or password. Please check your credentials.' };
}

/**
 * Get all admin users (Admin only)
 */
export async function fetchAdminUsers(authData) {
  const scriptUrl = getScriptUrl();

  if (scriptUrl) {
    try {
      const params = new URLSearchParams({
        action: 'getAdminUsers',
        email: authData?.email || '',
        password: authData?.password || '',
        passkey: authData?.passkey || DEFAULT_ADMIN_PASSKEY
      });
      const res = await fetch(`${scriptUrl}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.admins)) {
          return data.admins.map((a) => ({
            ...a,
            role: normalizeRole(a.role)
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch admins from Apps Script:', err);
    }
  }

  return getLocalAdmins().map(({ password: _password, ...rest }) => ({
    ...rest,
    role: normalizeRole(rest.role)
  }));
}

/**
 * Add a new user (Only Admin can add users, with role Admin or User)
 */
export async function addAdminUser(newAdmin, currentAuth) {
  const assignedRole = normalizeRole(newAdmin.role);

  const scriptUrl = getScriptUrl();
  if (scriptUrl) {
    try {
      const payload = {
        action: 'addAdminUser',
        adminEmail: currentAuth?.email || '',
        adminPassword: currentAuth?.password || '',
        passkey: currentAuth?.passkey || DEFAULT_ADMIN_PASSKEY,
        newEmail: newAdmin.email,
        newPassword: newAdmin.password,
        newName: newAdmin.name,
        newRole: assignedRole
      };
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        return { success: true, message: data.message };
      } else if (data && data.error) {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn('Failed to add admin via Apps script:', err);
    }
  }

  // Local storage fallback
  const localAdmins = getLocalAdmins();
  if (localAdmins.some((a) => a.email.toLowerCase() === newAdmin.email.toLowerCase())) {
    return { success: false, error: 'A user with this email already exists.' };
  }

  localAdmins.push({
    email: newAdmin.email.trim().toLowerCase(),
    password: newAdmin.password.trim(),
    name: newAdmin.name.trim(),
    role: assignedRole,
    status: 'Active',
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(localAdmins));
  return { success: true, message: `User '${newAdmin.email}' (${assignedRole}) added successfully!` };
}

/**
 * Modify User Password (Only Admin)
 */
export async function updateUserPassword(targetEmail, newPassword, currentAuth) {
  if (!targetEmail || !newPassword) {
    return { success: false, error: 'Email and new password are required.' };
  }

  const scriptUrl = getScriptUrl();
  if (scriptUrl) {
    try {
      const payload = {
        action: 'updateUserPassword',
        adminEmail: currentAuth?.email || '',
        adminPassword: currentAuth?.password || '',
        passkey: currentAuth?.passkey || DEFAULT_ADMIN_PASSKEY,
        targetEmail: targetEmail.trim().toLowerCase(),
        newPassword: newPassword.trim()
      };
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        return { success: true, message: data.message };
      } else if (data && data.error) {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn('Failed to update password via Apps Script:', err);
    }
  }

  // Local storage update
  const localAdmins = getLocalAdmins();
  const index = localAdmins.findIndex((a) => a.email.toLowerCase() === targetEmail.toLowerCase());
  if (index !== -1) {
    localAdmins[index].password = newPassword.trim();
    localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(localAdmins));
    return { success: true, message: `Password updated successfully for ${targetEmail}` };
  }

  return { success: false, error: 'User account not found.' };
}

/**
 * Delete User from Dashboard (Only Admin)
 */
export async function deleteAdminUser(targetEmail, currentAuth) {
  if (!targetEmail) {
    return { success: false, error: 'Target email is required.' };
  }

  if (targetEmail.toLowerCase() === currentAuth?.email?.toLowerCase()) {
    return { success: false, error: 'You cannot delete your own account while logged in.' };
  }

  const scriptUrl = getScriptUrl();
  if (scriptUrl) {
    try {
      const payload = {
        action: 'deleteAdminUser',
        adminEmail: currentAuth?.email || '',
        adminPassword: currentAuth?.password || '',
        passkey: currentAuth?.passkey || DEFAULT_ADMIN_PASSKEY,
        targetEmail: targetEmail.trim().toLowerCase()
      };
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        return { success: true, message: data.message };
      } else if (data && data.error) {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn('Failed to delete user via Apps Script:', err);
    }
  }

  // Local storage update
  const localAdmins = getLocalAdmins();
  const updated = localAdmins.filter((a) => a.email.toLowerCase() !== targetEmail.toLowerCase());
  localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(updated));
  return { success: true, message: `User '${targetEmail}' has been permanently deleted.` };
}

function getLocalAdmins() {
  const stored = localStorage.getItem(LOCAL_ADMINS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_ADMINS.length) return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(INITIAL_ADMINS));
  return INITIAL_ADMINS;
}

/**
 * Fetch all active jobs for the Careers page and admin
 */
export async function fetchJobs() {
  const scriptUrl = getScriptUrl();
  let jobsList = null;

  if (scriptUrl) {
    try {
      const res = await fetch(`${scriptUrl}?action=getJobs`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          jobsList = data.jobs;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch jobs from Google Apps Script, falling back to local storage:', err);
    }
  }

  if (!jobsList) {
    const stored = localStorage.getItem(LOCAL_JOBS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If stored has at least as many as INITIAL_JOBS, use it, else refresh with initial rich set
        if (Array.isArray(parsed) && parsed.length >= INITIAL_JOBS.length) {
          jobsList = parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (!jobsList) {
    jobsList = INITIAL_JOBS;
    localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(INITIAL_JOBS));
  }

  // Ensure applicationCount is computed from applications
  const allApps = getLocalApplications();
  return jobsList.map((job) => {
    const matchingApps = allApps.filter((a) => a.jobId === job.id || a.jobTitle === job.title);
    return {
      ...job,
      applicationCount: typeof job.applicationCount === 'number' ? job.applicationCount : matchingApps.length
    };
  });
}

/**
 * Submit candidate job application with resume file
 */
export async function submitApplication(formData) {
  const scriptUrl = getScriptUrl();
  let resumeBase64 = '';
  let resumeFileName = '';
  let resumeMimeType = '';

  if (formData.resumeFile) {
    resumeFileName = formData.resumeFile.name;
    resumeMimeType = formData.resumeFile.type;
    resumeBase64 = await fileToBase64(formData.resumeFile);
  }

  const payload = {
    action: 'applyJob',
    jobId: formData.jobId || 'GENERAL',
    jobTitle: formData.jobTitle || 'General Open Application',
    candidateName: formData.candidateName,
    email: formData.email,
    phone: formData.phone,
    degree: formData.degree || '',
    experience: formData.experience || '',
    portfolioUrl: formData.portfolioUrl || '',
    coverNote: formData.coverNote || '',
    resumeFileName: resumeFileName,
    resumeBase64: resumeBase64,
    resumeMimeType: resumeMimeType
  };

  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        return {
          success: true,
          applicationId: data.applicationId,
          resumeDriveUrl: data.resumeDriveUrl,
          message: data.message || 'Application submitted successfully to ELVO HR Google Workspace!'
        };
      }
    } catch (err) {
      console.warn('Google Apps Script submission failed, storing locally:', err);
    }
  }

  // Local storage mock mode
  const localApps = getLocalApplications();
  const applicationId = 'APP-' + Math.floor(100000 + Math.random() * 900000);
  
  let mockResumeUrl = '';
  if (formData.resumeFile) {
    try {
      mockResumeUrl = URL.createObjectURL(formData.resumeFile);
    } catch {
      mockResumeUrl = 'https://drive.google.com/sample-resume';
    }
  }

  const newApp = {
    applicationId,
    jobId: payload.jobId,
    jobTitle: payload.jobTitle,
    candidateName: payload.candidateName,
    email: payload.email,
    phone: payload.phone,
    degree: payload.degree,
    experience: payload.experience,
    portfolioUrl: payload.portfolioUrl,
    coverNote: payload.coverNote,
    resumeFileName: resumeFileName || 'Candidate_Resume.pdf',
    resumeDriveUrl: mockResumeUrl || 'https://drive.google.com/file/d/sample/view',
    appliedAt: new Date().toISOString(),
    status: 'New'
  };

  localApps.unshift(newApp);
  localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(localApps));

  return {
    success: true,
    applicationId,
    resumeDriveUrl: newApp.resumeDriveUrl,
    message: 'Application recorded! (Saved to local workspace database)'
  };
}

/**
 * Fetch all applications (for Portal Owner / Admin)
 */
export async function fetchApplications(authData) {
  const scriptUrl = getScriptUrl();

  if (scriptUrl) {
    try {
      const params = new URLSearchParams({
        action: 'getApplications',
        email: authData?.email || '',
        password: authData?.password || '',
        passkey: authData?.passkey || DEFAULT_ADMIN_PASSKEY
      });
      const res = await fetch(`${scriptUrl}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          return data.applications;
        } else if (data && data.error) {
          throw new Error(data.error);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch from Google Apps Script, using local applications:', err);
    }
  }

  return getLocalApplications();
}

/**
 * Helper to get applications stored in localStorage
 */
export function getLocalApplications() {
  const stored = localStorage.getItem(LOCAL_APPS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_APPLICATIONS.length) return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
}

/**
 * Post a new Job (Admin)
 */
export async function postNewJob(jobData, authData) {
  const scriptUrl = getScriptUrl();

  if (scriptUrl) {
    try {
      const payload = {
        action: 'postJob',
        adminEmail: authData?.email || '',
        adminPassword: authData?.password || '',
        passkey: authData?.passkey || DEFAULT_ADMIN_PASSKEY,
        job: jobData
      };
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        return { success: true, jobId: data.jobId, message: data.message };
      } else if (data && data.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.warn('Apps Script failed, posting to local storage:', err);
    }
  }

  // Local storage mode
  const currentJobs = await fetchJobs();
  const newJobId = 'JOB-' + (currentJobs.length + 101);
  const newJob = {
    ...jobData,
    id: newJobId,
    status: 'Active',
    postedDate: new Date().toISOString(),
    applicationCount: 0
  };

  const updatedJobs = [newJob, ...currentJobs];
  localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(updatedJobs));

  return {
    success: true,
    jobId: newJobId,
    message: `Job opening '${jobData.title}' (${newJobId}) posted successfully!`
  };
}

/**
 * Update Job Status (Admin)
 */
export async function updateJobStatus(jobId, status, authData) {
  const scriptUrl = getScriptUrl();

  if (scriptUrl) {
    try {
      const payload = {
        action: 'updateJobStatus',
        adminEmail: authData?.email || '',
        adminPassword: authData?.password || '',
        passkey: authData?.passkey || DEFAULT_ADMIN_PASSKEY,
        jobId,
        status
      };
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        return { success: true };
      }
    } catch (err) {
      console.warn('Apps Script update error:', err);
    }
  }

  // Local storage update
  const currentJobs = await fetchJobs();
  const updatedJobs = currentJobs.map((j) => (j.id === jobId ? { ...j, status } : j));
  localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(updatedJobs));
  return { success: true };
}

/**
 * Update candidate application status (Admin)
 */
export async function updateApplicationStatus(applicationId, status, authData) {
  const scriptUrl = getScriptUrl();

  if (scriptUrl) {
    try {
      const payload = {
        action: 'updateApplicationStatus',
        adminEmail: authData?.email || '',
        adminPassword: authData?.password || '',
        passkey: authData?.passkey || DEFAULT_ADMIN_PASSKEY,
        applicationId,
        status
      };
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        return { success: true };
      }
    } catch (err) {
      console.warn('Apps Script update error:', err);
    }
  }

  // Local storage update
  const apps = getLocalApplications();
  const updatedApps = apps.map((a) => (a.applicationId === applicationId ? { ...a, status } : a));
  localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(updatedApps));
  return { success: true };
}

/**
 * Test connection to Google Apps Script
 */
export async function testScriptConnection(url) {
  try {
    const res = await fetch(`${url}?action=getJobs`, { mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return { success: true, message: 'Connected successfully to Google Workspace!' };
      }
    }
    return { success: false, message: 'Google Apps Script responded, but returned an unexpected format.' };
  } catch (_err) {
    return { success: false, message: 'Could not connect. Ensure the web app is deployed with access set to "Anyone".' };
  }
}
