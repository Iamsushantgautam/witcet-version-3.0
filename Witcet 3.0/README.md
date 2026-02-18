# 🎓 Witcet 3.0 - Educational Learning Platform

![Witcet Banner](https://via.placeholder.com/1200x300/0D6EFD/ffffff?text=Witcet+3.0+-+AKTU+Learning+Platform)

**Witcet** is a comprehensive online educational platform designed to help students excel in their AKTU (Dr. A.P.J. Abdul Kalam Technical University) examinations. The platform provides free access to notes, quantum series, previous year question papers, and regular updates to support students throughout their academic journey.

[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://witcet.vercel.app)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by Vite](https://img.shields.io/badge/Powered%20by-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Endpoints](#-api-endpoints)
- [PWA Features](#-pwa-features)
- [Components Overview](#-components-overview)
- [Styling](#-styling)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 🎯 Core Features
- **📚 AKTU Notes Library**: Comprehensive collection of subject-wise notes for all years (1st to 4th year)
- **📖 Quantum Series**: Quick revision material and important questions
- **📝 Previous Year Questions (PYQs)**: Last 5 years of AKTU question papers
- **🔍 Advanced Search**: Unified search across Notes, Quantums, and PYQs by title, tag, or code
- **📢 Updates & Announcements**: Real-time university updates and exam-related information
- **📱 Progressive Web App (PWA)**: Install and use offline like a native app
- **🎨 Modern UI/UX**: Clean, responsive design with smooth animations
- **🌐 Telegram Integration**: Direct link to community channel for discussions

### 🚀 Advanced Features
- **Skeleton Loading**: Enhanced user experience with content placeholders
- **3D Interactive Hero**: Parallax animation with mouse-tracking effect
- **Category Filtering**: Filter content by academic year and subject tags
- **Lazy Loading**: Optimized image loading for better performance
- **Mobile Responsive**: Fully optimized for all device sizes
- **Dark/Light Themed**: Professional color schemes with glassmorphism effects
- **SEO Optimized**: Meta tags and semantic HTML for better search visibility

---

## 🛠️ Tech Stack

### Frontend
- **React 18+**: Modern React with hooks and latest features
- **React Router v6**: Client-side routing and navigation
- **React Bootstrap**: Pre-built responsive components
- **Vite**: Lightning-fast build tool and dev server
- **Axios**: Promise-based HTTP client for API calls

### PWA & Build Tools
- **vite-plugin-pwa**: Service Worker and Web App Manifest generation
- **Workbox**: Advanced service worker strategies and caching

### Styling
- **CSS3**: Custom styles with modern features
- **Bootstrap 5**: Grid system and utilities
- **Font Awesome 6**: Icon library
- **Google Fonts**: Custom typography (Outfit font family)

### Backend Integration
- **RESTful API**: Node.js/Express backend (hosted on Render)
- **Cloudinary**: Image hosting and optimization
- **MongoDB**: Database for content management

---

## 📁 Project Structure

```
Witcet 3.0/
├── public/
│   ├── images/               # Static images (logos, favicon, placeholders)
│   ├── manifest.json         # PWA manifest
│   └── robots.txt            # SEO robots configuration
│
├── src/
│   ├── components/           # React components
│   │   ├── About.jsx         # About page
│   │   ├── AllNotes.jsx      # Notes listing with filters
│   │   ├── Contact.jsx       # Contact form
│   │   ├── Feedback.jsx      # Feedback form
│   │   ├── Filter.jsx        # Content filter component
│   │   ├── Footer.jsx        # Footer with links and install button
│   │   ├── Help.jsx          # FAQ and help section
│   │   ├── Hero.jsx          # Landing hero section with 3D animation
│   │   ├── InstallButton.jsx # PWA install prompt
│   │   ├── Navbar.jsx        # Navigation with search
│   │   ├── NoteDetails.jsx   # Individual note view
│   │   ├── NotesList.jsx     # Latest notes preview
│   │   ├── Policy.jsx        # Privacy policy
│   │   ├── Pyqs.jsx          # Previous year questions
│   │   ├── Quantums.jsx      # Quantum series
│   │   ├── Search.jsx        # Unified search results
│   │   ├── Skeleton.jsx      # Loading skeletons
│   │   └── Updates.jsx       # University updates
│   │
│   ├── styles/               # CSS stylesheets
│   │   ├── index.css         # Global styles and variables
│   │   ├── App.css           # App-specific styles
│   │   ├── AllNotes.css      # Notes page styles
│   │   ├── Contact.css       # Contact form styles
│   │   ├── Feedback.css      # Feedback form styles
│   │   ├── Help.css          # Help page styles
│   │   ├── Policy.css        # Policy page styles
│   │   ├── Quantums.css      # Quantums page styles
│   │   └── Updates.css       # Updates page styles
│   │
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # React entry point
│   └── vite-env.d.ts         # Vite environment types
│
├── index.html                # HTML template with splash screen
├── vite.config.js            # Vite configuration with PWA
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (not in repo)
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamsushantgautam/witcet-3.0.git
   cd witcet-3.0/Witcet\ 3.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Backend URL
VITE_API_URL=your_backend_api_url
```

> **Note**: Contact the project administrator for the required API credentials.

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 🌐 Backend API

The application connects to a REST API backend built with:
- **Node.js** & **Express.js**
- **MongoDB** for data storage
- **Cloudinary** for image hosting

### Data Structure
The backend manages content for:
- Notes (subject-wise study material)
- Quantums (quick revision guides)
- PYQs (previous year question papers)
- Updates (university announcements)

### API Integration
All API requests are made using **Axios** with centralized error handling and loading states.

---

## 📱 PWA Features

### Service Worker
- **Offline Support**: Core pages cached for offline access
- **Background Sync**: Queue failed requests for retry
- **Push Notifications**: (Optional) Firebase Cloud Messaging integration

### Installation
Users can install Witcet as a native app on:
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Android devices
- ✅ iOS devices (Safari)

### Manifest Configuration
```json
{
  "name": "Witcet - Learning Platform",
  "short_name": "Witcet",
  "description": "Your gateway to AKTU exam success",
  "theme_color": "#0D6EFD",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "scope": "/"
}
```

---

## 🧩 Components Overview

### Page Components

| Component | Route | Description |
|-----------|-------|-------------|
| `Hero.jsx` | `/` | Landing section with 3D animated image |
| `AllNotes.jsx` | `/notes` | Full notes library with filters |
| `NoteDetails.jsx` | `/notes/:code` | Individual note download page |
| `Quantums.jsx` | `/quantums` | Quantum series listing |
| `Pyqs.jsx` | `/pyqs` | Previous year questions |
| `Search.jsx` | `/search?q=` | Unified search results |
| `Updates.jsx` | `/updates` | University announcements |
| `Contact.jsx` | `/contact` | Contact form |
| `Feedback.jsx` | `/feedback` | Feedback submission |
| `Help.jsx` | `/help` | FAQ section |
| `About.jsx` | `/about` | About Witcet |
| `Policy.jsx` | `/policy` | Privacy policy |

### Reusable Components

- **`Navbar.jsx`**: Responsive navigation with search
- **`Footer.jsx`**: Links, social media, PWA install button
- **`Skeleton.jsx`**: Loading placeholders (`SkeletonCard`, `SkeletonGrid`)
- **`InstallButton.jsx`**: PWA installation prompt
- **`Filter.jsx`**: Year/category filter

---

## 🎨 Styling

### CSS Architecture

- **Global Styles** (`index.css`): CSS variables, resets, animations
- **Component Styles**: Modular CSS files alongside components
- **Utility Classes**: Bootstrap utilities for rapid development

### Color Palette

```css
--bg-dark: #0a0e27;
--text-primary: #e2e8f0;
--text-secondary: #94a3b8;
--primary: #0D6EFD;
--success: #10b981;
--danger: #ef4444;
--glass-bg: rgba(255, 255, 255, 0.05);
```

### Animations

- **Fade-in**: Content entrance animation
- **Pulse**: Loading animation
- **3D Tilt**: Mouse-tracking parallax effect
- **Skeleton**: Shimmer loading effect

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Follow existing code conventions
- Use meaningful component and variable names
- Add comments for complex logic
- Test responsive layouts on multiple devices

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **AKTU Students**: For feedback and feature suggestions
- **Open Source Community**: For amazing tools and libraries
- **Contributors**: Everyone who has helped improve Witcet

---

## 📊 Project Info

- **Version**: 3.0
- **License**: MIT
- **Status**: Active Development

---

<div align="center">
  <p>Made with ❤️ for AKTU Students</p>
  <p>Star ⭐ this repo if you find it helpful!</p>
</div>
