import { API_ROUTES } from "@/constants/ApiRoutes";
import type { SpotifyArtist } from "@/types/spotify";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const Artists: React.FC = () => {
  return (
    <GalleryPage
      genres_url={API_ROUTES.artists.genres}
      data_url={API_ROUTES.artists.data}
      itemsPerPage={8}
      mapToGalleryItem={(artist: SpotifyArtist) => ({
        id: artist.id,
        title: artist.name,
        imageUrl: artist.image_url,
        linkTo: `/artists/${artist.spotify_id}`,
        state: { artist },
      })}
    />
  );
};

export default Artists;
