USE movie_search_app;

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imdbID VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    year VARCHAR(10),
    poster TEXT,
    UNIQUE (imdbID)
);