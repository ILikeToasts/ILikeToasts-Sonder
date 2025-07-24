export interface SpotifyArtist {
  id: number;
  name: string;
  image_url: string;
  spotify_id: string;
  popularity: number;
  followers: number;
  genres: SpotifyGenre[];
}

export interface SpotifyGenre {
  id: number;
  name: string;
}

export interface SpotifyAlbum {
  id: number;
  title: string;
  spotify_id: string;
  cover_url: string;
  genres: SpotifyGenre[];
}

export interface SpotifyAlbumReview {
  SpotifyAlbum: SpotifyAlbum;
  rating: number;
  content: string;
}

export interface SongReview {}
