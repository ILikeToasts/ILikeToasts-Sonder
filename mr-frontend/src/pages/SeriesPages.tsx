import FilterableGalleryPage from "@/components/Common/FilteredGalleryPage";
import type { TVShow } from "@/types/tmdb";
import React, { useEffect, useState } from "react";

const Series: React.FC = () => {
  const [series, setSeries] = useState<TVShow[]>([]);

  useEffect(() => {
    const fetchTVShows = async () => {
      const response = await fetch(
        "http://localhost:8000/api/tmdb/list/tv-shows/",
      );
      const data = await response.json();
      setSeries(data);
    };
    fetchTVShows();
  }, []);

  return (
    <FilterableGalleryPage
      items={series}
      extractGenres={(serie) => serie.genres.map((g) => g.name)}
      mapToGalleryItem={(serie) => ({
        id: serie.id,
        title: serie.title,
        imageUrl: serie.poster_url,
        linkTo: `/series/${serie.id}`,
        state: { serie },
      })}
      items_per_page={4}
    />
  );
};

export default Series;
