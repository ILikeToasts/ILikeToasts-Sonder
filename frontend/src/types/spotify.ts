export interface SpotifyArtist {
  id: number;
  name: string;
  image_url: string;
  spotify_id: string;
  popularity: number;
  followers: number;
}

export interface SpotifyAlbum {
    id: number;
    title: string;
    spotify_id: string;
    cover_url: string;
}