import { API_ROUTES } from "@/constants/ApiRoutes";
import type { SpotifySingles } from "@/types/spotify";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const Tracks: React.FC = () => {
  return (
    <GalleryPage
      genres_url={API_ROUTES.singles.genres}
      data_url={API_ROUTES.singles.data}
      itemsPerPage={8}
      mapToGalleryItem={(single: SpotifySingles) => ({
        id: single.id,
        title: single.title,
        imageUrl: single.cover_url,
        linkTo: `/singles/${single.spotify_id}`,
        state: { single },
      })}
      galleryType="singles"
    />
  );
};

export default Tracks;
