import React, { useEffect, useState } from "react";
import type { SpotifySingle } from "../../types/spotify";
import FilterableGalleryPage from "../Common/FilteredGalleryPage";

const Singles: React.FC = () => {
  const [singles, setSingles] = useState<SpotifySingle[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch(
        "http://localhost:8000/api/spotify/singles/",
      );
      const data = await response.json();
      setSingles(data);
    };
    fetchAlbums();
  }, []);

  return (
    <FilterableGalleryPage
      items={singles}
      extractGenres={(single) => single.genres.map((g) => g.name)}
      mapToGalleryItem={(single) => ({
        id: single.id,
        title: single.title,
        imageUrl: single.cover_url,
        linkTo: `/singles/${single.spotify_id}`,
        state: { single },
      })}
    />
  );
};

export default Singles;
