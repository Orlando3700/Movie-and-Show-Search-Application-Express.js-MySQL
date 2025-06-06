🎬 Movie Search Application

A sleek and responsive web application that lets users search for movies and TV shows, view details, and save favorites — powered by an Express.js + MySQL backend.

---

🛠️ Built With
HTML, CSS, JavaScript (Frontend)
Express.js (Node.js framework)
MySQL (Relational Database)
Fetch API for client-server communication

---

🚀 Features
🔍 Search movies and TV shows
💾 Save favorite movies
❤️ View your favorites on a separate page
📱 Fully responsive design with smooth transitions
🌐 Clean navigation with About & Favorites pages

---

📂 Project Structure
project-folder/
 public/
 MovieSearchApp.html
 favoritesPage.js
 favorites.html
 about.html
 style.css
 index.js

server.js
MovieSearchAppDatabase.sql
MovieSearchAppDatabase2.sql

routes/
 favorites.js

.env
.gitignore
README.md

---

⚙️ Setup Instructions
### 1. Clone the repository

git clone https://github.com/Orlando3700/Movie-and-Show-Search-Application-Express.js-MySQL.git
cd Movie_Search_Application
### 2. Install Dependencies

npm install
### 3. Start the Server

node server.js
Visit http://localhost:3000

---

💾 Database Setup
Use MySQL to create the required tables. Here's a simple schema example:

CREATE DATABASE movie_search_app;

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imdbID VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    year VARCHAR(10),
    poster TEXT,
    UNIQUE (imdbID)
);

