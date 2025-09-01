require('dotenv').config();
const express = require('express');
const cors = a = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const db = require('./database.js');

const app = express();

// This is the CORRECT code
const corsOptions = {
    // Add your local development origin and your future deployed origin
    origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Middleware for JWT Verification ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

// --- API Endpoints ---

// 1. Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role });
        });
    });
});

// 2. Upload Endpoint (Technician only)
app.post('/api/upload', authenticateToken, upload.single('scanImage'), (req, res) => {
    if (req.user.role !== 'Technician') {
        return res.status(403).json({ error: "Access denied. Only Technicians can upload." });
    }

    const { patientName, patientId, scanType, region } = req.body;
    
    // Upload image to Cloudinary from buffer
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Image upload failed', details: error });
        }

        const imageUrl = result.secure_url;
        const uploadDate = new Date().toISOString();
        
        const sql = `INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, uploadDate) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [patientName, patientId, scanType, region, imageUrl, uploadDate];

        db.run(sql, params, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Scan uploaded successfully", id: this.lastID });
        });

    }).end(req.file.buffer);
});


// 3. Get Scans Endpoint (Dentist only)
app.get('/api/scans', authenticateToken, (req, res) => {
    if (req.user.role !== 'Dentist') {
        return res.status(403).json({ error: "Access denied. Only Dentists can view scans." });
    }

    const sql = "SELECT * FROM scans ORDER BY uploadDate DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ scans: rows });
    });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});