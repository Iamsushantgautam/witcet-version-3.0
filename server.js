const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();

// === MongoDB Atlas Connection ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// === App Settings ===
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));



// === Routes ===

// Home route
app.get("/", (req, res) => {
  const data = loadCourseData();
  const courseArray = Object.values(data.courses);
  const filteredCourses = courseArray.filter(course => course.pageLink && course.pageLink.trim() !== "");
  res.render("home", { courses: filteredCourses });
});

// Notes route (all notes)
app.get("/notes", async (req, res) => {
  try {
      const notesWithpp = await Note.find({ notesPagePath: { $exists: true, $ne: "" } });
      res.render("notes", { notes: notesWithpp });
  } catch (err) {
      console.error("Error loading notes:", err);
      res.status(500).send("Error loading  notes.");
  }
});

// Notes by subject folder (3rd & 2nd CSE)
app.get('/notes/3rd_cse/:subject', (req, res) => {
  const subject = req.params.subject;
  res.render(`notes/3rd_cse/${subject}`);
});

app.get('/notes/2nd_cse/:subject', (req, res) => {
  const subject = req.params.subject;
  res.render(`notes/2nd_cse/${subject}`);
});

// Quantums route
app.get("/quantums", async (req, res) => {
  try {
      const notesWithPyq = await Note.find({ quantumLink: { $exists: true, $ne: "" } });
      res.render("quantums", { notes: notesWithPyq });
  } catch (err) {
      console.error("Error loading quantums:", err);
      res.status(500).send("Error loading quantums.");
  }
});

const Note = require('./models/Note'); // Make sure path is correct

app.get("/pyqs", async (req, res) => {
    try {
        const notesWithPyq = await Note.find({  pyqLink: { $exists: true, $ne: "" } });
        res.render("pyqs", { notes: notesWithPyq });
    } catch (err) {
        console.error("Error loading PYQ notes:", err);
        res.status(500).send("Error loading PYQ notes.");
    }
});

// Dashboard route

app.get("/dashboard", async (req, res) => {
  try {
    const notes = await Note.find();
    res.render("dashboard", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Server Error");
  }
}
);


// Static Pages
app.get("/courses", (req, res) => res.render("courses"));
app.get("/programming", (req, res) => res.render("programming"));
app.get("/about", (req, res) => res.render("about"));
app.get("/feedback", (req, res) => res.render("feedback"));
app.get("/policy", (req, res) => res.render("policy"));
app.get("/contact", (req, res) => res.render("contact"));

// === Start Server ===
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
