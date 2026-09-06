import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Upload, Briefcase, MapPin, Clock, IndianRupee, 
  ArrowRight, Sparkles, RefreshCw, Share2, Check, Link2,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { fetchJobs } from '../services/jobPortalService';
import JobDetailModal from './JobDetailModal';
import JobApplyModal from './JobApplyModal';
import './Careers.css';

const PAGINATION_THRESHOLD = 15;
const JOBS_PER_PAGE = 8; // When listings >= 15, divide into clean numbered pages (8 per page)

const Careers = ({ initialJobId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [copiedJobId, setCopiedJobId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  const loadJobsList = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs();
      setJobs(data || []);
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobsList();
  }, []);

  // Auto-open job modal if shared URL has initialJobId
  useEffect(() => {
    if (initialJobId && jobs.length > 0) {
      const target = jobs.find(
        (j) => j.id?.toLowerCase() === initialJobId.toLowerCase() ||
               j.id?.toLowerCase().replace('-', '') === initialJobId.toLowerCase().replace('-', '')
      );
      if (target) {
        setSelectedJobForDetail(target);
        document.title = `${target.title} | ELVO HR Careers`;
      }
    }
  }, [initialJobId, jobs]);

  const handleShareJob = (e, job) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const url = `${window.location.origin}/careers/${job.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopiedJobId(job.id);
    setToastMsg(`Shareable link for "${job.title}" copied!`);
    setTimeout(() => {
      setCopiedJobId(null);
      setToastMsg('');
    }, 2500);
  };

  // Compute job types
  const jobTypes = useMemo(() => {
    const set = new Set(jobs.map((j) => j.type).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.overview && job.overview.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'All' || job.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [jobs, searchQuery, selectedType]);

  // Reset to page 1 whenever search query or job type filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  // Paginate if listings >= 15
  const totalFilteredJobs = filteredJobs.length;
  const isPaginated = totalFilteredJobs >= PAGINATION_THRESHOLD;
  const totalPages = isPaginated ? Math.ceil(totalFilteredJobs / JOBS_PER_PAGE) : 1;

  const displayedJobs = useMemo(() => {
    if (!isPaginated) return filteredJobs;
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, isPaginated, currentPage]);

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
        
        {/* Header */}
        <div className="section-header text-center">
          <div className="careers-header-badge">
            <Sparkles size={16} /> Verified Career Opportunities
          </div>
          <h2>Find Your Next Career Move</h2>
          <p className="subtitle">
            Explore curated job openings, internships, and associate programs with ELVO HR and partner enterprises.
          </p>
        </div>

        {/* Search and Filter Box */}
        <div className="careers-search-card card">
          <div className="search-bar-wrap">
            <div className="search-input-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search job title, skills, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <button 
              className="btn btn-secondary open-app-btn"
              onClick={() => setSelectedJobForApply({ id: 'GENERAL', title: 'General Open Application' })}
            >
              <Upload size={18} /> Upload Resume
            </button>
          </div>

          {/* Job Type Filter */}
          <div className="filters-row">
            <div className="filter-group">
              <span className="filter-label"><Briefcase size={14} /> Job Type:</span>
              <div className="filter-pills">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    className={`filter-pill ${selectedType === type ? 'active' : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Openings Section */}
        <div className="openings-header-row" id="active-openings">
          <div className="openings-count-box">
            <h3>Active Openings</h3>
            <span className="count-tag">
              {isPaginated 
                ? `${totalFilteredJobs} Positions (Page ${currentPage} of ${totalPages})`
                : `${totalFilteredJobs} Positions Available`}
            </span>
          </div>

          <div className="openings-actions">
            <button 
              className="btn-refresh" 
              onClick={loadJobsList}
              title="Refresh listings"
              aria-label="Refresh job listings"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="jobs-loading-box">
            <div className="loading-spinner"></div>
            <p>Fetching active openings from ELVO HR Workspace...</p>
          </div>
        ) : totalFilteredJobs === 0 ? (
          <div className="no-jobs-box card text-center">
            <Briefcase size={44} className="no-jobs-icon" />
            <h4>No matching jobs found</h4>
            <p>Try tweaking your search keywords or clear your job type filter.</p>
            <div className="no-jobs-actions">
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('All');
                }}
              >
                Reset Filters
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setSelectedJobForApply({ id: 'GENERAL', title: 'General Open Application' })}
              >
                <Upload size={16} /> Drop Your Resume Anyway
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {displayedJobs.map((job) => (
                <div className="job-card card" key={job.id}>
                  <div className="job-card-top">
                    <div className="job-card-badges">
                      <span className="badge-dept">{job.department}</span>
                      <span className="badge-type">{job.type}</span>
                    </div>
                    <span className={`badge-status ${job.status === 'Active' ? 'status-active' : 'status-closed'}`}>
                      {job.status === 'Active' ? 'Active' : 'Closed'}
                    </span>
                  </div>

                  <h3 className="job-card-title">{job.title}</h3>

                  <div className="job-card-meta">
                    <div className="meta-col">
                      <MapPin size={15} /> <span>{job.location}</span>
                    </div>
                    <div className="meta-col">
                      <Clock size={15} /> <span>{job.experience}</span>
                    </div>
                    <div className="meta-col">
                      <IndianRupee size={15} /> <span>{job.salary}</span>
                    </div>
                  </div>

                  <p className="job-card-overview">
                    {job.overview || 'Explore exciting responsibilities and career advancement opportunities in this role.'}
                  </p>

                  <div className="job-card-footer">
                    <div className="job-card-footer-left">
                      <button 
                        className="btn btn-card-details"
                        onClick={() => setSelectedJobForDetail(job)}
                      >
                        View Details
                      </button>
                      <button 
                        className={`btn-card-share ${copiedJobId === job.id ? 'copied' : ''}`}
                        onClick={(e) => handleShareJob(e, job)}
                        title="Copy shareable link for this opening"
                      >
                        {copiedJobId === job.id ? (
                          <>
                            <Check size={14} /> <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={14} /> <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                    <button 
                      className="btn btn-primary btn-card-apply"
                      disabled={job.status !== 'Active'}
                      onClick={() => setSelectedJobForApply(job)}
                    >
                      Apply Now <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Numbered Pagination (Displayed when total listings >= 15) */}
            {isPaginated && totalPages > 1 && (
              <div className="careers-pagination card">
                <div className="pagination-info">
                  Showing <strong>{(currentPage - 1) * JOBS_PER_PAGE + 1}–{Math.min(currentPage * JOBS_PER_PAGE, totalFilteredJobs)}</strong> of <strong>{totalFilteredJobs}</strong> Openings
                </div>
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn nav-btn"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      document.getElementById('active-openings')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={16} /> <span>Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`pagination-btn num-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.getElementById('active-openings')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      aria-label={`Page ${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button 
                    className="pagination-btn nav-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                      document.getElementById('active-openings')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label="Next Page"
                  >
                    <span>Next</span> <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* General Resume Drop Box */}
        <div className="open-application-card card">
          <div className="open-app-content">
            <div className="open-app-icon-wrap">
              <Upload size={32} className="open-app-icon" />
            </div>
            <div className="open-app-text">
              <h3>Can't find the exact position you're looking for?</h3>
              <p>
                Submit your open application and upload your resume. Our recruitment directors review incoming profiles daily and will contact you when a matching corporate role opens up.
              </p>
            </div>
          </div>
          <button 
            className="btn btn-primary open-app-cta-btn"
            onClick={() => setSelectedJobForApply({ id: 'GENERAL', title: 'General Open Application' })}
          >
            <Upload size={18} /> Drop Your Resume
          </button>
        </div>

        {/* Industry and Opportunity Highlights */}
        <div className="careers-grid">
          <div className="careers-list-box card">
            <h3>Find Opportunities Across Industries</h3>
            <ul className="pill-list">
              {industries.map((ind, i) => <li key={i} className="pill">{ind}</li>)}
            </ul>
          </div>
          
          <div className="careers-list-box card">
            <h3>Explore Diverse Employment Types</h3>
            <ul className="pill-list">
              {opportunities.map((opp, i) => <li key={i} className="pill">{opp}</li>)}
            </ul>
          </div>
        </div>

      </div>

      {/* Floating Share Toast Notification */}
      {toastMsg && (
        <div className="share-toast-pill">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Modals */}
      <JobDetailModal
        job={selectedJobForDetail}
        isOpen={Boolean(selectedJobForDetail)}
        onClose={() => setSelectedJobForDetail(null)}
        onShare={handleShareJob}
        onApply={(job) => {
          setSelectedJobForDetail(null);
          setSelectedJobForApply(job);
        }}
      />

      <JobApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        onSuccess={() => {
          loadJobsList();
        }}
      />

    </section>
  );
};

export default Careers;
