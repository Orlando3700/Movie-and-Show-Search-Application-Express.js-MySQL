document.addEventListener('DOMContentLoaded', fetchFavorites);

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
    movieCard.classList.add('movie-card', 'fade-in');

    movieCard.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h2>${movie.title}</h2>
      <p>${movie.year}</p>
    `;

    FavoritesGrid.appendChild(movieCard);
  });
}
