import API_KEY from './apikey.js';

const searchMovies = async (searchTerm) => {
  const url = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.Search;
  } catch (error) {
    console.error(`Erreur lors de la recherche de films : ${error}`);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page
  const searchTerm = document.getElementById('movie-title').value;
  const movies = await searchMovies(searchTerm);

  const resultsContainer = document.getElementById('movie-results');
  resultsContainer.innerHTML = ''; // Efface les résultats précédents

  if (movies) {
    movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.innerHTML = `
        <h3>${movie.Title}</h3>
        <img src="${movie.Poster}" alt="${movie.Title}">
        <p>Année : ${movie.Year}</p>

        <button class="btn btn-dark read-more" data-id="${movie.imdbID}">Read More</button>
      `;
      resultsContainer.appendChild(movieElement);
    });
  }

  // Écouteur d'événements pour chaque bouton "Read More"
  const readMoreButtons = document.querySelectorAll('.read-more');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const imdbID = button.getAttribute('data-id');
      const movieDetails = await fetchMovieDetails(imdbID);
      // Afficher les détails du film dans une popup
      alert(movieDetails);
    });
  });
});

// Fonction pour récupérer les détails d'un film en fonction de son ID IMDb
const fetchMovieDetails = async (imdbID) => {
  const url = `http://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.Plot; // Retourne le résumé du film
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du film : ${error}`);
    return 'Détails non disponibles';
  }
};