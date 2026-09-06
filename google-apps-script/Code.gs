/**
 * =========================================================================
 * ELVO HR - Google Workspace Backend (Google Sheets & Google Drive)
 * =========================================================================
 * 
 * Instructions:
 * 1. Open Google Sheets (create a new blank spreadsheet or use an existing one).
 * 2. Name your spreadsheet: "ELVO HR Portal Database"
 * 3. Go to Extensions > Apps Script.
 * 4. Replace the code in Code.gs with this entire file.
 * 5. Click "Deploy" > "New deployment" > Select type "Web app":
 *    - Execute as: "Me" (your Google Workspace account)
 *    - Who has access: "Anyone" (allows candidates to submit resumes)
 * 6. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 7. Paste that Web App URL into your ELVO HR Admin Portal settings!
 * =========================================================================
 */

// Configuration
const RESUME_FOLDER_NAME = "ELVO_HR_Resumes";
const ADMIN_PASSKEY = "elvo2026"; // Master fallback passkey
const SENDER_NAME = "ELVO HR Careers & Recruitment";
const PRIMARY_ADMIN_EMAIL = "info@elvohr.com";

/**
 * Automatically initializes sheet headers if they don't exist
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Jobs Sheet
  let jobsSheet = ss.getSheetByName("Jobs");
  if (!jobsSheet) {
    jobsSheet = ss.insertSheet("Jobs");
    jobsSheet.appendRow([
      "Job ID", "Title", "Department", "Location", "Type", 
      "Experience", "Salary", "Overview", "Responsibilities", 
      "Requirements", "Benefits", "Status", "PostedDate"
    ]);
    jobsSheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#EEF2F6");
    jobsSheet.setFrozenRows(1);
    
    // Default initial jobs
    jobsSheet.appendRow([
      "JOB-101",
      "Talent Acquisition Specialist",
      "Human Resources",
      "Delhi / Okhla (Hybrid)",
      "Full-time",
      "1-3 Years",
      "₹4.5L - ₹6.5L P.A.",
      "Manage end-to-end recruitment pipelines for IT and Non-IT clients.",
      "Source candidates via LinkedIn and job boards\nScreen resumes and conduct HR interviews\nCoordinate with enterprise client HR managers",
      "Bachelor's degree in HR or relevant field\nExcellent verbal and written communication\nProficiency with ATS and Excel",
      "Health Insurance, Performance Bonus, Hybrid Flexibility",
      "Active",
      new Date().toISOString()
    ]);

    jobsSheet.appendRow([
      "JOB-102",
      "HR Operations Intern",
      "Human Resources",
      "Delhi / Okhla (On-site)",
      "Internship",
      "Freshers / College Students",
      "₹15,000 - ₹20,000 / month",
      "Learn and assist in associate onboarding, documentation, and compliance management.",
      "Support documentation for new hires\nMaintain employee digital records\nAssist in payroll processing checks",
      "Recent graduate or final year student (BBA/MBA/B.Com)\nAttention to detail and eagerness to learn\nBasic MS Office skills",
      "PPO Opportunity based on performance, Mentorship, Certificate",
      "Active",
      new Date().toISOString()
    ]);
  }

  // 2. Applications Sheet
  let appsSheet = ss.getSheetByName("Applications");
  if (!appsSheet) {
    appsSheet = ss.insertSheet("Applications");
    appsSheet.appendRow([
      "Application ID", "Job ID", "Job Title", "Candidate Name", 
      "Email", "Phone", "Degree / College", "Experience", 
      "Portfolio / LinkedIn", "Cover Note", "Resume File Name", 
      "Resume Drive URL", "AppliedAt", "Status"
    ]);
    appsSheet.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#EEF2F6");
    appsSheet.setFrozenRows(1);
  }

  // 3. Admins Sheet (Email & Password authentication)
  let adminsSheet = ss.getSheetByName("Admins");
  if (!adminsSheet) {
    adminsSheet = ss.insertSheet("Admins");
    adminsSheet.appendRow([
      "Email", "Password", "Name", "Role", "Status", "CreatedAt"
    ]);
    adminsSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#EEF2F6");
    adminsSheet.setFrozenRows(1);

    // Default admin and user accounts (Two roles: Admin and User)
    adminsSheet.appendRow([
      "info@elvohr.com",
      "admin123",
      "ELVO HR Superadmin",
      "Admin",
      "Active",
      new Date().toISOString()
    ]);

    adminsSheet.appendRow([
      "recruiter@elvohr.com",
      "user123",
      "Associate Recruiter",
      "User",
      "Active",
      new Date().toISOString()
    ]);
  }

  }

  // Ensure Google Drive folder for candidate resumes is created
  const resumeFolder = getOrCreateResumeFolder();

  return { jobsSheet, appsSheet, adminsSheet, resumeFolder };
}

/**
 * ONE-CLICK SETUP FUNCTION
 * Run this directly from the Apps Script toolbar (select 'initialSetup' -> click 'Run')
 * to instantly create all Sheets tabs and the 'ELVO_HR_Resumes' Google Drive folder!
 */
function initialSetup() {
  const result = setupSheets();
  Logger.log("✅ Setup Complete!");
  Logger.log("📁 Google Drive Resume Folder: " + result.resumeFolder.getName());
  Logger.log("🔗 Folder Link: " + result.resumeFolder.getUrl());
  return "Setup successful! Drive folder created at: " + result.resumeFolder.getUrl();
}

/**
 * Gets or creates the Google Drive folder for candidate resumes
 */
function getOrCreateResumeFolder() {
  const folders = DriveApp.getFoldersByName(RESUME_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  const folder = DriveApp.createFolder(RESUME_FOLDER_NAME);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
}

/**
 * Helper to generate JSON response with CORS headers
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeRole(r) {
  if (!r) return "User";
  const str = String(r).trim().toLowerCase();
  return (str === "admin" || str === "superadmin") ? "Admin" : "User";
}

/**
 * Safe Email Dispatcher using Google Workspace MailApp & GmailApp
 */
function sendEmailSafely(to, subject, htmlBody) {
  try {
    if (!to || typeof to !== "string" || !to.includes("@")) return false;
    MailApp.sendEmail({
      to: to.trim(),
      replyTo: PRIMARY_ADMIN_EMAIL,
      name: SENDER_NAME,
      subject: subject,
      htmlBody: htmlBody,
      body: htmlBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    });
    return true;
  } catch (err) {
    console.warn("MailApp sending error for " + to + ": " + err.toString());
    try {
      GmailApp.sendEmail(to.trim(), subject, htmlBody.replace(/<[^>]+>/g, ' '), {
        htmlBody: htmlBody,
        name: SENDER_NAME,
        replyTo: PRIMARY_ADMIN_EMAIL
      });
      return true;
    } catch (err2) {
      console.error("GmailApp sending failed for " + to + ": " + err2.toString());
      return false;
    }
  }
}

/**
 * 1. Confirmation sent to candidate upon submitting application/resume
 */
function sendApplicationConfirmationEmail(data) {
  const { candidateName, email, jobTitle, jobId, applicationId, resumeDriveUrl } = data;
  const subject = `[ELVO HR] Application Received: ${jobTitle} (${applicationId})`;
  
  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 30px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">ELVO HR</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #94A3B8;">Workforce Management & Talent Advisory</p>
    </div>
    <div style="padding: 28px 24px; color: #334155; font-size: 14px; line-height: 1.6;">
      <h2 style="color: #0F172A; font-size: 18px; margin-top: 0;">Application Received</h2>
      <p>Dear <strong>${candidateName}</strong>,</p>
      <p>Thank you for submitting your application to <strong>ELVO HR</strong>. We confirm that your profile and resume have been securely received and recorded in our system.</p>
      
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 42%;"><strong>Reference ID:</strong></td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${applicationId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;"><strong>Applied Position:</strong></td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${jobTitle} (${jobId})</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;"><strong>Current Status:</strong></td>
            <td style="padding: 6px 0;"><span style="background: #E0F2FE; color: #0369A1; padding: 3px 10px; border-radius: 12px; font-weight: 600; font-size: 12px;">Received / Under Review</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;"><strong>Date Received:</strong></td>
            <td style="padding: 6px 0; color: #0F172A;">${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
        </table>
      </div>

      <div style="background: #FEF9C3; border-left: 4px solid #EAB308; padding: 12px 16px; border-radius: 4px; color: #854D0E; font-size: 13px; line-height: 1.5; margin-bottom: 24px;">
        <strong>Next Steps & Matching Policy:</strong><br>
        Our talent acquisition consultants are actively screening incoming candidate profiles. If your qualifications match our active client requirements, our recruiters will contact you directly to schedule the first round of interviews. Furthermore, whenever similar career opportunities are published, our system will automatically notify you.
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="https://elvohr.com/careers" style="background: #0284C7; color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 6px; font-weight: 600; display: inline-block;">Browse All Active Openings</a>
      </div>

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0 16px 0;" />
      <p style="font-size: 12px; color: #64748B; margin: 0; line-height: 1.5;">
        <strong>ELVO HR Services</strong><br>
        Pocket D, Okhla Phase-2, Delhi 110020<br>
        Inquiries: <a href="mailto:info@elvohr.com" style="color: #0284C7;">info@elvohr.com</a> | <a href="https://elvohr.com" style="color: #0284C7;">elvohr.com</a>
      </p>
    </div>
  </div>`;

  sendEmailSafely(email, subject, html);
}

/**
 * 2. Alert sent to Admin (info@elvohr.com) upon new candidate application
 */
function sendAdminApplicationAlert(data) {
  const {
    candidateName, email, phone, degree, experience, 
    portfolioUrl, coverNote, jobTitle, jobId, applicationId, 
    resumeDriveUrl, resumeFileName
  } = data;
  
  const subject = `[New Candidate Application] ${candidateName} applied for ${jobTitle} (${applicationId})`;
  
  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
    <div style="background: #0F172A; padding: 20px 24px; color: #ffffff;">
      <span style="background: #3B82F6; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">New Application</span>
      <h2 style="margin: 8px 0 0 0; font-size: 18px;">${candidateName} applied for ${jobTitle}</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #94A3B8;">Application ID: ${applicationId} | Job ID: ${jobId}</p>
    </div>
    <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.6;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr><td style="padding: 4px 0; color: #64748B; width: 35%;"><strong>Candidate Name:</strong></td><td style="padding: 4px 0; color: #0F172A;">${candidateName}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;"><strong>Email:</strong></td><td style="padding: 4px 0;"><a href="mailto:${email}" style="color: #0284C7;">${email}</a></td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;"><strong>Phone:</strong></td><td style="padding: 4px 0; color: #0F172A;">${phone}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;"><strong>Education:</strong></td><td style="padding: 4px 0; color: #0F172A;">${degree || 'Not provided'}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;"><strong>Experience:</strong></td><td style="padding: 4px 0; color: #0F172A;">${experience || 'Fresher'}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;"><strong>Portfolio / LinkedIn:</strong></td><td style="padding: 4px 0;">${portfolioUrl ? `<a href="${portfolioUrl}" style="color: #0284C7;" target="_blank">${portfolioUrl}</a>` : 'Not provided'}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;"><strong>Resume File:</strong></td><td style="padding: 4px 0; color: #0F172A;">${resumeFileName || 'Resume uploaded'}</td></tr>
      </table>

      ${coverNote ? `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
        <span style="font-size: 12px; font-weight: 700; color: #64748B;">Candidate Pitch / Statement:</span>
        <p style="margin: 4px 0 0 0; color: #334155; font-style: italic;">"${coverNote}"</p>
      </div>` : ''}

      <div style="margin: 24px 0 16px 0; display: flex; gap: 12px;">
        ${resumeDriveUrl ? `<a href="${resumeDriveUrl}" style="background: #10B981; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 13px;">View Resume in Google Drive &rarr;</a> ` : ''}
        <a href="https://elvohr.com/portal-admin" style="background: #0F172A; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 13px;">Review in Admin Portal &rarr;</a>
      </div>
    </div>
  </div>`;

  sendEmailSafely(PRIMARY_ADMIN_EMAIL, subject, html);
}

/**
 * 3. Alert sent when a new job is posted (to poster and info@elvohr.com)
 */
function sendJobPostedAlert(posterEmail, job) {
  const { jobId, title, department, location, type, salary, experience, overview } = job;
  const subject = `[ELVO HR] Job Opening Published: ${title} (${jobId})`;

  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
    <div style="background: #0F172A; padding: 22px 24px; color: #ffffff; text-align: center;">
      <h2 style="margin: 0; font-size: 20px;">Job Opening Published</h2>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #94A3B8;">${title} &bull; ${jobId}</p>
    </div>
    <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.6;">
      <p>A new career opening has been published by <strong>${posterEmail || 'Admin Team'}</strong> and is now live on <a href="https://elvohr.com/careers" style="color: #0284C7;">elvohr.com/careers</a> and indexed for Google for Jobs.</p>
      
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 3px 0;"><strong>Job Title:</strong> ${title}</p>
        <p style="margin: 3px 0;"><strong>Department:</strong> ${department || 'General'}</p>
        <p style="margin: 3px 0;"><strong>Location:</strong> ${location || 'Delhi / Hybrid'}</p>
        <p style="margin: 3px 0;"><strong>Employment Type:</strong> ${type || 'Full-time'}</p>
        <p style="margin: 3px 0;"><strong>Experience Level:</strong> ${experience || 'Any'}</p>
        <p style="margin: 3px 0;"><strong>Compensation:</strong> ${salary || 'Competitive'}</p>
        ${overview ? `<p style="margin: 8px 0 0 0; color: #64748B;"><em>${overview}</em></p>` : ''}
      </div>

      <div style="text-align: center; margin: 24px 0 12px 0;">
        <a href="https://elvohr.com/careers/${jobId}" style="background: #0284C7; color: #ffffff; text-decoration: none; padding: 11px 24px; border-radius: 6px; font-weight: 600; display: inline-block;">View Live Job Opening</a>
      </div>
    </div>
  </div>`;

  // Send to primary admin
  sendEmailSafely(PRIMARY_ADMIN_EMAIL, subject, html);

  // If posted by a different user/email, send confirmation to poster as well
  if (posterEmail && String(posterEmail).trim().toLowerCase() !== PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    sendEmailSafely(posterEmail, subject, html);
  }
}

/**
 * 4. Automated matching alert sent to past candidates when a similar job is posted
 */
function sendSingleCandidateJobAlert(toEmail, candidateName, job) {
  const { jobId, title, department, location, type, salary, overview } = job;
  const subject = `[ELVO HR Career Opportunity] New Opening Matching Your Background: ${title}`;

  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 24px; text-align: center; color: #ffffff;">
      <h2 style="margin: 0; font-size: 20px;">New Opportunity Matching Your Profile</h2>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #94A3B8;">ELVO HR Talent Network</p>
    </div>
    <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.6;">
      <p>Dear <strong>${candidateName}</strong>,</p>
      <p>We noticed you previously submitted your resume with ELVO HR. A new job opening has just been posted that closely aligns with your field and experience:</p>
      
      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px 0; color: #166534; font-size: 16px;">${title}</h3>
        <p style="margin: 4px 0; color: #374151; font-size: 13px;">📍 ${location || 'Delhi / Hybrid'} &bull; 💼 ${type || 'Full-time'} &bull; 💰 ${salary || 'Competitive'}</p>
        <p style="margin: 8px 0 0 0; color: #4B5563; font-size: 13px;">${overview || 'View full job description, key responsibilities, and qualifications on the portal.'}</p>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="https://elvohr.com/careers/${jobId}" style="background: #16A34A; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">View Position & Apply Now</a>
      </div>

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0 16px 0;" />
      <p style="font-size: 11px; color: #94A3B8; text-align: center; margin: 0;">
        You received this email because you previously applied with ELVO HR Services.<br>
        Pocket D, Okhla Phase-2, Delhi 110020 &bull; <a href="mailto:info@elvohr.com" style="color: #0284C7;">info@elvohr.com</a>
      </p>
    </div>
  </div>`;

  sendEmailSafely(toEmail, subject, html);
}

function sendMatchingJobAlertToCandidates(job) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Applications");
    if (!sheet) return;
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return;

    const notifiedEmails = new Set();
    const keywords = (job.title + " " + (job.department || "")).toLowerCase().split(/\s+/).filter(w => w.length > 2);

    for (let i = 1; i < rows.length; i++) {
      const email = String(rows[i][4] || "").trim().toLowerCase();
      const name = rows[i][3] || "Candidate";
      const pastJob = String(rows[i][2] || "").toLowerCase();
      const pastDegree = String(rows[i][6] || "").toLowerCase();

      if (!email || notifiedEmails.has(email) || !email.includes("@")) continue;

      const isGeneral = pastJob.includes("general") || pastJob.includes("open");
      const hasMatch = keywords.some(kw => pastJob.includes(kw) || pastDegree.includes(kw));

      if (isGeneral || hasMatch) {
        notifiedEmails.add(email);
        sendSingleCandidateJobAlert(email, name, job);
      }
    }
  } catch (err) {
    console.error("sendMatchingJobAlertToCandidates error: " + err.toString());
  }
}

/**
 * 5. Automated status update email sent to candidate when admin modifies status
 */
function sendApplicationStatusUpdateEmail(candidateEmail, candidateName, jobTitle, applicationId, newStatus) {
  if (!candidateEmail || !candidateEmail.includes("@")) return;
  const subject = `[ELVO HR] Status Update: Application for ${jobTitle} (${applicationId})`;

  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: #0F172A; padding: 24px; text-align: center; color: #ffffff;">
      <h2 style="margin: 0; font-size: 20px;">Application Status Update</h2>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #94A3B8;">ELVO HR Talent Acquisition</p>
    </div>
    <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.6;">
      <p>Dear <strong>${candidateName || 'Candidate'}</strong>,</p>
      <p>The review status of your application for <strong>${jobTitle}</strong> (ID: <strong>${applicationId}</strong>) has been updated:</p>
      
      <div style="text-align: center; margin: 24px 0;">
        <span style="background: #E0F2FE; color: #0369A1; padding: 10px 24px; border-radius: 20px; font-size: 16px; font-weight: 700; border: 1px solid #BAE6FD; display: inline-block;">
          ${newStatus}
        </span>
      </div>

      <p>Our recruitment team reviews applicant batches progressively. If any follow-up assessments or interviews are required, our HR specialists will reach out to you directly with scheduling details.</p>

      <div style="text-align: center; margin: 24px 0 16px 0;">
        <a href="https://elvohr.com/careers" style="background: #0284C7; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-weight: 600; display: inline-block;">Visit Careers Portal</a>
      </div>

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0 16px 0;" />
      <p style="font-size: 12px; color: #64748B; margin: 0;">
        <strong>ELVO HR Services</strong> &bull; Pocket D, Okhla Phase-2, Delhi 110020<br>
        Contact: <a href="mailto:info@elvohr.com" style="color: #0284C7;">info@elvohr.com</a>
      </p>
    </div>
  </div>`;

  sendEmailSafely(candidateEmail, subject, html);
}

/**
 * Verify admin credentials from Admins sheet or Master passkey
 */
function verifyAdmin(email, password, passkey) {
  if (passkey && passkey === ADMIN_PASSKEY) {
    return { valid: true, user: { email: "info@elvohr.com", name: "ELVO HR Superadmin", role: "Admin" } };
  }

  if (!email || !password) return { valid: false };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Admins");
  if (!sheet) return { valid: false };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowEmail = String(row[0]).trim().toLowerCase();
    const rowPass = String(row[1]).trim();
    const rowStatus = String(row[4]).trim();

    if (rowEmail === String(email).trim().toLowerCase() && rowPass === String(password).trim()) {
      if (rowStatus.toLowerCase() === "inactive") {
        return { valid: false, error: "This user account is currently deactivated." };
      }
      return { 
        valid: true, 
        user: { 
          email: row[0], 
          name: row[2] || "User", 
          role: normalizeRole(row[3])
        } 
      };
    }
  }
  return { valid: false, error: "Invalid email or password." };
}

/**
 * HTTP GET handler
 */
function doGet(e) {
  try {
    setupSheets();
    const action = (e && e.parameter && e.parameter.action) || "getJobs";
    const passkey = e && e.parameter && e.parameter.passkey;
    const email = e && e.parameter && e.parameter.email;
    const password = e && e.parameter && e.parameter.password;

    if (action === "getJobs") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Jobs");
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return createJsonResponse({ success: true, jobs: [] });
      }

      // Also get applications count per job
      const appsSheet = ss.getSheetByName("Applications");
      const appRows = appsSheet ? appsSheet.getDataRange().getValues() : [];
      const appCounts = {};
      for (let j = 1; j < appRows.length; j++) {
        const jId = appRows[j][1];
        appCounts[jId] = (appCounts[jId] || 0) + 1;
      }

      const jobs = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const jId = row[0];
        const job = {
          id: jId,
          title: row[1],
          department: row[2],
          location: row[3],
          type: row[4],
          experience: row[5],
          salary: row[6],
          overview: row[7],
          responsibilities: row[8] ? String(row[8]).split("\n").filter(Boolean) : [],
          requirements: row[9] ? String(row[9]).split("\n").filter(Boolean) : [],
          benefits: row[10] ? String(row[10]).split("\n").filter(Boolean) : [],
          status: row[11] || "Active",
          postedDate: row[12],
          applicationCount: appCounts[jId] || 0
        };
        jobs.push(job);
      }
      return createJsonResponse({ success: true, jobs: jobs });
    }

    if (action === "getApplications") {
      const auth = verifyAdmin(email, password, passkey);
      if (!auth.valid) {
        return createJsonResponse({ success: false, error: auth.error || "Unauthorized access: invalid admin credentials." });
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Applications");
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return createJsonResponse({ success: true, applications: [] });
      }

      const applications = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        applications.push({
          applicationId: row[0],
          jobId: row[1],
          jobTitle: row[2],
          candidateName: row[3],
          email: row[4],
          phone: row[5],
          degree: row[6],
          experience: row[7],
          portfolioUrl: row[8],
          coverNote: row[9],
          resumeFileName: row[10],
          resumeDriveUrl: row[11],
          appliedAt: row[12],
          status: row[13] || "New"
        });
      }
      return createJsonResponse({ success: true, applications: applications.reverse() });
    }

    if (action === "getAdminUsers") {
      const auth = verifyAdmin(email, password, passkey);
      if (!auth.valid) {
        return createJsonResponse({ success: false, error: "Unauthorized access: invalid credentials." });
      }

      if (auth.user.role !== "Admin") {
        return createJsonResponse({ success: false, error: "Access restricted: Only Admins can view user management." });
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Admins");
      const rows = sheet.getDataRange().getValues();
      const admins = [];
      for (let i = 1; i < rows.length; i++) {
        admins.push({
          email: rows[i][0],
          name: rows[i][2],
          role: normalizeRole(rows[i][3]),
          status: rows[i][4],
          createdAt: rows[i][5]
        });
      }
      return createJsonResponse({ success: true, admins: admins });
    }

    return createJsonResponse({ success: true, message: "ELVO HR Google Apps Script Service is Active." });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * HTTP POST handler
 */
function doPost(e) {
  try {
    setupSheets();
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    // 1. Admin Email & Password Login
    if (action === "adminLogin") {
      const { email, password } = payload;
      const auth = verifyAdmin(email, password, payload.passkey);
      if (auth.valid) {
        return createJsonResponse({
          success: true,
          user: auth.user,
          message: "Admin authentication successful!"
        });
      } else {
        return createJsonResponse({
          success: false,
          error: auth.error || "Incorrect admin email or password."
        });
      }
    }

    // 2. Candidate Application submission (Resume to Drive + details to Sheets)
    if (action === "applyJob") {
      const {
        jobId, jobTitle, candidateName, email, phone, 
        degree, experience, portfolioUrl, coverNote, 
        resumeFileName, resumeBase64, resumeMimeType
      } = payload;

      let resumeDriveUrl = "";
      if (resumeBase64) {
        const folder = getOrCreateResumeFolder();
        const decodedBytes = Utilities.base64Decode(resumeBase64);
        const blob = Utilities.newBlob(
          decodedBytes, 
          resumeMimeType || "application/pdf", 
          `${candidateName.replace(/[^a-zA-Z0-9]/g, "_")}_${resumeFileName || "Resume.pdf"}`
        );
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        resumeDriveUrl = file.getUrl();
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Applications");
      const applicationId = "APP-" + Date.now().toString().slice(-6);
      const appliedAt = new Date().toISOString();

      sheet.appendRow([
        applicationId,
        jobId || "GENERAL",
        jobTitle || "General Open Application",
        candidateName,
        email,
        phone,
        degree || "",
        experience || "",
        portfolioUrl || "",
        coverNote || "",
        resumeFileName || "Uploaded_File",
        resumeDriveUrl,
        appliedAt,
        "New"
      ]);

      // 1. Dispatch confirmation email to student / candidate
      sendApplicationConfirmationEmail({
        candidateName,
        email,
        jobTitle: jobTitle || "General Open Application",
        jobId: jobId || "GENERAL",
        applicationId,
        resumeDriveUrl
      });

      // 2. Dispatch alert to Admin team (info@elvohr.com)
      sendAdminApplicationAlert({
        candidateName,
        email,
        phone,
        degree,
        experience,
        portfolioUrl,
        coverNote,
        jobTitle: jobTitle || "General Open Application",
        jobId: jobId || "GENERAL",
        applicationId,
        resumeDriveUrl,
        resumeFileName
      });

      return createJsonResponse({ 
        success: true, 
        applicationId: applicationId,
        resumeDriveUrl: resumeDriveUrl,
        message: "Application submitted successfully! Confirmation email dispatched to candidate and notification sent to info@elvohr.com." 
      });
    }

    // 3. Post New Job (Admin only)
    if (action === "postJob") {
      const auth = verifyAdmin(payload.adminEmail, payload.adminPassword, payload.passkey);
      if (!auth.valid) {
        return createJsonResponse({ success: false, error: "Unauthorized: Invalid admin credentials." });
      }

      const {
        title, department, location, type, experience, 
        salary, overview, responsibilities, requirements, benefits
      } = payload.job;

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Jobs");
      const jobId = "JOB-" + (sheet.getLastRow() + 100);
      const postedDate = new Date().toISOString();

      const respString = Array.isArray(responsibilities) ? responsibilities.join("\n") : (responsibilities || "");
      const reqString = Array.isArray(requirements) ? requirements.join("\n") : (requirements || "");
      const benString = Array.isArray(benefits) ? benefits.join("\n") : (benefits || "");

      sheet.appendRow([
        jobId,
        title,
        department || "General",
        location || "Delhi / Hybrid",
        type || "Full-time",
        experience || "Any",
        salary || "Competitive",
        overview || "",
        respString,
        reqString,
        benString,
        "Active",
        postedDate
      ]);

      // 1. Dispatch notification to job poster & admin info@elvohr.com
      sendJobPostedAlert(payload.adminEmail, {
        jobId,
        title,
        department,
        location,
        type,
        salary,
        experience,
        overview
      });

      // 2. Dispatch alert to students/candidates who previously uploaded resumes for similar roles
      sendMatchingJobAlertToCandidates({
        jobId,
        title,
        department,
        location,
        type,
        salary,
        overview
      });

      return createJsonResponse({ 
        success: true, 
        jobId: jobId, 
        message: `Job opening '${title}' (${jobId}) posted successfully! Notifications dispatched to poster, info@elvohr.com, and matching candidates.` 
      });
    }

    // 4. Update Job Status (Admin only)
    if (action === "updateJobStatus") {
      const auth = verifyAdmin(payload.adminEmail, payload.adminPassword, payload.passkey);
      if (!auth.valid) {
        return createJsonResponse({ success: false, error: "Unauthorized: Invalid admin credentials." });
      }

      const { jobId, status } = payload;
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Jobs");
      const rows = sheet.getDataRange().getValues();

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === jobId) {
          sheet.getRange(i + 1, 12).setValue(status); // Column 12 is Status
          return createJsonResponse({ success: true, message: `Job ${jobId} status updated to ${status}` });
        }
      }

      return createJsonResponse({ success: false, error: "Job ID not found" });
    }

    // 5. Update Application Status (Admin only)
    if (action === "updateApplicationStatus") {
      const auth = verifyAdmin(payload.adminEmail, payload.adminPassword, payload.passkey);
      if (!auth.valid) {
        return createJsonResponse({ success: false, error: "Unauthorized: Invalid admin credentials." });
      }

      const { applicationId, status } = payload;
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Applications");
      const rows = sheet.getDataRange().getValues();

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === applicationId) {
          sheet.getRange(i + 1, 14).setValue(status); // Column 14 is Status

          // Dispatch status update email to candidate
          const candName = rows[i][3];
          const candEmail = rows[i][4];
          const candJobTitle = rows[i][2];
          sendApplicationStatusUpdateEmail(candEmail, candName, candJobTitle, applicationId, status);

          return createJsonResponse({ 
            success: true, 
            message: `Application status updated to '${status}'. Status update notification sent to candidate.` 
          });
        }
      }

      return createJsonResponse({ success: false, error: "Application ID not found" });
    }

    // 6. Add New User (to Admins Sheet - Only Admin)
    if (action === "addAdminUser") {
      const auth = verifyAdmin(payload.adminEmail, payload.adminPassword, payload.passkey);
      if (!auth.valid || auth.user.role !== "Admin") {
        return createJsonResponse({ success: false, error: "Unauthorized: Only Admins can add new users." });
      }

      const { newEmail, newPassword, newName, newRole } = payload;
      if (!newEmail || !newPassword) {
        return createJsonResponse({ success: false, error: "Email and password are required." });
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Admins");
      const rows = sheet.getDataRange().getValues();

      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toLowerCase() === String(newEmail).trim().toLowerCase()) {
          return createJsonResponse({ success: false, error: "A user with this email already exists." });
        }
      }

      const assignedRole = (String(newRole).trim().toLowerCase() === "admin") ? "Admin" : "User";

      sheet.appendRow([
        newEmail.trim().toLowerCase(),
        newPassword.trim(),
        newName ? newName.trim() : "Dashboard User",
        assignedRole,
        "Active",
        new Date().toISOString()
      ]);

      return createJsonResponse({ 
        success: true, 
        message: `User '${newEmail}' (${assignedRole}) added successfully to Google Sheets!` 
      });
    }

    // 7. Modify User Password (Only Admin)
    if (action === "updateUserPassword") {
      const auth = verifyAdmin(payload.adminEmail, payload.adminPassword, payload.passkey);
      if (!auth.valid || auth.user.role !== "Admin") {
        return createJsonResponse({ success: false, error: "Unauthorized: Only Admins can modify user passwords." });
      }

      const { targetEmail, newPassword } = payload;
      if (!targetEmail || !newPassword) {
        return createJsonResponse({ success: false, error: "Target email and new password are required." });
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Admins");
      const rows = sheet.getDataRange().getValues();

      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toLowerCase() === String(targetEmail).trim().toLowerCase()) {
          sheet.getRange(i + 1, 2).setValue(String(newPassword).trim()); // Column 2 is Password
          return createJsonResponse({ 
            success: true, 
            message: `Password updated successfully for ${targetEmail}.` 
          });
        }
      }

      return createJsonResponse({ success: false, error: "User account not found." });
    }

    // 8. Delete User (Only Admin)
    if (action === "deleteAdminUser") {
      const auth = verifyAdmin(payload.adminEmail, payload.adminPassword, payload.passkey);
      if (!auth.valid || auth.user.role !== "Admin") {
        return createJsonResponse({ success: false, error: "Unauthorized: Only Admins can delete users." });
      }

      const { targetEmail } = payload;
      if (!targetEmail) {
        return createJsonResponse({ success: false, error: "Target email is required." });
      }

      if (String(targetEmail).trim().toLowerCase() === String(auth.user.email).trim().toLowerCase()) {
        return createJsonResponse({ success: false, error: "You cannot delete your own account while logged in." });
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Admins");
      const rows = sheet.getDataRange().getValues();

      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toLowerCase() === String(targetEmail).trim().toLowerCase()) {
          sheet.deleteRow(i + 1);
          return createJsonResponse({ 
            success: true, 
            message: `User '${targetEmail}' has been permanently deleted from dashboard.` 
          });
        }
      }

      return createJsonResponse({ success: false, error: "User account not found." });
    }

    return createJsonResponse({ success: false, error: "Unknown action requested." });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}
