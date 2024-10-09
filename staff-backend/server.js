const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow Cross-Origin requests from your frontend
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sp_db' // Make sure this matches your actual database name
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// API route to fetch staff members
app.get('/api/staff-members', (req, res) => {
    const sql = 'SELECT name FROM staff_members';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
