// favorites.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Create a MySQL pool or connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'OrlandoFRN',
  password: 'Fernand18',
  database: 'movie_search_app'
});

// POST /api/favorites
router.post('/favorites', (req, res) => {
  const { imdbID, title, year, poster } = req.body;

  if (!imdbID || !title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = `
    INSERT INTO favorites (imdbID, title, year, poster)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE title = VALUES(title), year = VALUES(year), poster = VALUES(poster)
  `;

  db.query(query, [imdbID, title, year, poster], (err, result) => {
    if (err) {
      console.error('Error inserting favorite:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(201).json({ message: 'Movie added to favorites' });
  });
});

// GET /api/favorites - fetch all favorite movies
router.get('/favorites', (req, res) => {
  const query = 'SELECT * FROM favorites ORDER BY id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(results);
  });
});

// DELETE /api/favorites/:imdbID
router.delete('/favorites/:imdbID', (req, res) => {
  const { imdbID } = req.params;

  const query = `DELETE FROM favorites WHERE imdbID = ?`;
  db.query(query, [imdbID], (err, result) => {
    if (err) {
      console.error('Error deleting favorite:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json({ message: 'Favorite removed' });
  });
});

module.exports = router;


