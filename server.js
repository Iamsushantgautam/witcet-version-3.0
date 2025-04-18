const express = require("express");
const path = require("path");
require('dotenv').config();

const apiKey = process.env.WEB3FORM_API_KEY;

// Now you can use apiKey in your API requests to Web3Form


const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/notes", (req, res) => res.render("notes"));
app.get('/notes/:subject', (req, res) => {
    const subject = req.params.subject;
    res.render(`notes/${subject}`);
});
app.get("/courses", (req, res) => res.render("courses"));
app.get("/programming", (req, res) => res.render("programming"));
app.get("/quantums", (req, res) => res.render("quantums"));
app.get("/about", (req, res) => res.render("about"));
app.get("/feedback", (req, res) => res.render("feedback"));
app.get("/policy", (req, res) => res.render("policy"));
app.get("/contact", (req, res) => res.render("contact"));



// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
