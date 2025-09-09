import FilterableGalleryPage from "@/components/Common/FilteredGalleryPage";
import type { Movie } from "@/types/tmdb";
import React, { useEffect, useState } from "react";

const Movies: React.FC = () => {
  const [movies, setSeries] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch(
        "http://localhost:8000/api/tmdb/list/movies/",
      );
      const data = await response.json();
      setSeries(data);
    };
    fetchMovies();
  }, []);

  return (
    <FilterableGalleryPage
      items={movies}
      extractGenres={(movie) => movie.genres.map((g) => g.name)}
      mapToGalleryItem={(movie) => ({
        id: movie.id,
        title: movie.title,
        imageUrl: movie.poster_url,
        linkTo: `/movies/${movie.id}`,
        state: { movie },
      })}
      items_per_page={4}
    />
  );
};

export default Movies;
