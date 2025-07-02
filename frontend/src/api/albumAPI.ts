import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Adjust if your backend URL differs
});

export const fetchAlbums = () => api.get("albums/");
