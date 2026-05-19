# Medical Appointment Booking

A front-end web application for **StayHealthy Inc.** that connects patients in remote and underserved areas with doctors and specialists for online consultations, appointment booking, reviews, and profile management.

## Project Overview

StayHealthy Inc. is a non-profit organization committed to improving access to healthcare in regions with limited medical infrastructure. As part of its *Go Digital* initiative, this website allows patients to:

- Search for doctors and view ratings
- Book, modify, or cancel medical appointments
- Receive instant consultations
- Submit reviews and feedback for past consultations
- Manage their personal and medical profile

## Tech Stack

- **Design:** Figma (UI/UX mockups)
- **Front-End:** HTML5, CSS3, React.js (JSX)
- **Routing:** React Router
- **State:** React Hooks
- **Build Tool:** Create React App
- **Version Control:** Git & GitHub
- **Deployment:** GitHub Pages / Netlify / Vercel

## Features (Phase 1)

1. Medical appointments online
2. Doctor listing with search
3. Consultation feedback (reviews)
4. Profile management
5. Responsive navigation

## Project Structure

```
grihf-frontend_capstone_starter_code/
├── public/
│   └── index.html
├── src/
│   ├── Components/
│   │   ├── Navbar/
│   │   ├── Sign_Up/
│   │   ├── Login/
│   │   ├── FindDoctorSearch/
│   │   ├── DoctorCard/
│   │   ├── AppointmentForm/
│   │   ├── AppointmentFormIC/
│   │   ├── GiveReviews/
│   │   ├── Notification/
│   │   └── ProfileCard/
│   ├── App.jsx
│   └── index.js
├── screenshots/
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/grihf-frontend_capstone_starter_code.git
   cd grihf-frontend_capstone_starter_code
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`.

4. Create a production build:
   ```bash
   npm run build
   ```

## Submission screenshots

See **[submission/README.md](submission/README.md)** for required PNG filenames (`integration.png`, `profileform.png`, `profilecard.png`, etc.), what each should show, and how to capture them from your running app.

## Available Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm start`     | Runs the app in development mode |
| `npm test`      | Launches the test runner         |
| `npm run build` | Builds the app for production    |
| `npm run eject` | Ejects the CRA configuration     |

## Deployment

The application is deployed and accessible at: `<deployment-url>`

## Author

Front-End Developer — StayHealthy Inc. Capstone Project

## License

This project is part of the IBM Front-End Developer Capstone and is for educational purposes.