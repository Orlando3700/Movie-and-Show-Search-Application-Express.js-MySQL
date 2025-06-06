// server.js

const express = require('express');
const app = express();
const path = require('path');
const favoritesRoute = require('./routes/favorites');
const cors = require('cors');

// app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Backend routes
app.use('/api', favoritesRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const favoritesRouter = require('./routes/favorites');
app.use('/api', favoritesRouter);


