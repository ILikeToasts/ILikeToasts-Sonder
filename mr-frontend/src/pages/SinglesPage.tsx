import { SINGLES_DATA_URL, SINGLES_GENRES_URL } from "@/api/ApiRoutes";
import type { SpotifySingles } from "@/types/spotify";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const Tracks: React.FC = () => {
  return (
    <GalleryPage
      genres_url={SINGLES_GENRES_URL}
      data_url={SINGLES_DATA_URL}
      itemsPerPage={8}
      mapToGalleryItem={(single: SpotifySingles) => ({
        id: single.id,
        title: single.title,
        imageUrl: single.cover_url,
        linkTo: `/singles/${single.spotify_id}`,
        state: { single },
      })}
    />
  );
};

export default Tracks;
