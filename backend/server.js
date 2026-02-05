const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

const auth = require('./middleware/auth');

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/users', auth, require('./routes/userRoutes.js'));
app.use('/api/notes', require('./routes/noteRoutes.js'));
app.use('/api/detailed-notes', require('./routes/detailedNoteRoutes.js'));
app.use('/api/updates', require('./routes/updateRoutes.js'));
app.use('/api/stats', auth, require('./routes/statsRoutes.js'));
app.use('/api/upload', auth, require('./routes/uploadRoutes.js'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected to Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Witcet Admin API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
