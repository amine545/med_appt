# Submission screenshots (filenames & what to capture)

Your course may require **exact** filenames. Use the list your instructor gave; common ones are below. **You must capture these yourself** from your running app (browser screenshot or Snipping Tool on Windows), then save the files into this **`submission/`** folder (or the path your rubric specifies) and commit them.

## Before you capture

1. **Frontend:** `npm run dev` (Vite).
2. **Backend:** `cd server` → `npm install` once → `npm start` (or `node index.js`).
3. **MongoDB:** running and matching `server/db.js` (or Atlas URI if you changed it).
4. **Sign in:** open `/login`, log in with a real user so the navbar shows **Welcome, …** and API calls succeed.

---

## Patient report PDF (`public/patient_report.pdf`)

- The repo includes a **sample** `patient_report.pdf` (generated via `npm run gen:report-pdf` using `pdf-lib`).
- For the course: design in **Figma**, export to PDF, replace `public/patient_report.pdf` with your file **using the same filename** so **View Report** / **Download Report** on **`/reports`** keep working.

---

## Suggested captures (adjust names to match your rubric)

### 1. `integration.png` — “integration”

**Goal:** Show the app talking to **external / backend** behavior (doctors API, booking, or notifications).

**Example flow:**

1. Open **`/booking-consultation`** (or **`/instant-consultation`**).
2. Pick a speciality so **doctor cards** load from the API.
3. Optionally book an appointment so a **toast notification** appears.
4. Capture the **browser window** including the **URL bar** and the visible UI (and DevTools **Network** tab showing a successful `fetch` if your rubric asks for it).

Save as: **`integration.png`**

---

### 2. `profileform.png` — profile form (read-only or edit)

**Goal:** Show **ProfileForm** (welcome + email + phone, or edit fields).

1. While logged in, open **`/profile`**.
2. Capture the **“Your profile”** area and the form (read-only or **Edit** mode with Name / Phone / Email).

**Element id for framing:** `#profile-form-root` on the profile form container.

Save as: **`profileform.png`**

---

### 3. `profilecard.png` — profile dropdown / profile card

Pick **one** of these if only one file is required; if both are required, use two filenames per instructor.

**Option A — Navbar dropdown (sample rubric)**

1. Click **Welcome, … ▾** so the menu shows **Your Profile**.
2. Capture **Welcome**, the **dropdown** (“Your Profile”), and **Logout**.

**Option B — Reports page + DB-backed card**

1. Open **`/reports`**.
2. Capture the **heading text**, the **Account summary** section, and the **ProfileCard** showing name / email / phone loaded from the API.

**Markers:** `data-screenshot="profilecard-dropdown"` on the dropdown; `#reports-profile-card-root` wraps the card on Reports.

Save as: **`profilecard.png`**

---

## Checklist

- [ ] Filenames match the rubric **exactly** (case-sensitive).
- [ ] PNGs are readable (not tiny thumbnails unless asked).
- [ ] `git add submission/*.png` (or your folder) and commit before submitting.

If your course lists different names (e.g. only `profileform.png`), follow the official list and ignore extras here.

---

## Manual testing checklist (profile, reports, edge cases)

### 1. ProfileForm + ProfileCard

1. Log in → **`/profile`** — confirm **Welcome / Email / Phone** match the API.
2. Click **Edit**, change **name** (≥ 4 chars) and **phone** (≥ 10 digits), **Save** — success alert, redirect home; open **`/reports`** and confirm **Account summary** / **ProfileCard** shows the new values (or refresh **`/profile`**).
3. **Validation:** **Edit** → clear name or use short name / short phone → **Save** — browser HTML5 hints and/or server alert should block bad data.

### 2. ReportsLayout (view + download)

1. Open **`/reports`** — table shows sample doctors.
2. **View Report** — each link should open **`patient_report.pdf`** in a **new tab** (`target="_blank"`).
3. **Download Report** — should download/save **`patient_report.pdf`** (same-origin `public/` file; behavior can vary slightly by browser).

### 3. Edge cases

1. **No reports:** render with `rows={[]}` (or temporarily pass from parent) — you should see **“No reports are available yet…”** and **no** empty table body.
2. **Profile errors:** stop the API or clear **`auth-token`** / **`email`** — **`/profile`** should show the error panel and **Go to login**, or redirect to **`/login`**.

Automated checks for reports links and empty state: **`npm run test`** (`ReportsLayout.test.jsx`).

