import React, { useEffect } from 'react';

/**
 * Maps human-readable job types to schema.org employmentType enum
 */
function getEmploymentType(type) {
  if (!type) return 'FULL_TIME';
  const t = type.toLowerCase();
  if (t.includes('intern')) return 'INTERN';
  if (t.includes('contract')) return 'CONTRACTOR';
  if (t.includes('part')) return 'PART_TIME';
  if (t.includes('temporary')) return 'TEMPORARY';
  return 'FULL_TIME';
}

/**
 * Parses salary string into numerical schema value
 */
function parseSalary(salaryStr) {
  if (!salaryStr) return null;
  const isMonth = salaryStr.toLowerCase().includes('/ mo') || salaryStr.toLowerCase().includes('month');
  const numbers = salaryStr.match(/\d+(\.\d+)?/g);
  
  if (!numbers || numbers.length === 0) return null;

  let min = parseFloat(numbers[0]);
  let max = numbers.length > 1 ? parseFloat(numbers[1]) : min;

  // If in Lakhs (L)
  if (salaryStr.includes('L') || salaryStr.includes('Lakh')) {
    min = min * 100000;
    max = max * 100000;
  }

  return {
    currency: 'INR',
    unitText: isMonth ? 'MONTH' : 'YEAR',
    minValue: Math.round(min),
    maxValue: Math.round(max)
  };
}

/**
 * Builds Google for Jobs (JobPosting) structured data schema
 */
export function buildJobSchema(job) {
  if (!job) return null;

  const isRemote = job.location?.toLowerCase().includes('remote');
  const salaryInfo = parseSalary(job.salary);
  
  // Format HTML description for rich display in Google Jobs
  const descriptionHtml = `
    <p><strong>Job Overview:</strong> ${job.overview || ''}</p>
    ${job.responsibilities && job.responsibilities.length > 0 ? `
      <h3>Key Responsibilities:</h3>
      <ul>
        ${job.responsibilities.map((r) => `<li>${r}</li>`).join('')}
      </ul>
    ` : ''}
    ${job.requirements && job.requirements.length > 0 ? `
      <h3>Qualifications & Requirements:</h3>
      <ul>
        ${job.requirements.map((req) => `<li>${req}</li>`).join('')}
      </ul>
    ` : ''}
    ${job.benefits && job.benefits.length > 0 ? `
      <h3>Perks & Benefits:</h3>
      <ul>
        ${job.benefits.map((b) => `<li>${b}</li>`).join('')}
      </ul>
    ` : ''}
  `.trim();

  // Valid through 90 days from postedDate
  const postedDate = job.postedDate ? new Date(job.postedDate) : new Date();
  const validThrough = new Date(postedDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: descriptionHtml,
    identifier: {
      '@type': 'PropertyValue',
      name: 'ELVO HR',
      value: job.id
    },
    datePosted: postedDate.toISOString(),
    validThrough: validThrough,
    employmentType: getEmploymentType(job.type),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'ELVO HR',
      sameAs: 'https://elvohr.com',
      logo: 'https://elvohr.com/assets/logo.png'
    },
    directApply: true
  };

  if (isRemote) {
    schema.jobLocationType = 'TELECOMMUTE';
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: 'India'
    };
  } else {
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Pocket D, Okhla Phase-2',
        addressLocality: 'New Delhi',
        addressRegion: 'Delhi',
        postalCode: '110020',
        addressCountry: 'IN'
      }
    };
  }

  if (salaryInfo) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: salaryInfo.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: salaryInfo.minValue,
        maxValue: salaryInfo.maxValue,
        unitText: salaryInfo.unitText
      }
    };
  }

  return schema;
}

/**
 * Universal SEO & Meta Tag Management Component
 */
const SEO = ({
  title = 'ELVO HR - End-to-End HR & Workforce Management Solutions',
  description = 'Your trusted HR partner across recruitment, staffing, payroll management, and statutory compliance in India.',
  keywords = 'HR consultancy, staffing agency, recruitment in India, payroll services, compliance, jobs in Delhi',
  canonical = '',
  ogType = 'website',
  ogImage = 'https://elvohr.com/hero-creative.png',
  job = null,
  jobsList = null
}) => {
  useEffect(() => {
    // 1. Title Tag
    const fullTitle = title.includes('ELVO HR') ? title : `${title} | ELVO HR`;
    document.title = fullTitle;

    // Helper to safely set/update meta tag
    const setMeta = (nameAttr, nameVal, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, nameVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper for link tags (canonical)
    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Canonical URL
    const canonicalUrl = canonical 
      ? (canonical.startsWith('http') ? canonical : `https://elvohr.com${canonical}`)
      : window.location.href;
    setLink('canonical', canonicalUrl);

    // 4. OpenGraph (Facebook / LinkedIn)
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'ELVO HR');
    setMeta('property', 'og:image', ogImage);

    // 5. Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    const scriptId = 'elvo-seo-schema';
    let scriptEl = document.getElementById(scriptId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    let schemaData = [];

    // Organization Schema
    schemaData.push({
      '@context': 'https://schema.org',
      '@type': 'EmploymentAgency',
      name: 'ELVO HR',
      url: 'https://elvohr.com',
      logo: 'https://elvohr.com/assets/logo.png',
      image: 'https://elvohr.com/hero-creative.png',
      description: 'Premier human resources and staffing solutions partner in India.',
      telephone: '+91-1800-22-4456',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Pocket D, Okhla Phase-2',
        addressLocality: 'New Delhi',
        addressRegion: 'Delhi',
        postalCode: '110020',
        addressCountry: 'IN'
      }
    });

    // Single Job Google for Jobs Schema
    if (job) {
      const jobSchema = buildJobSchema(job);
      if (jobSchema) schemaData.push(jobSchema);
    }

    // List of Jobs (JobPosting schemas for Google Jobs)
    if (jobsList && Array.isArray(jobsList) && jobsList.length > 0) {
      jobsList.slice(0, 20).forEach((j) => {
        const jSchema = buildJobSchema(j);
        if (jSchema) schemaData.push(jSchema);
      });
    }

    scriptEl.textContent = JSON.stringify(schemaData.length === 1 ? schemaData[0] : schemaData);
  }, [title, description, keywords, canonical, ogType, ogImage, job, jobsList]);

  return null;
};

export default SEO;
