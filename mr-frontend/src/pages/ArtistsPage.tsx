import { ARTISTS_DATA_URL, ARTISTS_GENRES_URL } from "@/api/ApiRoutes";
import type { SpotifyArtist } from "@/types/spotify";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const Artists: React.FC = () => {
  return (
    <GalleryPage
      genres_url={ARTISTS_GENRES_URL}
      data_url={ARTISTS_DATA_URL}
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
