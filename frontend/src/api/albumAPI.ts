import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

export const fetchAlbums = () => api.get("albums/");
export const fetchArtists = () => api.get("artists/");