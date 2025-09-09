import { MOVIES_DATA_URL, MOVIES_GENRES_URL } from "@/api/ApiRoutes";
import type { Movie } from "@/types/tmdb";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const ITEMS_PER_PAGE = 4;

const Movies: React.FC = () => {
  return (
    <GalleryPage
      genres_url={MOVIES_GENRES_URL}
      data_url={MOVIES_DATA_URL}
      itemsPerPage={ITEMS_PER_PAGE}
      mapToGalleryItem={(movie: Movie) => ({
        id: movie.id,
        title: movie.title,
        imageUrl: movie.poster_url,
        linkTo: `/movies/${movie.id}`,
        state: { movie },
      })}
    />
  );
};

export default Movies;
