import type { TVShow } from "@/types/tmdb";
import React, { useEffect, useState } from "react";
import FilterableGalleryPage from "../Common/FilteredGalleryPage";

const Animes: React.FC = () => {
  const [animes, setAnimes] = useState<TVShow[]>([]);

  useEffect(() => {
    const fetchAnimes = async () => {
      const response = await fetch(
        "http://localhost:8000/api/tmdb/list/animes/",
      );
      const data = await response.json();
      setAnimes(data);
    };
    fetchAnimes();
  }, []);

  return (
    <FilterableGalleryPage
      items={animes}
      extractGenres={(anime) => anime.genres.map((g) => g.name)}
      mapToGalleryItem={(anime) => ({
        id: anime.id,
        title: anime.title,
        imageUrl: anime.poster_url,
        linkTo: `/animes/${anime.id}`,
        state: { anime },
      })}
      items_per_page={4}
    />
  );
};

export default Animes;
