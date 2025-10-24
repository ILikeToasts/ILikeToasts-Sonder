const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/";

export const API_ROUTES = {
  albums: {
    genres: `${BASE_URL}albums/list-genres/`,
    data: `${BASE_URL}spotify/albums/list/?`,
  },
  artists: {
    genres: `${BASE_URL}artists/list-genres/`,
    data: `${BASE_URL}spotify/artists/list/?`,
  },
  singles: {
    genres: `${BASE_URL}singles/list-genres/`,
    data: `${BASE_URL}spotify/singles/list/?`,
  },
  games: {
    genres: `${BASE_URL}steam/games/list-genres/`,
    data: `${BASE_URL}steam/games/list/?`,
  },
  movies: {
    genres: `${BASE_URL}tmdb/list/movies-genres/`,
    data: `${BASE_URL}tmdb/list/movies/?`,
  },
  series: {
    genres: `${BASE_URL}tmdb/list/series-genres/`,
    data: `${BASE_URL}tmdb/list/series/?`,
  },
  animes: {
    genres: `${BASE_URL}tmdb/list/animes-genres/`,
    data: `${BASE_URL}tmdb/list/animes/?`,
  },
  stats: {
    topGenres: `${BASE_URL}data/top-genres/`,
    topArtists: `${BASE_URL}data/top-artists/`,
    bottomArtists: `${BASE_URL}data/bottom-artists/`,
    favoriteArtists: `${BASE_URL}data/favorite-artists/`,
  },
  llm: {
    musicProfile: `${BASE_URL}user/profile/tracks/`,
    artistRecommendations: (artistName: string) =>
      `${BASE_URL}recommend/${artistName}`,
  },
  reviews: {
    albums: (albumId: string | number) =>
      `${BASE_URL}spotify/reviews/album/${albumId}/`,
  },
  ytMediaItems: {
    genres: `${BASE_URL}yt-media-items/categories/`,
    data: `${BASE_URL}yt-media-items/`,
  },
};
