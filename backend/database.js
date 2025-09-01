const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Connect to a database file
const db = new sqlite3.Database('./oralvis.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the oralvis SQLite database.');
});

// Create tables if they don't exist
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Technician', 'Dentist'))
    )`, (err) => {
        if (err) {
            console.error("Error creating users table:", err.message);
        }
    });

    // Scans table
    db.run(`CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT NOT NULL,
        patientId TEXT NOT NULL,
        scanType TEXT NOT NULL,
        region TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        uploadDate TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error("Error creating scans table:", err.message);
        }
    });

    // Insert default users if they don't exist
    const insertUser = (email, password, role) => {
        const sql = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return console.error(err.message);
            }
            db.run(sql, [email, hash, role], function(err) {
                if (err && err.message.includes('UNIQUE constraint failed')) {
                   // console.log(`User ${email} already exists.`);
                } else if (err) {
                    return console.error(err.message);
                }
            });
        });
    };
    
    // Default credentials
    insertUser('technician@oralvis.com', 'password123', 'Technician');
    insertUser('dentist@oralvis.com', 'password123', 'Dentist');
});

module.exports = db;