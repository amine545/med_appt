# Submission screenshots (filenames & what to capture)

Your course may require **exact** filenames. Use the list your instructor gave; common ones are below. **You must capture these yourself** from your running app (browser screenshot or Snipping Tool on Windows), then save the files into this **`submission/`** folder (or the path your rubric specifies) and commit them.

## Before you capture

1. **Frontend:** `npm run dev` (Vite).
2. **Backend:** `cd server` → `npm install` once → `npm start` (or `node index.js`).
3. **MongoDB:** running and matching `server/db.js` (or Atlas URI if you changed it).
4. **Sign in:** open `/login`, log in with a real user so the navbar shows **Welcome, …** and API calls succeed.

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
