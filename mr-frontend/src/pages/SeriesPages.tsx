import { TVSHOWS_DATA_URL, TVSHOWS_GENRES_URL } from "@/api/ApiRoutes";
import type { TVShow } from "@/types/tmdb";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const ITEMS_PER_PAGE = 4;

const Series: React.FC = () => {
  return (
    <GalleryPage
      genres_url={TVSHOWS_GENRES_URL}
      data_url={TVSHOWS_DATA_URL}
      itemsPerPage={ITEMS_PER_PAGE}
      mapToGalleryItem={(serie: TVShow) => ({
        id: serie.id,
        title: serie.title,
        imageUrl: serie.poster_url,
        linkTo: `/series/${serie.id}`,
        state: { serie },
      })}
    />
  );
};

export default Series;
