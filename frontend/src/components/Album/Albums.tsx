import React, { useEffect, useState } from "react";
import { SpotifyAlbum } from "../../types/spotify";
import FilterableGalleryPage from "../Common/FilteredGalleryPage";

const Albums: React.FC = () => {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch("http://localhost:8000/api/spotify/albums/");
      const data = await response.json();
      setAlbums(data);
    };
    fetchAlbums();
  }, []);

  return (
    <FilterableGalleryPage
      items={albums}
      extractGenres={(album) => album.genres.map((g) => g.name)}
      mapToGalleryItem={(album) => ({
        id: album.id,
        title: album.title,
        imageUrl: album.cover_url,
        linkTo: `/albums/${album.spotify_id}`,
        state: { album },
      })}
    />
  );
};

export default Albums;
