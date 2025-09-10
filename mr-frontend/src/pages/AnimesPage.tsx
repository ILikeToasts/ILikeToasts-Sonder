import { API_ROUTES } from "@/constants/ApiRoutes";
import type { TVShow } from "@/types/tmdb";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const ITEMS_PER_PAGE = 4;

const Animes: React.FC = () => {
  return (
    <GalleryPage
      genres_url={API_ROUTES.animes.genres}
      data_url={API_ROUTES.animes.data}
      itemsPerPage={ITEMS_PER_PAGE}
      mapToGalleryItem={(anime: TVShow) => ({
        id: anime.id,
        title: anime.title,
        imageUrl: anime.poster_url,
        linkTo: `/animes/${anime.id}`,
        state: { anime },
      })}
    />
  );
};

export default Animes;
