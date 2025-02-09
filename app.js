const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Pour une future implémentation du hachage des mots de passe

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser les données JSON et URL-encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la connexion MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'naderyb',
  password: 'nader@2000',
  database: 'nexusclub_form_submission'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Route pour traiter le formulaire d'inscription
app.post('/process-form', (req, res) => {
  const { nomPrenom, email, formation, motivation } = req.body;
  if (!nomPrenom || !email || !formation || !motivation) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }
  const query = 'INSERT INTO submission (nomPrenom, email, formation, motivation) VALUES (?, ?, ?, ?)';
  connection.execute(query, [nomPrenom, email, formation, motivation], (error, results) => {
    if (error) {
      console.error('Error inserting data: ', error);
      return res.status(500).json({ message: "Erreur lors de l'enregistrement." });
    }
    res.json({ message: 'Inscription Réussie !' });
  });
});

// Route pour récupérer toutes les inscriptions
app.get('/submissions', (req, res) => {
  const query = 'SELECT * FROM submission';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data: ', error);
      return res.status(500).json({ message: 'Error fetching data.' });
    }
    res.json(results);
  });
});

// Route de connexion admin
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
  }
  const query = 'SELECT * FROM admins WHERE username = ?';
  connection.execute(query, [username], (error, results) => {
    if (error) {
      console.error('Erreur lors de la connexion: ', error);
      return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }
    const admin = results[0];
    // Pour l'instant, comparaison en clair. (En production, utilisez bcrypt pour comparer le hash.)
    if (password !== admin.password) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }
    // Détermination du nom complet et du rôle selon l'username
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

// Endpoint pour valider une inscription (mise à jour soft)
app.put('/submission/validate/:id', (req, res) => {
  const submissionId = req.params.id;
  const { adminUsername } = req.body;
  if (!adminUsername) {
    return res.status(400).json({ message: 'Admin username is required.' });
  }
  const query = 'UPDATE submission SET validated = 1, validated_by = ? WHERE id = ?';
  connection.execute(query, [adminUsername, submissionId], (error, results) => {
    if (error) {
      console.error('Error validating submission: ', error);
      return res.status(500).json({ message: 'Error validating submission.' });
    }
    res.json({ message: 'Subscription validated.', submissionId });
  });
});

// Endpoint pour supprimer (hard delete) une inscription
app.delete('/submission/:id', (req, res) => {
  const submissionId = req.params.id;
  const { adminUsername } = req.body;
  if (!adminUsername) {
    return res.status(400).json({ message: 'Admin username is required.' });
  }
  const query = 'DELETE FROM submission WHERE id = ?';
  connection.execute(query, [submissionId], (error, results) => {
    if (error) {
      console.error('Error deleting submission: ', error);
      return res.status(500).json({ message: 'Error deleting submission.' });
    }
    res.json({ message: 'Subscription deleted.', submissionId });
  });
});

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static('public'));

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
