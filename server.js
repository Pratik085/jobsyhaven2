const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'], // Updated to match both possible frontend ports
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
const cvsDir = path.join(uploadsDir, 'cvs');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(cvsDir)) {
  fs.mkdirSync(cvsDir);
}

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Connecting to MongoDB...'))
  .then(() => console.log(' Connected to MongoDB successfully!'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Jobsy Haven API',
    database: mongoose.connection.db?.databaseName || 'Not connected',
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
}); 