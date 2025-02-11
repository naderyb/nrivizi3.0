require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const { Client } = require('pg');
const bcrypt = require('bcrypt'); // For future secure password handling

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection configuration using the DATABASE_URL environment variable
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:nader%402000@localhost:5432/nexus'
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL: ' + err.stack);
    return;
  }
  console.log('Connected to PostgreSQL');
});

// Route to process the submission form
app.post('/process-form', (req, res) => {
  const { nomPrenom, email, formation, motivation } = req.body;
  if (!nomPrenom || !email || !formation || !motivation) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }
  // PostgreSQL uses $1, $2, ... as parameter placeholders
  const query = 'INSERT INTO submission (nomPrenom, email, formation, motivation) VALUES ($1, $2, $3, $4)';
  client.query(query, [nomPrenom, email, formation, motivation], (error, result) => {
    if (error) {
      console.error('Error inserting data: ', error);
      return res.status(500).json({ message: "Erreur lors de l'enregistrement." });
    }
    res.json({ message: 'Inscription Réussie !' });
  });
});

// Route to retrieve all submissions
app.get('/submissions', (req, res) => {
  const query = 'SELECT * FROM submission';
  client.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching data: ', error);
      return res.status(500).json({ message: 'Error fetching data.' });
    }
    // PostgreSQL returns rows in result.rows
    res.json(result.rows);
  });
});

// Route for admin login
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
  }
  const query = 'SELECT * FROM admins WHERE username = $1';
  client.query(query, [username], (error, result) => {
    if (error) {
      console.error('Erreur lors de la connexion: ', error);
      return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }
    const admin = result.rows[0];
    // For now, compare plain-text passwords (in production, use bcrypt for secure comparison)
    if (password !== admin.password) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }
    // Determine full name and role based on username
    let fullName, role;
    if (username === 'yb_nader') {
      fullName = 'Youb Mahmoud Nader';
      role = 'Président';
    } else if (username === 'tb_seif') {
      fullName = 'Tabbi Mohamed Kamel Seif Eddine';
      role = 'Vice-Président';
    } else if (username === 'bt_selena') {
      fullName = 'Boutaoui Selena';
      role = 'Secrétaire Général';
    } else if (username === 'bd_hadil') {
      fullName = 'Bedoud Hadil';
      role = 'Organisatrice';
    } else {
      fullName = username;
      role = '';
    }
    return res.status(200).json({
      success: true,
      admin: {
        username,
        fullName,
        role
      }
    });
  });
});

// Endpoint to validate a submission (soft update)
app.put('/submission/validate/:id', (req, res) => {
  const submissionId = req.params.id;
  const { adminUsername } = req.body;
  if (!adminUsername) {
    return res.status(400).json({ message: 'Admin username is required.' });
  }
  const query = 'UPDATE submission SET validated = true, validated_by = $1 WHERE id = $2';
  client.query(query, [adminUsername, submissionId], (error, result) => {
    if (error) {
      console.error('Error validating submission: ', error);
      return res.status(500).json({ message: 'Error validating submission.' });
    }
    res.json({ message: 'Subscription validated.', submissionId });
  });
});

// Endpoint to delete (hard delete) a submission
app.delete('/submission/:id', (req, res) => {
  const submissionId = req.params.id;
  const { adminUsername } = req.body;
  if (!adminUsername) {
    return res.status(400).json({ message: 'Admin username is required.' });
  }
  const query = 'DELETE FROM submission WHERE id = $1';
  client.query(query, [submissionId], (error, result) => {
    if (error) {
      console.error('Error deleting submission: ', error);
      return res.status(500).json({ message: 'Error deleting submission.' });
    }
    res.json({ message: 'Subscription deleted.', submissionId });
  });
});

// Serve static files from the "public" folder
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
