const express = require("express");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const app = express();
const apiKey = process.env.WEB3FORM_API_KEY;

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Load course data function
function loadCourseData() {
    const filePath = path.join(__dirname, "data", "courseLibrary.json");
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Route: Home page (pass course data for somenotes section)
app.get("/", (req, res) => {
    const data = loadCourseData();
    const courseArray = Object.values(data.courses); 
    const filteredCourses = courseArray.filter(course => course.pageLink && course.pageLink.trim() !== "");// Convert object to array
    res.render("home", { courses: filteredCourses });
});

// Route: Full course details
app.get("/notes", (req, res) => {
    const data = loadCourseData();
    const courseArray = Object.values(data.courses);
    const filteredCourses = courseArray.filter(course => course.pageLink && course.pageLink.trim() !== "");
    res.render("notes", { courses: filteredCourses });
});

// Route: Notes by subject folder (e.g., /notes/DS)
app.get('/notes/:subject', (req, res) => {
    const subject = req.params.subject;
    res.render(`notes/${subject}`);
});

// Route: Only course name and pageLink (quantums)
app.get("/quantums", (req, res) => {
    const data = loadCourseData();
    const courseArray = Object.values(data.courses);
    res.render("quantums", { courses: courseArray });
});

// Other static pages
app.get("/courses", (req, res) => res.render("courses"));
app.get("/programming", (req, res) => res.render("programming"));
app.get("/about", (req, res) => res.render("about"));
app.get("/feedback", (req, res) => res.render("feedback"));
app.get("/policy", (req, res) => res.render("policy"));
app.get("/contact", (req, res) => res.render("contact"));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
