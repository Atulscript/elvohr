import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, PlusCircle, Briefcase, Users, 
  Settings, CheckCircle, AlertCircle, FileText, ExternalLink, 
  Mail, Phone, Calendar, RefreshCw, Eye, EyeOff, Loader2, ArrowRight,
  UserPlus, X, Filter, Search, Key, Trash2, ShieldAlert, Share2, Check,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  adminLogin, fetchJobs, postNewJob, 
  updateJobStatus, fetchApplications, updateApplicationStatus,
  fetchAdminUsers, addAdminUser, updateUserPassword, deleteAdminUser,
  getScriptUrl, setScriptUrl, testScriptConnection
} from '../services/jobPortalService';
import './PortalAdminPage.css';

const PortalAdminPage = () => {
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Tabs: 'jobs' | 'post' | 'applications' | 'settings' | 'admins'
  const [activeTab, setActiveTab] = useState('jobs');

  // Data
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filter applications by specific job
  const [filterByJobId, setFilterByJobId] = useState(null);
  const [appFilterStatus, setAppFilterStatus] = useState('All');
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [shareCopiedId, setShareCopiedId] = useState(null);

  // Pagination for Job Openings (Active when >= 15 listings)
  const [adminJobPage, setAdminJobPage] = useState(1);
  const ADMIN_JOBS_PER_PAGE = 8;
  const ADMIN_PAGINATION_THRESHOLD = 15;

  const isJobsPaginated = jobs.length >= ADMIN_PAGINATION_THRESHOLD;
  const totalAdminJobPages = isJobsPaginated ? Math.ceil(jobs.length / ADMIN_JOBS_PER_PAGE) : 1;
  const displayedAdminJobs = isJobsPaginated
    ? jobs.slice((adminJobPage - 1) * ADMIN_JOBS_PER_PAGE, adminJobPage * ADMIN_JOBS_PER_PAGE)
    : jobs;

  // Post New Job Form
  const [newJob, setNewJob] = useState({
    title: '',
    department: 'Human Resources',
    location: 'Delhi / Okhla (Hybrid)',
    type: 'Full-time',
    experience: '1-3 Years',
    salary: '₹4.5L - ₹6.5L P.A.',
    overview: '',
    responsibilities: '',
    requirements: '',
    benefits: ''
  });
  const [postJobLoading, setPostJobLoading] = useState(false);
  const [postJobSuccess, setPostJobSuccess] = useState(null);
  const [postJobError, setPostJobError] = useState('');

  // Add User Form (Two roles: Admin and User)
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: '',
    role: 'User'
  });
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminSuccess, setAddAdminSuccess] = useState('');
  const [addAdminError, setAddAdminError] = useState('');

  // Modify Password Modal State
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordModalLoading, setPasswordModalLoading] = useState(false);
  const [passwordModalSuccess, setPasswordModalSuccess] = useState('');
  const [passwordModalError, setPasswordModalError] = useState('');

  // Delete User Modal State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Settings
  const [scriptUrlInput, setScriptUrlInput] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState(null);

  // Restore session
  useEffect(() => {
    const savedUser = sessionStorage.getItem('elvo_admin_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
    setScriptUrlInput(getScriptUrl());
  }, []);

  const isAdmin = currentUser?.role === 'Admin';

  // Guard tabs: If user is not Admin, restrict 'admins' and 'settings' tabs
  useEffect(() => {
    if (currentUser && !isAdmin) {
      if (activeTab === 'admins' || activeTab === 'settings') {
        setActiveTab('jobs');
      }
    }
  }, [currentUser, isAdmin, activeTab]);

  const loadPortalData = async () => {
    setLoadingData(true);
    try {
      const authData = {
        email: currentUser?.email || authEmail,
        password: authPassword
      };
      
      const fetchAdminListPromise = (currentUser?.role === 'Admin') 
        ? fetchAdminUsers(authData) 
        : Promise.resolve([]);

      const [jobsData, appsData, adminsData] = await Promise.all([
        fetchJobs(),
        fetchApplications(authData),
        fetchAdminListPromise
      ]);

      setJobs(jobsData || []);
      setApplications(appsData || []);
      if (currentUser?.role === 'Admin') {
        setAdminUsers(adminsData || []);
      }
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadPortalData();
    }
  }, [currentUser]);

  // Handle Login via Email and Password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await adminLogin(authEmail, authPassword);
      if (res && res.success) {
        setCurrentUser(res.user);
        sessionStorage.setItem('elvo_admin_user', JSON.stringify(res.user));
      } else {
        setLoginError(res?.error || 'Invalid email or password.');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check connection.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Modify User Password (Admin only)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordModalUser || !newPasswordInput.trim()) return;
    setPasswordModalLoading(true);
    setPasswordModalError('');
    setPasswordModalSuccess('');

    try {
      const authData = { email: currentUser?.email, password: authPassword };
      const res = await updateUserPassword(passwordModalUser.email, newPasswordInput, authData);
      if (res && res.success) {
        setPasswordModalSuccess(`Password successfully updated for ${passwordModalUser.email}`);
        setTimeout(() => {
          setPasswordModalUser(null);
          setPasswordModalSuccess('');
          setNewPasswordInput('');
        }, 1200);
        loadPortalData();
      } else {
        setPasswordModalError(res?.error || 'Failed to update user password.');
      }
    } catch (err) {
      setPasswordModalError(err.message || 'Network error updating password.');
    } finally {
      setPasswordModalLoading(false);
    }
  };

  // Delete User (Admin only)
  const executeDeleteUser = async (targetEmail) => {
    if (!targetEmail) return;
    setDeleteLoading(true);
    setDeleteError('');

    try {
      const authData = { email: currentUser?.email, password: authPassword };
      const res = await deleteAdminUser(targetEmail, authData);
      if (res && res.success) {
        setDeleteConfirmUser(null);
        loadPortalData();
      } else {
        setDeleteError(res?.error || 'Failed to delete user.');
      }
    } catch (err) {
      setDeleteError(err.message || 'Network error deleting user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('elvo_admin_user');
    setAuthEmail('');
    setAuthPassword('');
  };

  // Handle Create Job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setPostJobLoading(true);
    setPostJobError('');
    setPostJobSuccess(null);

    try {
      const resp = Array.isArray(newJob.responsibilities) 
        ? newJob.responsibilities 
        : newJob.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean);

      const reqs = Array.isArray(newJob.requirements) 
        ? newJob.requirements 
        : newJob.requirements.split('\n').map((s) => s.trim()).filter(Boolean);

      const bens = Array.isArray(newJob.benefits) 
        ? newJob.benefits 
        : newJob.benefits.split('\n').map((s) => s.trim()).filter(Boolean);

      const jobPayload = {
        ...newJob,
        responsibilities: resp,
        requirements: reqs,
        benefits: bens
      };

      const authData = { email: currentUser?.email, password: authPassword };
      const res = await postNewJob(jobPayload, authData);

      if (res && res.success) {
        setPostJobSuccess({
          jobId: res.jobId,
          title: newJob.title,
          message: res.message || 'Job opening successfully published to Google Sheets!'
        });
        
        // Reset form
        setNewJob({
          title: '',
          department: 'Human Resources',
          location: 'Delhi / Okhla (Hybrid)',
          type: 'Full-time',
          experience: '1-3 Years',
          salary: '₹4.5L - ₹6.5L P.A.',
          overview: '',
          responsibilities: '',
          requirements: '',
          benefits: ''
        });

        loadPortalData();
      } else {
        setPostJobError(res?.error || 'Failed to publish job.');
      }
    } catch (err) {
      setPostJobError(err.message || 'Error occurred while creating job.');
    } finally {
      setPostJobLoading(false);
    }
  };

  // Preset Template Helper
  const applyPresetTemplate = (templateName) => {
    if (templateName === 'ta') {
      setNewJob({
        title: 'Senior Talent Acquisition Partner',
        department: 'Human Resources',
        location: 'Delhi / Okhla (Hybrid)',
        type: 'Full-time',
        experience: '2-5 Years',
        salary: '₹6.0L - ₹9.0L P.A.',
        overview: 'Lead client recruitment mandates for high-growth tech and engineering companies.',
        responsibilities: 'Manage end-to-end recruitment lifecycle from sourcing to offer rollout\nPartner with corporate hiring managers to define ideal candidate profiles\nScreen candidate profiles and conduct behavioral interviews\nTrack recruitment metrics and ATS data hygiene',
        requirements: '2+ years of full-cycle recruitment or agency experience\nProficiency in LinkedIn Recruiter and job boards\nStrong communication and negotiation skills\nBachelor’s degree in any stream (MBA HR preferred)',
        benefits: 'Health Insurance\nQuarterly Performance Bonus\nHybrid working (2 days WFH)'
      });
    } else if (templateName === 'intern') {
      setNewJob({
        title: 'HR Operations & Associate Intern',
        department: 'Human Resources',
        location: 'Delhi / Okhla (On-site)',
        type: 'Internship',
        experience: 'Freshers / Students (2025-2026)',
        salary: '₹18,000 - ₹22,000 / month',
        overview: 'Gain hands-on corporate exposure to associate onboarding, compliance audits, and documentation.',
        responsibilities: 'Assist senior HR partners with associate onboarding and digital record keeping\nCoordinate verification documents and statutory compliance checks\nSupport query resolution for employee benefits and letters\nHelp organize monthly associate culture activities',
        requirements: 'Pursuing or completed BBA, MBA, B.Com, or BA\nGood command over English (spoken and written)\nWorking knowledge of MS Office (Word, Excel)\nAvailable for a full-time 3-6 month internship with PPO opportunity',
        benefits: 'PPO Conversion Opportunity\nMentorship from HR Directors\nCertificate and Letter of Recommendation\nOffice Refreshments'
      });
    } else if (templateName === 'sales') {
      setNewJob({
        title: 'Enterprise Business Development Lead',
        department: 'Sales & Growth',
        location: 'Delhi NCR (Hybrid)',
        type: 'Full-time',
        experience: '2-6 Years',
        salary: '₹7.0L - ₹12.0L P.A. + Uncapped Incentives',
        overview: 'Drive enterprise sales acquisition for staffing, executive search, and payroll outsourcing solutions.',
        responsibilities: 'Identify prospective enterprise clients across IT, Manufacturing, and BFSI\nPresent ELVO HR solution pitches to Founders, CHROs, and Talent Heads\nNegotiate Master Service Agreements (MSAs) and commercial terms\nCollaborate with recruitment delivery teams for client satisfaction',
        requirements: 'Proven B2B corporate sales experience in staffing or HR services\nStrong corporate network in Delhi NCR and north region\nHigh-energy, proactive communicator with goal-oriented approach',
        benefits: 'Uncapped Monthly Revenue Sharing Commissions\nCorporate Travel Allowances\nExecutive Leadership Track'
      });
    }
  };

  // Toggle Job Status
  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    const authData = { email: currentUser?.email, password: authPassword };
    await updateJobStatus(jobId, nextStatus, authData);
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: nextStatus } : j)));
  };

  // Update Application Status
  const handleStatusChange = async (appId, newStatus) => {
    const authData = { email: currentUser?.email, password: authPassword };
    await updateApplicationStatus(appId, newStatus, authData);
    setApplications((prev) => 
      prev.map((a) => (a.applicationId === appId ? { ...a, status: newStatus } : a))
    );
  };

  // Add Admin User
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddAdminLoading(true);
    setAddAdminError('');
    setAddAdminSuccess('');

    try {
      const authData = { email: currentUser?.email, password: authPassword };
      const res = await addAdminUser(newAdmin, authData);
      if (res && res.success) {
        setAddAdminSuccess(res.message || 'Admin user successfully added to Admins sheet!');
        setNewAdmin({ email: '', password: '', name: '', role: 'Recruiter' });
        loadPortalData();
      } else {
        setAddAdminError(res?.error || 'Failed to add admin user.');
      }
    } catch (err) {
      setAddAdminError(err.message || 'Network error.');
    } finally {
      setAddAdminLoading(false);
    }
  };

  // Save Script URL
  const handleSaveScriptUrl = async () => {
    setScriptUrl(scriptUrlInput);
    setTestingConnection(true);
    setConnectionMessage(null);

    if (!scriptUrlInput.trim()) {
      setTestingConnection(false);
      setConnectionMessage({ type: 'info', text: 'Script URL cleared. Portal running in local storage mode.' });
      return;
    }

    const res = await testScriptConnection(scriptUrlInput);
    setTestingConnection(false);
    if (res.success) {
      setConnectionMessage({ type: 'success', text: 'Connection Verified! Connected directly to your Google Workspace.' });
      loadPortalData();
    } else {
      setConnectionMessage({ type: 'error', text: res.message });
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesJob = filterByJobId ? (app.jobId === filterByJobId || app.jobTitle === filterByJobId) : true;
    const matchesStatus = appFilterStatus === 'All' || app.status === appFilterStatus;
    const matchesQuery = 
      (app.candidateName && app.candidateName.toLowerCase().includes(appSearchQuery.toLowerCase())) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(appSearchQuery.toLowerCase())) ||
      (app.email && app.email.toLowerCase().includes(appSearchQuery.toLowerCase()));
    return matchesJob && matchesStatus && matchesQuery;
  });

  // Calculate applications for each job
  const getJobApplicationCount = (jobId, jobTitle) => {
    return applications.filter((a) => a.jobId === jobId || a.jobTitle === jobTitle).length;
  };

  // 1. LOGIN SCREEN (Email & Password)
  if (!currentUser) {
    return (
      <div className="admin-login-wrapper section">
        <div className="container">
          <div className="admin-login-card card animate-scale-up">
            <div className="admin-icon-box">
              <ShieldCheck size={44} className="admin-shield" />
            </div>
            <h2>ELVO HR Admin Portal</h2>
            <p className="admin-subtext">
              Sign in with your authorized admin email and password configured in your Google Workspace <strong>Admins</strong> sheet.
            </p>

            <form onSubmit={handleLogin} className="admin-login-form">
              {loginError && (
                <div className="login-error-msg">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="login-input-group">
                <label htmlFor="authEmail">Admin Email</label>
                <div className="login-input-wrap">
                  <Mail size={18} className="input-lock-icon" />
                  <input
                    id="authEmail"
                    type="email"
                    placeholder="e.g. info@elvohr.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label htmlFor="authPassword">Admin Password</label>
                <div className="login-input-wrap">
                  <Lock size={18} className="input-lock-icon" />
                  <input
                    id="authPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="show-passkey-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-btn" disabled={loginLoading}>
                {loginLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-admin-page section">
      <div className="container">
        
        {/* Top Header Bar */}
        <div className="admin-top-bar">
          <div>
            <div className="admin-role-badge">
              <ShieldCheck size={14} /> Logged in as: <strong>{currentUser.name}</strong>
              <span className={`role-pill-chip ${isAdmin ? 'role-pill-admin' : 'role-pill-user'}`}>
                {isAdmin ? '🛡️ Admin' : '👤 User'}
              </span>
            </div>
            <h2>Careers Administration Hub</h2>
            <p className="admin-sub">
              Connected with Google Workspace • <strong>{currentUser.email}</strong>
            </p>
          </div>

          <div className="admin-top-actions">
            <button className="btn btn-outline btn-refresh-data" onClick={loadPortalData}>
              <RefreshCw size={15} className={loadingData ? 'animate-spin' : ''} /> Refresh Data
            </button>
            <button className="btn btn-outline btn-logout" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* Overview Stat Counters */}
        <div className="admin-stats-grid">
          <div 
            className="stat-card card stat-card-interactive" 
            onClick={() => setActiveTab('jobs')}
            title="Click to view Job Openings"
            role="button"
            tabIndex={0}
          >
            <span className="stat-label">Total Jobs</span>
            <span className="stat-value">{jobs.length}</span>
            <span className="stat-note">{jobs.filter((j) => j.status === 'Active').length} Active Openings</span>
          </div>

          <div 
            className="stat-card card stat-card-interactive" 
            onClick={() => {
              setActiveTab('applications');
              setSelectedJobFilter('ALL');
              setSelectedAppStatus('All');
            }}
            title="Click to view All Applications"
            role="button"
            tabIndex={0}
          >
            <span className="stat-label">Total Applications</span>
            <span className="stat-value">{applications.length}</span>
            <span className="stat-note">Stored in Sheets & Drive</span>
          </div>

          <div 
            className="stat-card card stat-card-interactive" 
            onClick={() => {
              setActiveTab('applications');
              setSelectedJobFilter('ALL');
              setSelectedAppStatus('New');
            }}
            title="Click to filter Unreviewed Applications"
            role="button"
            tabIndex={0}
          >
            <span className="stat-label">New / Unreviewed</span>
            <span className="stat-value text-accent">
              {applications.filter((a) => a.status === 'New').length}
            </span>
            <span className="stat-note">Awaiting HR screening</span>
          </div>

          {isAdmin ? (
            <div 
              className="stat-card card stat-card-interactive" 
              onClick={() => setActiveTab('admins')}
              title="Click to manage Team Accounts (Admin Only)"
              role="button"
              tabIndex={0}
            >
              <span className="stat-label">Team & Users</span>
              <span className="stat-value" style={{ fontSize: '1.75rem' }}>
                {adminUsers.length || 1}
              </span>
              <span className="stat-note">Admins & Users in Sheets</span>
            </div>
          ) : (
            <div className="stat-card card">
              <span className="stat-label">Your Role</span>
              <span className="stat-value text-accent" style={{ fontSize: '1.75rem' }}>
                User
              </span>
              <span className="stat-note">Standard Associate Privileges</span>
            </div>
          )}
        </div>

        {/* Modern Segmented Navigation Toolbar */}
        <div className="admin-nav-toolbar">
          <div className="admin-segmented-pills">
            <button 
              className={`nav-pill-btn ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              <Briefcase size={16} /> 
              <span>Job Openings</span>
              <span className="nav-pill-count">{jobs.length}</span>
            </button>

            <button 
              className={`nav-pill-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <Users size={16} /> 
              <span>Applications</span>
              <span className="nav-pill-count">{applications.length}</span>
              {applications.filter((a) => a.status === 'New').length > 0 && (
                <span 
                  className="nav-pill-unread-dot" 
                  title={`${applications.filter((a) => a.status === 'New').length} unreviewed application(s)`} 
                />
              )}
            </button>

            {/* Admin-Only Tabs */}
            {isAdmin && (
              <>
                <button 
                  className={`nav-pill-btn ${activeTab === 'admins' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admins')}
                >
                  <UserPlus size={16} /> 
                  <span>User Management</span>
                  <span className="nav-pill-count">{adminUsers.length || 3}</span>
                </button>

                <button 
                  className={`nav-pill-btn ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings size={16} /> 
                  <span>Workspace Sync</span>
                  <span className="nav-pill-dot-active" title="Google Workspace Connected" />
                </button>
              </>
            )}
          </div>

          <div className="admin-nav-action">
            <button 
              className={`btn-post-job-cta ${activeTab === 'post' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('post');
                setPostJobSuccess(null);
              }}
            >
              <PlusCircle size={17} /> 
              <span>Post New Job</span>
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: JOB OPENINGS & APPLICATIONS COUNT */}
        {/* ==================================================================== */}
        {activeTab === 'jobs' && (
          <div className="tab-content">
            <div className="jobs-tab-header">
              <div>
                <h3>Manage Job Openings & Applications</h3>
                <p className="tab-subtext">
                  View the total number of student applications received per job opening, manage status, and inspect applicants.
                </p>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => {
                  setActiveTab('post');
                  setPostJobSuccess(null);
                }}
              >
                <PlusCircle size={16} /> Post Another Job
              </button>
            </div>

            <div className="jobs-manage-list" id="admin-jobs-list-top">
              {displayedAdminJobs.map((job) => {
                const appCount = getJobApplicationCount(job.id, job.title);

                return (
                  <div className="job-manage-card card" key={job.id}>
                    <div className="job-manage-main">
                      <div className="job-manage-tags">
                        <span className="badge-dept">{job.department}</span>
                        <span className="badge-type">{job.type}</span>
                        <span className={`badge-status ${job.status === 'Active' ? 'status-active' : 'status-closed'}`}>
                          {job.status}
                        </span>
                        <span className="badge-id">ID: {job.id}</span>
                      </div>

                      <h4 className="job-title-row">{job.title}</h4>

                      <p className="job-manage-meta">
                        <span>📍 {job.location}</span>
                        <span>⏱️ {job.experience}</span>
                        <span>💰 {job.salary}</span>
                        {job.postedDate && <span>📅 {new Date(job.postedDate).toLocaleDateString()}</span>}
                      </p>

                      {/* Prominent Application Count Badge */}
                      <div className="job-app-count-row">
                        <div className={`app-count-badge ${appCount > 0 ? 'has-applicants' : 'zero-applicants'}`}>
                          <Users size={15} />
                          <strong>{appCount}</strong> {appCount === 1 ? 'Candidate Application' : 'Candidate Applications'}
                        </div>

                        {appCount > 0 && (
                          <button
                            className="btn btn-sm btn-outline view-job-apps-btn"
                            onClick={() => {
                              setFilterByJobId(job.id);
                              setActiveTab('applications');
                            }}
                          >
                            View All {appCount} Applicants <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="job-manage-side">
                      <button 
                        className={`btn btn-sm ${shareCopiedId === job.id ? 'btn-success' : 'btn-outline'} share-link-admin-btn`}
                        onClick={() => {
                          const url = `${window.location.origin}/careers/${job.id}`;
                          if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(url);
                          }
                          setShareCopiedId(job.id);
                          setTimeout(() => setShareCopiedId(null), 2200);
                        }}
                        title="Copy candidate application link to share via WhatsApp, LinkedIn, or Email"
                      >
                        {shareCopiedId === job.id ? (
                          <>
                            <Check size={14} /> Link Copied!
                          </>
                        ) : (
                          <>
                            <Share2 size={14} /> Share Link
                          </>
                        )}
                      </button>
                      <button 
                        className={`btn btn-sm ${job.status === 'Active' ? 'btn-outline-danger' : 'btn-primary'}`}
                        onClick={() => handleToggleJobStatus(job.id, job.status)}
                      >
                        {job.status === 'Active' ? 'Close Opening' : 'Reactivate Opening'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Numbered Pagination for Admin Jobs (Active when listings >= 15) */}
            {isJobsPaginated && totalAdminJobPages > 1 && (
              <div className="admin-pagination-wrapper card">
                <div className="admin-pagination-info">
                  Showing <strong>{(adminJobPage - 1) * ADMIN_JOBS_PER_PAGE + 1}–{Math.min(adminJobPage * ADMIN_JOBS_PER_PAGE, jobs.length)}</strong> of <strong>{jobs.length}</strong> Openings
                </div>
                <div className="admin-pagination-controls">
                  <button 
                    className="admin-page-btn nav-btn"
                    disabled={adminJobPage === 1}
                    onClick={() => {
                      setAdminJobPage(p => Math.max(1, p - 1));
                      document.getElementById('admin-jobs-list-top')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={16} /> <span>Prev</span>
                  </button>

                  {Array.from({ length: totalAdminJobPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`admin-page-btn num-btn ${adminJobPage === pageNum ? 'active' : ''}`}
                      onClick={() => {
                        setAdminJobPage(pageNum);
                        document.getElementById('admin-jobs-list-top')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      aria-label={`Page ${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button 
                    className="admin-page-btn nav-btn"
                    disabled={adminJobPage === totalAdminJobPages}
                    onClick={() => {
                      setAdminJobPage(p => Math.min(totalAdminJobPages, p + 1));
                      document.getElementById('admin-jobs-list-top')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label="Next Page"
                  >
                    <span>Next</span> <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: POST NEW JOB (FIXED & STREAMLINED) */}
        {/* ==================================================================== */}
        {activeTab === 'post' && (
          <div className="tab-content">
            <div className="post-job-card card">
              
              <div className="post-job-header">
                <div>
                  <h3>Post a New Job Opening</h3>
                  <p className="post-job-sub">
                    Create a new requisition that automatically syncs to your Google Sheets database and becomes immediately searchable on the Careers page.
                  </p>
                </div>

                {/* Preset Templates */}
                <div className="template-presets-box">
                  <span className="preset-label">Quick Templates:</span>
                  <div className="preset-buttons">
                    <button 
                      type="button" 
                      className="btn-preset" 
                      onClick={() => applyPresetTemplate('ta')}
                    >
                      + Talent Acquisition
                    </button>
                    <button 
                      type="button" 
                      className="btn-preset" 
                      onClick={() => applyPresetTemplate('intern')}
                    >
                      + HR Intern
                    </button>
                    <button 
                      type="button" 
                      className="btn-preset" 
                      onClick={() => applyPresetTemplate('sales')}
                    >
                      + Enterprise Sales
                    </button>
                  </div>
                </div>
              </div>

              {postJobSuccess && (
                <div className="post-alert-success animate-scale-up">
                  <div className="success-icon-col">
                    <CheckCircle size={28} />
                  </div>
                  <div className="success-text-col">
                    <h4>{postJobSuccess.title} is now Live!</h4>
                    <p>Assigned Job ID: <strong>{postJobSuccess.jobId}</strong></p>
                    <div className="success-action-btns">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => setActiveTab('jobs')}
                      >
                        View in Active Jobs Tab
                      </button>
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => setPostJobSuccess(null)}
                      >
                        Post Another Opening
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {postJobError && (
                <div className="post-alert-error">
                  <AlertCircle size={18} />
                  <span>{postJobError}</span>
                </div>
              )}

              <form onSubmit={handleCreateJob} className="post-job-form">
                
                {/* Section 1: Basic Information */}
                <div className="form-section-box">
                  <h4 className="section-title">1. Job Title & Department</h4>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="postJobTitle">Job Title <span className="req">*</span></label>
                      <input
                        id="postJobTitle"
                        type="text"
                        placeholder="e.g. Senior Recruitment Consultant"
                        required
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="postJobDept">Department <span className="req">*</span></label>
                      <select
                        id="postJobDept"
                        value={newJob.department}
                        onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                      >
                        <option value="Human Resources">Human Resources</option>
                        <option value="Sales & Growth">Sales & Growth</option>
                        <option value="Finance & Compliance">Finance & Compliance</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Operations">Operations</option>
                        <option value="Executive Management">Executive Management</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Role Details */}
                <div className="form-section-box">
                  <h4 className="section-title">2. Employment Details</h4>
                  <div className="form-row-3">
                    <div className="form-group">
                      <label htmlFor="postJobType">Workplace Type <span className="req">*</span></label>
                      <select
                        id="postJobType"
                        value={newJob.type}
                        onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contractual">Contractual</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="postJobLoc">Location <span className="req">*</span></label>
                      <input
                        id="postJobLoc"
                        type="text"
                        placeholder="e.g. Delhi / Okhla (Hybrid)"
                        required
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="postJobExp">Experience Level <span className="req">*</span></label>
                      <input
                        id="postJobExp"
                        type="text"
                        placeholder="e.g. 1-3 Years / Freshers"
                        required
                        value={newJob.experience}
                        onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label htmlFor="postJobSalary">Compensation / Salary Range <span className="req">*</span></label>
                    <input
                      id="postJobSalary"
                      type="text"
                      placeholder="e.g. ₹4.5L - ₹6.5L P.A. or ₹20,000 / month"
                      required
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 3: Job Description & Specifications */}
                <div className="form-section-box">
                  <h4 className="section-title">3. Specifications & Responsibilities</h4>
                  
                  <div className="form-group">
                    <label htmlFor="postJobOverview">Role Overview / Summary <span className="req">*</span></label>
                    <textarea
                      id="postJobOverview"
                      rows={3}
                      placeholder="Brief overview explaining what this role entails..."
                      required
                      value={newJob.overview}
                      onChange={(e) => setNewJob({ ...newJob, overview: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postJobResp">
                      Key Responsibilities <span className="req">*</span>
                      <span className="field-hint">(Enter each bullet on a new line)</span>
                    </label>
                    <textarea
                      id="postJobResp"
                      rows={4}
                      placeholder="Lead end-to-end recruitment pipelines&#10;Screen candidate profiles and conduct HR interviews&#10;Coordinate with client HR leaders"
                      required
                      value={newJob.responsibilities}
                      onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postJobReq">
                      Candidate Requirements & Qualifications <span className="req">*</span>
                      <span className="field-hint">(Enter each requirement on a new line)</span>
                    </label>
                    <textarea
                      id="postJobReq"
                      rows={4}
                      placeholder="Bachelor's or Master's degree in HR or relevant field&#10;Excellent verbal and written English communication&#10;Proficiency in ATS and spreadsheet reporting"
                      required
                      value={newJob.requirements}
                      onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postJobBen">
                      Perks & Benefits (Optional)
                      <span className="field-hint">(Enter each perk on a new line)</span>
                    </label>
                    <textarea
                      id="postJobBen"
                      rows={3}
                      placeholder="Health Insurance&#10;Quarterly Performance Bonuses&#10;Hybrid Working Model"
                      value={newJob.benefits}
                      onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-submit-row">
                  <button 
                    type="submit" 
                    className="btn btn-primary publish-job-btn"
                    disabled={postJobLoading}
                  >
                    {postJobLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Publishing to Google Sheets...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={18} /> Publish Job Opening
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: CANDIDATE APPLICATIONS */}
        {/* ==================================================================== */}
        {activeTab === 'applications' && (
          <div className="tab-content">
            
            {/* Filter by Job Banner (if active) */}
            {filterByJobId && (
              <div className="active-filter-banner card">
                <div className="filter-banner-text">
                  <Filter size={16} />
                  <span>Showing applicants for Job: <strong>{filterByJobId}</strong></span>
                </div>
                <button 
                  className="btn-clear-filter"
                  onClick={() => setFilterByJobId(null)}
                >
                  <X size={14} /> Clear Filter (Show All Jobs)
                </button>
              </div>
            )}

            <div className="apps-control-bar card">
              <div className="apps-search">
                <Search size={17} className="apps-search-icon" />
                <input
                  type="text"
                  placeholder="Search applicants by name, email, or role..."
                  value={appSearchQuery}
                  onChange={(e) => setAppSearchQuery(e.target.value)}
                />
              </div>

              <div className="apps-status-filter">
                <span>Status:</span>
                {['All', 'New', 'Reviewing', 'Shortlisted', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    className={`status-pill ${appFilterStatus === status ? 'active' : ''}`}
                    onClick={() => setAppFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredApps.length === 0 ? (
              <div className="no-data-card card text-center">
                <Users size={40} className="no-data-icon" />
                <h3>No Applications Found</h3>
                <p>
                  {filterByJobId 
                    ? `No candidate has submitted an application for ${filterByJobId} yet.`
                    : 'No candidates match your current filter criteria.'}
                </p>
                {filterByJobId && (
                  <button 
                    className="btn btn-outline"
                    onClick={() => setFilterByJobId(null)}
                    style={{ marginTop: '1rem' }}
                  >
                    Show All Applications
                  </button>
                )}
              </div>
            ) : (
              <div className="applications-list">
                {filteredApps.map((app) => (
                  <div className="app-card card" key={app.applicationId}>
                    <div className="app-card-header">
                      <div>
                        <span className="app-job-tag">{app.jobTitle}</span>
                        <h3 className="app-candidate-name">{app.candidateName}</h3>
                        <span className="app-id-tag">ID: {app.applicationId}</span>
                      </div>

                      <div className="app-status-box">
                        <label>Status:</label>
                        <select
                          value={app.status || 'New'}
                          onChange={(e) => handleStatusChange(app.applicationId, e.target.value)}
                          className={`status-select status-${(app.status || 'new').toLowerCase()}`}
                        >
                          <option value="New">New</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="app-card-details">
                      <div className="app-detail-item">
                        <Mail size={15} /> <span>{app.email}</span>
                      </div>
                      <div className="app-detail-item">
                        <Phone size={15} /> <span>{app.phone}</span>
                      </div>
                      <div className="app-detail-item">
                        <Calendar size={15} /> 
                        <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                      {app.degree && (
                        <div className="app-detail-item">
                          <strong>Degree:</strong> <span>{app.degree}</span>
                        </div>
                      )}
                      {app.experience && (
                        <div className="app-detail-item">
                          <strong>Experience:</strong> <span>{app.experience}</span>
                        </div>
                      )}
                    </div>

                    {app.coverNote && (
                      <div className="app-cover-note">
                        <strong>Candidate Pitch:</strong> "{app.coverNote}"
                      </div>
                    )}

                    <div className="app-card-actions">
                      <div className="resume-download-box">
                        <FileText size={18} className="text-accent" />
                        <span className="resume-filename">{app.resumeFileName || 'Resume.pdf'}</span>
                        
                        {app.resumeDriveUrl ? (
                          <a 
                            href={app.resumeDriveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-resume-view"
                          >
                            <ExternalLink size={14} /> View Resume in Google Drive
                          </a>
                        ) : (
                          <span className="no-resume-tag">No file attached</span>
                        )}
                      </div>

                      <div className="quick-contact-actions">
                        <a 
                          href={`mailto:${app.email}?subject=Regarding your application for ${encodeURIComponent(app.jobTitle)} at ELVO HR`}
                          className="btn btn-outline btn-contact"
                        >
                          <Mail size={14} /> Email Student
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: USER MANAGEMENT (ADMIN ONLY) */}
        {/* ==================================================================== */}
        {activeTab === 'admins' && (
          <div className="tab-content">
            {isAdmin ? (
              <div className="admins-management-grid">
                
                {/* Left Column: Add New User */}
                <div className="add-admin-card card">
                  <div className="card-heading-row">
                    <UserPlus size={22} className="text-accent" />
                    <div>
                      <h3>Add New Portal User</h3>
                      <p className="card-sub">
                        Create an authorized user with either <strong>Admin</strong> or <strong>User</strong> privileges.
                      </p>
                    </div>
                  </div>

                  {addAdminSuccess && (
                    <div className="post-alert-success">
                      <CheckCircle size={18} />
                      <span>{addAdminSuccess}</span>
                    </div>
                  )}

                  {addAdminError && (
                    <div className="post-alert-error">
                      <AlertCircle size={18} />
                      <span>{addAdminError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddAdmin} className="add-admin-form">
                    <div className="form-group">
                      <label htmlFor="adminName">Full Name *</label>
                      <input
                        id="adminName"
                        type="text"
                        placeholder="e.g. Ramesh Chandra"
                        required
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="adminEmail">Email Address (Login ID) *</label>
                      <input
                        id="adminEmail"
                        type="email"
                        placeholder="e.g. ramesh@elvohr.com"
                        required
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="adminPassword">Login Password *</label>
                      <input
                        id="adminPassword"
                        type="password"
                        placeholder="Create a secure password"
                        required
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="adminRole">Access Role *</label>
                      <select
                        id="adminRole"
                        value={newAdmin.role}
                        onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                      >
                        <option value="User">User (Manage jobs & view candidate applications)</option>
                        <option value="Admin">Admin (Full Control: add/delete users, edit passwords & settings)</option>
                      </select>
                      <span className="hint-text">Two levels only: <strong>Admin</strong> or <strong>User</strong>.</span>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={addAdminLoading}>
                      {addAdminLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Adding to Database...
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} /> Add User Account
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Column: Existing Users */}
                <div className="existing-admins-card card">
                  <h3>Portal Users & Access Rights</h3>
                  <p className="card-sub">
                    Authorized staff members configured in Google Sheets <strong>Admins</strong> tab.
                  </p>

                  <div className="admins-list">
                    {adminUsers.map((admin, idx) => {
                      const isSelf = admin.email?.toLowerCase() === currentUser?.email?.toLowerCase();
                      const isUserAdmin = admin.role === 'Admin';
                      return (
                        <div className="admin-user-row" key={idx}>
                          <div className="admin-user-avatar">
                            {admin.name ? admin.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="admin-user-info">
                            <div className="user-name-line">
                              <strong>{admin.name || 'Portal User'}</strong>
                              {isSelf && <span className="badge-self">(You)</span>}
                            </div>
                            <span className="admin-user-email">{admin.email}</span>
                            <div className="admin-user-badges">
                              <span className={`badge-role ${isUserAdmin ? 'role-badge-admin' : 'role-badge-user'}`}>
                                {isUserAdmin ? '🛡️ Admin' : '👤 User'}
                              </span>
                              <span className="badge-status status-active">Active</span>
                            </div>
                          </div>

                          {/* Admin Action Buttons */}
                          <div className="admin-user-actions">
                            <button
                              type="button"
                              className="btn btn-outline btn-user-action"
                              onClick={() => {
                                setPasswordModalUser(admin);
                                setNewPasswordInput('');
                                setPasswordModalError('');
                                setPasswordModalSuccess('');
                              }}
                              title="Modify Password"
                            >
                              <Key size={13} /> Change Password
                            </button>

                            {!isSelf ? (
                              <button
                                type="button"
                                className="btn btn-outline btn-user-action btn-delete-user"
                                onClick={() => {
                                  setDeleteConfirmUser(admin);
                                  setDeleteError('');
                                }}
                                title="Delete User from Dashboard"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            ) : (
                              <span className="self-tag">Protected</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="sheet-sync-hint">
                    <p>💡 <strong>Security Note:</strong> Only accounts with the <code>Admin</code> role can create users, change user passwords, or delete accounts.</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="access-denied-card card text-center">
                <ShieldAlert size={52} className="text-danger" />
                <h3>Admin Access Restricted</h3>
                <p>User management is restricted to Administrators only. Your current role is <strong>User</strong>.</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('jobs')}>
                  Return to Job Openings
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: GOOGLE WORKSPACE SETTINGS (ADMIN ONLY) */}
        {/* ==================================================================== */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            {isAdmin ? (
              <div className="settings-card card">
                <h3>Google Workspace Configuration</h3>
                <p className="settings-sub">
                  Connect your Google Sheets and Google Drive via Google Apps Script Web App. This provides a 100% free serverless backend without external databases.
                </p>

                {connectionMessage && (
                  <div className={`connection-alert alert-${connectionMessage.type}`}>
                    {connectionMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{connectionMessage.text}</span>
                  </div>
                )}

                <div className="settings-input-group">
                  <label htmlFor="settingsScriptUrl">Google Apps Script Web App URL</label>
                  <input
                    id="settingsScriptUrl"
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={scriptUrlInput}
                    onChange={(e) => setScriptUrlInput(e.target.value)}
                  />
                  <span className="hint-text">
                    Follow the instructions in <code>google-apps-script/README.md</code> to deploy your Apps Script Web App in 3 minutes.
                  </span>
                </div>

                <div className="settings-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleSaveScriptUrl}
                    disabled={testingConnection}
                  >
                    {testingConnection ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Verifying Connection...
                      </>
                    ) : (
                      'Save & Verify Connection'
                    )}
                  </button>
                </div>

                <div className="workspace-guide-box">
                  <h4>Sheets Created in Your Google Spreadsheet:</h4>
                  <ol>
                    <li><strong><code>Jobs</code></strong>: Stores all active and closed job posts.</li>
                    <li><strong><code>Applications</code></strong>: Stores student applications with direct Google Drive resume links.</li>
                    <li><strong><code>Admins</code></strong>: Stores email IDs, passwords, and roles (Admin/User).</li>
                    <li><strong><code>ELVO_HR_Resumes</code> Folder</strong>: Holds uploaded candidate resumes in Google Drive.</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="access-denied-card card text-center">
                <ShieldAlert size={52} className="text-danger" />
                <h3>Admin Access Restricted</h3>
                <p>Google Workspace settings and script endpoints are restricted to Administrators only.</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('jobs')}>
                  Return to Job Openings
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 1: MODIFY USER PASSWORD (ADMIN ONLY) */}
        {/* ==================================================================== */}
        {passwordModalUser && (
          <div className="admin-modal-backdrop" onClick={() => setPasswordModalUser(null)}>
            <div className="admin-modal-card card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <div className="modal-title-box">
                  <Key size={22} className="text-accent" />
                  <div>
                    <h3>Change User Password</h3>
                    <p className="modal-sub">Updating password for <strong>{passwordModalUser.email}</strong></p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-modal-close" 
                  onClick={() => setPasswordModalUser(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {passwordModalSuccess && (
                <div className="post-alert-success">
                  <CheckCircle size={18} />
                  <span>{passwordModalSuccess}</span>
                </div>
              )}
              {passwordModalError && (
                <div className="post-alert-error">
                  <AlertCircle size={18} />
                  <span>{passwordModalError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="modalNewPass">New Password *</label>
                  <input
                    id="modalNewPass"
                    type="text"
                    placeholder="Enter new password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                  />
                  <span className="hint-text">The user will immediately use this new password on next sign-in.</span>
                </div>

                <div className="modal-btn-row">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setPasswordModalUser(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={passwordModalLoading}
                  >
                    {passwordModalLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 2: DELETE USER CONFIRMATION (ADMIN ONLY) */}
        {/* ==================================================================== */}
        {deleteConfirmUser && (
          <div className="admin-modal-backdrop" onClick={() => setDeleteConfirmUser(null)}>
            <div className="admin-modal-card card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <div className="modal-title-box">
                  <Trash2 size={22} className="text-danger" />
                  <div>
                    <h3>Delete User Account</h3>
                    <p className="modal-sub">Permanently revoke dashboard access</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-modal-close" 
                  onClick={() => setDeleteConfirmUser(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="delete-warning-box">
                <p>Are you sure you want to delete this user from the system?</p>
                <div className="delete-user-preview">
                  <strong>{deleteConfirmUser.name || 'User'}</strong>
                  <span>{deleteConfirmUser.email} • Role: {deleteConfirmUser.role}</span>
                </div>
                <p className="warning-note">
                  This will remove the user row from your Google Sheets <code>Admins</code> tab.
                </p>
              </div>

              {deleteError && (
                <div className="post-alert-error">
                  <AlertCircle size={18} />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="modal-btn-row">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setDeleteConfirmUser(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger-action"
                  disabled={deleteLoading}
                  onClick={() => executeDeleteUser(deleteConfirmUser.email)}
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    'Yes, Delete User'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PortalAdminPage;
