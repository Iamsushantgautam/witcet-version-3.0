# Witcet 3.0

[![Live Demo](https://img.shields.io/badge/Live%20Demo-www.witcet.online-blue)](https://www.witcet.online)

Witcet is a comprehensive educational platform designed to help students excel in their academic journey. It provides access to study materials, previous year question papers (PYQs), quantum notes, and important updates for engineering students, particularly those pursuing B.Tech at AKTU (Dr. A.P.J. Abdul Kalam Technical University).

## 🌟 Features

- **Study Materials**: Access to detailed notes for various engineering subjects
- **Previous Year Questions (PYQs)**: Collection of past examination papers
- **Quantum Notes**: Concise and focused study materials
- **Latest Updates**: Stay informed with announcements and important notifications
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Latest information and announcements

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing
- **express-session** - Session management
- **connect-mongo** - MongoDB session store

### Frontend
- **EJS** - Templating engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Vanilla JavaScript** - Client-side interactions

### Development Tools
- **Nodemon** - Development server
- **Dotenv** - Environment variables

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Iamsushantgautam/witcet-version-3.0.git
   cd witcet-version-3.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   PORT=3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
witcet-3.0/
├── backend/
│   ├── server.js          # Main server file
│   ├── models/            # Database models
│   │   ├── Note.js
│   │   ├── DetailedNote.js
│   │   └── Update.js
│   └── routes/            # API routes
│       ├── index.js
│       └── notesList.js
├── frontend/
│   ├── public/
│   │   ├── css/           # Stylesheets
│   │   ├── images/        # Static images
│   │   └── js/            # Client-side scripts
│   └── views/             # EJS templates
│       ├── partials/      # Reusable components
│       └── *.ejs         # Page templates
├── package.json
├── .env                   # Environment variables
└── README.md
```

## 🎯 Usage

### For Students
1. Visit the website at [www.witcet.online](https://www.witcet.online)
2. Browse through different sections:
   - **Notes**: Access subject-wise study materials
   - **PYQs**: Download previous year question papers
   - **Quantums**: Get concise revision notes
   - **Updates**: Stay updated with latest announcements

### For Developers
- The application uses EJS templating for server-side rendering
- MongoDB stores all the educational content and user data
- Bootstrap ensures responsive design across devices
- Session-based authentication for secure access

## 🌐 Live Deployment

The application is live and accessible at:
**https://www.witcet.online**

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website**: [www.witcet.online](https://www.witcet.online)
- **GitHub**: [Iamsushantgautam](https://github.com/Iamsushantgautam)

## 🙏 Acknowledgments

- Thanks to all contributors and the open-source community
- Special thanks to students and educators using Witcet
- Built with ❤️ for the engineering community

---

**Made with ❤️ by the Witcet Team**
