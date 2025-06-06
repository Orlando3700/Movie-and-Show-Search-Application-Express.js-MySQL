// index.js

// Waits until the entire HTML document is fully loaded.
// DOMContentLoaded event: Ensures your code doesn’t run before 
// the DOM is ready.
// fetchmovies() call: Automatically fetches a list of movies using
// a random search term when the page loads.
document.addEventListener('DOMContentLoaded', function () {
    fetchmovies();
});

// Trigger searchMovies() when Enter key is pressed
document.getElementById('searchInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleFavoritesBtn');
    const favoritesSection = document.getElementById('favoritesSection');

    toggleBtn.addEventListener('click', () => {
        if (favoritesSection.style.display === 'block') {
            favoritesSection.style.display = 'none';
            toggleBtn.textContent = 'Favorites ❤️';
        } else {
            favoritesSection.style.display = 'block';
            toggleBtn.textContent = 'Close Favorites ✖️';
            fetchFavorites(); // Fetch favorites whenever showing the section
        }
    });
});

// Defines a function
function fetchmovies() {
    // omdb API key
    const apiKey = 'd6b537bf';

    // Stores your OMDb API key for later use in requests
    const DisplayMovies = document.getElementById('DisplayMovies');
	
	// Set a default term
	const defaultTerm = 'movieGenre';

    // Fetch movie data from OMDB API
	// Sends request to the OMDb API to search for movies
	fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${defaultTerm}`)
		// Converts the HTTP response into a JSON object
        .then(response => response.json())
		// If the response contains movie results, calls showMovies() to display them.
        .then(data => {
            if (data.Search && data.Search.length > 0) {
                showMovies(data.Search);
			// If there’s an error (e.g., network failure), logs the error and displays a user-friendly message.
            } else {
                DisplayMovies.innerHTML = '<p>No movies found!</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            DisplayMovies.innerHTML = '<p>Error fetching movies. Please try again later.</p>';
        });
}

// Defines a new function to be called when the user performs a manual search.
function searchMovies() {
    // omdb API key
	// Retrieves the user’s search query from an input field with ID searchInput.
    const apiKey = 'd6b537bf';
    const searchInput = document.getElementById('searchInput').value;

    // Selects the container to show the results
    const DisplayMovies = document.getElementById('DisplayMovies');

    // Checks if the input is not empty or just spaces
    if (searchInput.trim() !== '') {

        // Fetch movie data from OMDB API
		fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput}`)
            .then(response => response.json())
            .then(data => {
                if (data.Search && data.Search.length > 0) {
                    showMovies(data.Search);
                } else {
                    DisplayMovies.innerHTML = '<p>No movies found with the input!</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                DisplayMovies.innerHTML = '<p>Error fetching movies. Please try again later.</p>';
            });
    } else {
          DisplayMovies.innerHTML = '<p>Please enter a movie title to search.</p>';
    }
}

// Defines a function that takes a list of movies and shows them in the DOM.
function showMovies(movies) {
    const DisplayMovies = document.getElementById('DisplayMovies');

    // Clear previous results
    DisplayMovies.innerHTML = '';

    // Display each movie in the results
	// Iterates through each movie in the list
    movies.forEach(movie => {
		// Creates a div for each movie and adds a CSS class for styling.
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
		
		// Use default image if poster is not available
		const poster = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image';

		// Inserts the movie's image, title, and year into the card using template literals.
		movieCard.innerHTML = `
		  <img src="${movie.Poster}" alt="${movie.Title}">
		  <h2>${movie.Title}</h2>
		  <p>${movie.Year}</p>
		  <button class="favorite-btn" data-id="${movie.imdbID}"
		          data-title="${movie.Title}" data-year="${movie.Year}" 
		          data-poster="${movie.Poster}">
		    ❤️ Favorite
		  </button>
		`;
	
		// Show movie details when the card (not favorite button) is clicked
		movieCard.addEventListener('click', (e) => {
		  if (!e.target.classList.contains('favorite-btn')) {
		    showMovieDetails(movie.imdbID);
		  }
		});

		// Appends each movie card to the main movie container on the webpage.
        DisplayMovies.appendChild(movieCard);
		
		// Create favorite button
		const favoriteButton = movieCard.querySelector('.favorite-btn');
		favoriteButton.addEventListener('click', (e) => {
		  e.stopPropagation(); // prevent opening modal

		  const movieData = {
		    imdbID: favoriteButton.dataset.id,
		    title: favoriteButton.dataset.title,
		    year: favoriteButton.dataset.year,
		    poster: favoriteButton.dataset.poster
		  };

		  toggleFavorite(favoriteButton, movieData);
		});
    });
}

// Function to add movie to favorites
function toggleFavorite(button, movie) {
  const isFavorited = button.classList.contains('favorited');

  const method = isFavorited ? 'DELETE' : 'POST';
  const url = isFavorited
    ? `/api/favorites/${movie.imdbID}`
    : '/api/favorites';

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (!isFavorited) {
    options.body = JSON.stringify(movie);
  }

  fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update favorite');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message);

      // Toggle visual state
      if (isFavorited) {
        button.classList.remove('favorited');
        button.textContent = '❤️ Favorite';
      } else {
        button.classList.add('favorited');
        button.textContent = '💔 Unfavorite';
      }
    })
    .catch(err => {
      console.error('Error toggling favorite:', err);
      alert('Could not update favorite. Try again later.');
    });
}

function fetchFavorites() {
  fetch('/api/favorites')
    .then(response => response.json())
    .then(favorites => {
      if (favorites.length > 0) {
        showFavorites(favorites);
      } else {
        document.getElementById('FavoritesGrid').innerHTML = '<p>No favorites yet.</p>';
      }
    })
    .catch(err => {
      console.error('Error fetching favorites:', err);
      document.getElementById('FavoritesGrid').innerHTML = '<p>Error loading favorites.</p>';
    });
}

function showFavorites(movies) {
  const FavoritesGrid = document.getElementById('FavoritesGrid');
  FavoritesGrid.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    movieCard.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h2>${movie.title}</h2>
      <p>${movie.year}</p>
    `;

    FavoritesGrid.appendChild(movieCard);
  });
}

// Call fetchFavorites on page load or at an appropriate time
document.addEventListener('DOMContentLoaded', fetchFavorites);

// Function to show movie details when clicking on a movie card
function showMovieDetails(imdbID) {
    const apiKey = 'd6b537bf';
    const modal = document.getElementById('movieModal');
    const modalContent = document.getElementById('modalContent');

	// fetch imdbID data
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`)
        .then(response => response.json())
        .then(movie => {
            const poster = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image';

            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h2>${movie.Title} (${movie.Year})</h2>
                <img src="${poster}" alt="${movie.Title}">
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
            `;

			// Show the modal with animation
			modal.classList.add('show');

			// Close modal on close button click
			modal.querySelector('.close').onclick = () => {
			    modal.classList.remove('show');
			};
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
}

// Close modal when clicking outside it
window.onclick = function (event) {
    const modal = document.getElementById('movieModal');
	if (event.target === modal) {
	        modal.classList.remove('show');
	    }
	};



