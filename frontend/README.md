# OralVis Healthcare - Full-Stack Application

This project is a full-stack web application for a fictional healthcare provider, "OralVis Healthcare." It includes role-based access for Technicians (to upload dental scans) and Dentists (to view scans and download reports).

## Technology Stack

-   **Frontend:** React (with Vite), React Router, Axios, jsPDF
-   **Backend:** Node.js, Express.js
-   **Database:** SQLite
-   **Image Storage:** Cloudinary
-   **Authentication:** JWT (JSON Web Tokens)

---

## Screenshots

### Login Page


### Technician Upload Dashboard


### Dentist Scan Viewer


---

## Live Demo

-   **Hosted Application Link:** [Your Vercel/Netlify Frontend Link]

---

## Local Setup Instructions

### Prerequisites

-   Node.js (v16 or higher)
-   NPM or Yarn
-   A free Cloudinary account

### 1. Clone the Repository

```bash
git clone [your-github-repo-link]
cd OralVis-Healthcare
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create a .env file and add your credentials
# See .env.example for required variables
cp .env.example .env

# Start the backend server
npm start
```
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# The .env file should be pre-configured for local development
# VITE_API_BASE_URL=http://localhost:5000

# Start the frontend development server
npm run dev
```
The frontend will be accessible at `http://localhost:5173`.

---

## Default Login Credentials

-   **Technician**
    -   **Email:** `technician@oralvis.com`
    -   **Password:** `password123`

-   **Dentist**
    -   **Email:** `dentist@oralvis.com`
    -   **Password:** `password123`







<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->
