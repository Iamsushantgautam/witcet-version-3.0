# 🎓 Witcet - Educational Learning Platform

A comprehensive full-stack educational platform built with the MERN stack, designed to provide free access to study materials, notes, quantum series, and previous year question papers for university students.

---

## 📦 Project Structure

This repository contains three main components:

```
witcet 3.0/
├── backend/              # Node.js + Express API server
├── Admin-Dashboard/      # React admin panel for content management
└── Witcet 3.0/          # Main student-facing website (PWA)
```

### 🔹 Backend
REST API server handling all data operations, file uploads, and database management.
- **Tech**: Node.js, Express, MongoDB, Cloudinary
- **Port**: 5000

### 🔹 Admin Dashboard
Content management interface for administrators to manage notes, quantums, PYQs, and updates.
- **Tech**: React + Vite
- **Port**: 5173

### 🔹 Witcet 3.0 (Main Website)
Student-facing Progressive Web App with modern UI and offline capabilities.
- **Tech**: React + Vite, React Bootstrap, PWA
- **Port**: 5174

---

## 🚀 Quick Start

### Run All Projects Simultaneously

From the root directory, run all three components in one command:

```bash
npm run dev
```

This starts:
- **Backend** → http://localhost:5000 (Cyan)
- **Admin Dashboard** → http://localhost:5173 (Magenta)
- **Witcet Site** → http://localhost:5174 (Blue)

### First Time Setup

Before running, install all dependencies:

```bash
npm install
```

This will install dependencies for all three projects.

---

## 🛠️ Manual Setup (Individual Components)

### Backend Server

```bash
cd backend
npm install
npm run dev
```

**Configuration**: Create `.env` file with MongoDB URI and Cloudinary credentials.

### Admin Dashboard

```bash
cd Admin-Dashboard
npm install
npm run dev
```

### Main Website

```bash
cd "Witcet 3.0"
npm install
npm run dev
```

**Configuration**: Create `.env` file with `VITE_API_URL` pointing to your backend.

---

## ✨ Key Features

- 📚 **Notes Library**: Categorized study materials for all subjects
- 📖 **Quantum Series**: Quick revision guides
- 📝 **Previous Year Questions**: 5+ years of question papers
- 🔍 **Advanced Search**: Search across all content types
- 📢 **Updates & Announcements**: Real-time university notifications
- 📱 **Progressive Web App**: Install and use offline
- 🎨 **Modern UI**: Responsive design with smooth animations
- 🔐 **Admin Panel**: Easy content management

---

## 🧰 Tech Stack

| Component | Technologies |
|-----------|-------------|
| **Frontend** | React 18, Vite, React Router, React Bootstrap |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Cloud** | Cloudinary (Image Hosting) |
| **PWA** | Workbox, Service Workers |
| **Styling** | CSS3, Bootstrap 5, Font Awesome |

---

## 📋 Available Scripts

From the root directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Run all projects concurrently |
| `npm install` | Install dependencies for all projects |

Individual project scripts are available in their respective `package.json` files.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📚 Documentation

For detailed documentation on each component:
- **Main Website**: See `Witcet 3.0/README.md`
- **Admin Dashboard**: See `Admin-Dashboard/README.md`
- **Backend API**: See `backend/README.md`

---

<div align="center">
  <p>Made with ❤️ for Students</p>
  <p><strong>Version 3.0</strong> | Active Development</p>
</div>
