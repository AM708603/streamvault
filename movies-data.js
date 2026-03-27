// ============================================================
// STREAMVAULT — Shared Movie Data & Utilities
// Replace embed URLs with your actual embed sources
// ============================================================

const MOVIES = [
  {
    id: 1,
    title: "Interstellar",
    year: 2014,
    genre: ["Sci-Fi", "Drama"],
    rating: 8.7,
    duration: "2h 49m",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt0816692",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    tags: ["space", "time travel", "wormhole"],
    featured: true
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime"],
    rating: 9.0,
    duration: "2h 32m",
    description: "Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt0468569",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    tags: ["batman", "joker", "gotham"],
    featured: true
  },
  {
    id: 3,
    title: "Inception",
    year: 2010,
    genre: ["Sci-Fi", "Thriller"],
    rating: 8.8,
    duration: "2h 28m",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/s2bT29y0ngXxxu2IA8AOzzXTRhd.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt1375666",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    tags: ["dreams", "heist", "mind"],
    featured: false
  },
  {
    id: 4,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: ["Drama"],
    rating: 9.3,
    duration: "2h 22m",
    description: "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/avedvodAZUcwqevBfm8p4G2NziQ.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt0111161",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    tags: ["prison", "hope", "friendship"],
    featured: false
  },
  {
    id: 5,
    title: "Pulp Fiction",
    year: 1994,
    genre: ["Crime", "Drama"],
    rating: 8.9,
    duration: "2h 34m",
    description: "The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt0110912",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
    tags: ["crime", "neo-noir", "nonlinear"],
    featured: false
  },
  {
    id: 6,
    title: "The Matrix",
    year: 1999,
    genre: ["Sci-Fi", "Action"],
    rating: 8.7,
    duration: "2h 16m",
    description: "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt0133093",
    director: "The Wachowskis",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    tags: ["simulation", "hacker", "revolution"],
    featured: true
  },
  {
    id: 7,
    title: "Parasite",
    year: 2019,
    genre: ["Thriller", "Drama"],
    rating: 8.5,
    duration: "2h 12m",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt6751668",
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    tags: ["class", "korean", "social"],
    featured: false
  },
  {
    id: 8,
    title: "Avengers: Endgame",
    year: 2019,
    genre: ["Action", "Sci-Fi"],
    rating: 8.4,
    duration: "3h 1m",
    description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions.",
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt4154796",
    director: "Anthony & Joe Russo",
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    tags: ["marvel", "avengers", "superhero"],
    featured: true
  },
  {
    id: 9,
    title: "Joker",
    year: 2019,
    genre: ["Crime", "Drama"],
    rating: 8.4,
    duration: "2h 2m",
    description: "A mentally troubled comedian embarks on a downward spiral that leads to the creation of an iconic villain.",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt7286456",
    director: "Todd Phillips",
    cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
    tags: ["villain", "origin", "psychological"],
    featured: false
  },
  {
    id: 10,
    title: "Dune",
    year: 2021,
    genre: ["Sci-Fi", "Adventure"],
    rating: 8.0,
    duration: "2h 35m",
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklpcvkCngftfnXKlWVIJqs.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/eeivK1JlhpdcfHLJ5tG702X0wr0.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt1160419",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac"],
    tags: ["desert", "prophecy", "empire"],
    featured: false
  },
  {
    id: 11,
    title: "Spider-Man: No Way Home",
    year: 2021,
    genre: ["Action", "Sci-Fi"],
    rating: 8.2,
    duration: "2h 28m",
    description: "Spider-Man seeks help from Doctor Strange, leading to a multiverse of consequences.",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt10872600",
    director: "Jon Watts",
    cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
    tags: ["multiverse", "spiderman", "marvel"],
    featured: false
  },
  {
    id: 12,
    title: "John Wick",
    year: 2014,
    genre: ["Action", "Thriller"],
    rating: 7.4,
    duration: "1h 41m",
    description: "An ex-hitman comes out of retirement to track down the gangsters who killed his dog.",
    poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/umC04Cozevu8nn3JTDJ1pc7PVTn.jpg",
    embedUrl: "https://vidsrc.to/embed/movie/tt2911666",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen"],
    tags: ["assassin", "revenge", "action"],
    featured: false
  },
];

// -------------------------------------------------------
// Utility Functions
// -------------------------------------------------------

function getMovieById(id) {
  return MOVIES.find(m => m.id === parseInt(id));
}

function getRelatedMovies(movie, count = 6) {
  return MOVIES
    .filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g)))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function getFeaturedMovies() {
  return MOVIES.filter(m => m.featured);
}

function searchMovies(query) {
  const q = query.toLowerCase();
  return MOVIES.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.genre.some(g => g.toLowerCase().includes(q)) ||
    m.tags.some(t => t.includes(q))
  );
}

function getMoviesByGenre(genre) {
  return MOVIES.filter(m => m.genre.includes(genre));
}

function getAllGenres() {
  const genres = new Set();
  MOVIES.forEach(m => m.genre.forEach(g => genres.add(g)));
  return [...genres].sort();
}

// -------------------------------------------------------
// ⚠️ MONETAG CONFIGURATION — Replace with your actual IDs
// Get these from your Monetag publisher dashboard
// -------------------------------------------------------
const MONETAG_CONFIG = {
  // Your publisher website ID from Monetag dashboard
  publisherId: "YOUR_MONETAG_PUBLISHER_ID",

  // Zone IDs for different ad formats (from Monetag > Ad Zones)
  zones: {
    popunder: "YOUR_POPUNDER_ZONE_ID",       // Popunder ad zone
    banner_728x90: "YOUR_BANNER_728_ZONE_ID", // Leaderboard banner
    banner_300x250: "YOUR_BANNER_300_ZONE_ID",// Rectangle banner
    inpage_push: "YOUR_INPAGE_PUSH_ZONE_ID",  // In-page push
    pushNotification: "YOUR_PUSH_NOTIF_ID"    // Push subscription
  }
};

// -------------------------------------------------------
// Popunder — fires ONCE per session on first user click
// This is legitimate and Monetag-compliant
// -------------------------------------------------------
let popunderFired = false;
function initPopunder() {
  if (sessionStorage.getItem('sv_pop_fired')) return;

  document.addEventListener('click', function firePop() {
    if (popunderFired) return;
    popunderFired = true;
    sessionStorage.setItem('sv_pop_fired', '1');

    // Replace with your actual Monetag popunder script tag
    // Monetag will give you a script like:
    // (function(d,z,s){...})(document, YOUR_ZONE_ID, ...)
    // Insert it here:
    const s = document.createElement('script');
    s.src = `//thubanoa.com/1?z=${MONETAG_CONFIG.zones.popunder}`;
    s.async = true;
    document.head.appendChild(s);

    document.removeEventListener('click', firePop);
  }, { once: false });
}

// -------------------------------------------------------
// Push Notification Subscription — fires after 15s
// Non-intrusive: waits for user to engage first
// -------------------------------------------------------
function initPushSubscription() {
  if (sessionStorage.getItem('sv_push_shown')) return;

  setTimeout(() => {
    sessionStorage.setItem('sv_push_shown', '1');

    // Monetag push subscription script
    // Replace with your actual Monetag push init code from dashboard:
    // https://monetag.com/push-notifications/
    const s = document.createElement('script');
    s.src = `//cdn.pushpushgo.com/YOUR_PUSH_ID/sw/subscribe.js`;
    s.async = true;
    document.body.appendChild(s);
  }, 15000); // 15 seconds after page load
}

// -------------------------------------------------------
// Render a movie card (shared across pages)
// -------------------------------------------------------
function renderMovieCard(movie) {
  return `
    <a href="movie.html?id=${movie.id}" class="movie-card" data-id="${movie.id}">
      <div class="card-poster">
        <img src="${movie.poster}" alt="${movie.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x450/0a0a0a/ff6b35?text=${encodeURIComponent(movie.title)}'">
        <div class="card-overlay">
          <div class="card-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
          <div class="card-rating">⭐ ${movie.rating}</div>
        </div>
        <div class="card-quality">HD</div>
      </div>
      <div class="card-info">
        <h3>${movie.title}</h3>
        <span class="card-meta">${movie.year} · ${movie.genre[0]}</span>
      </div>
    </a>
  `;
}
