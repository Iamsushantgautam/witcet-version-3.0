# Witcet Admin Dashboard (MERN Stack)

Premium Admin Dashboard built with React (Vite), Node.js, Express, and MongoDB.

## Features
- **Modern UI**: Glassmorphism design with Lucide icons and Outfit typography.
- **Backend Architecture**: Scalable Node/Express setup with Mongoose models.
- **Real-time Stats**: Responsive dashboard with activity tracking.
- **REST API**: Ready-to-use endpoints for user management.

## Setup Instructions

### 🚀 Quick Start - Run All Projects at Once

To run Backend, Frontend Admin, and Witcet Site simultaneously in one terminal:

```bash
npm run dev
```

This will run all three projects with color-coded output in a single terminal:
- **Backend**: http://localhost:5000 (Cyan)
- **Frontend Admin**: http://localhost:5173 (Magenta)
- **Witcet Site**: http://localhost:5174 (Blue)

**First Time Setup:**
```bash
npm install
```

---

### Manual Setup

#### Backend
1. Navigate to the `backend` folder: `cd backend`
2. Configure your MongoDB Atlas URI in `.env`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

#### Frontend Admin
1. Navigate to the `frontend - admin` folder: `cd "frontend - admin"`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

#### Witcet Site
1. Navigate to the `witcet - site` folder: `cd "witcet - site"`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Tech Stack
- **Frontend**: React, Vite, Lucide React, Axios, React Router.
- **Backend**: Node.js, Express, Mongoose, Dotenv, Cors.
- **Database**: MongoDB Atlas.
