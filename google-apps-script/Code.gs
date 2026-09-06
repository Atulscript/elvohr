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

  return { jobsSheet, appsSheet, adminsSheet };
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

      return createJsonResponse({ 
        success: true, 
        applicationId: applicationId,
        resumeDriveUrl: resumeDriveUrl,
        message: "Application submitted successfully to ELVO HR team!" 
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

      return createJsonResponse({ 
        success: true, 
        jobId: jobId, 
        message: `Job opening '${title}' (${jobId}) posted successfully to Google Sheets!` 
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
          return createJsonResponse({ success: true, message: `Application status updated to ${status}` });
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
