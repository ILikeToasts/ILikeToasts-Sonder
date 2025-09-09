import { ANIMES_DATA_URL, ANIMES_GENRES_URL } from "@/api/ApiRoutes";
import type { TVShow } from "@/types/tmdb";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const ITEMS_PER_PAGE = 4;

const Animes: React.FC = () => {
  return (
    <GalleryPage
      genres_url={ANIMES_GENRES_URL}
      data_url={ANIMES_DATA_URL}
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
