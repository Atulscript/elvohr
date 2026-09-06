# Google Workspace Backend Setup Guide (ELVO HR)

This project uses **Google Sheets** as a database and **Google Drive** for candidate resume file storage via a **Google Apps Script** serverless API.

---

### Step 1: Create Your Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser while logged into your Google Workspace account.
2. Name the spreadsheet: `ELVO HR Portal Database`.

---

### Step 2: Open Google Apps Script & Paste Code
1. In the Google Sheets menu, click: **Extensions** > **Apps Script**.
2. Delete any template code inside `Code.gs`.
3. Open [`google-apps-script/Code.gs`](./Code.gs) from this project, copy all the code, and paste it into the editor.
4. Click the **Save** floppy-disk icon.

---

### Step 3: Deploy as Web App
1. At the top right of the Apps Script page, click **Deploy** > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and pick **Web app**.
3. Fill in:
   - **Description**: `ELVO HR Portal Backend API`
   - **Execute as**: `Me (your-email@yourworkspace.com)`
   - **Who has access**: `Anyone` *(Enables applicants to submit resumes and admins to log in)*
4. Click **Deploy**.
5. Click **Authorize access**, select your Google account, and grant the permissions (Google Sheets and Google Drive).
6. Copy the generated **Web App URL** (looks like: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Step 4: Link Web App URL in Admin Portal
1. Navigate to `/portal-admin` on your website.
2. Log in with your admin credentials:
   - **Email**: `admin@elvohr.com`
   - **Password**: `admin123`
   *(or use fallback master passkey `elvo2026`)*
3. Go to the **Google Workspace Settings** tab, paste your Web App URL, and click **Save & Verify Connection**!

---

### What Gets Created Automatically in Google Sheets:
1. **`Jobs` Tab**: Stores all job listings, requirements, perks, and status (Active/Closed).
2. **`Applications` Tab**: Stores student applications, details, and direct links to their resumes in Google Drive.
3. **`Admins` Tab**: Stores admin users with **Email**, **Password**, **Name**, and **Role** for multi-user portal access.
4. **`ELVO_HR_Resumes` Folder in Google Drive**: Holds all uploaded student resumes with public view access for HR.
