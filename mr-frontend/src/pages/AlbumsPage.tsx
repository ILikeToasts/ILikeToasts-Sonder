import { ALBUMS_DATA_URL, ALBUMS_GENRES_URL } from "@/api/ApiRoutes";
import type { SpotifyAlbum } from "@/types/spotify";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const Albums: React.FC = () => {
  return (
    <GalleryPage
      genres_url={ALBUMS_GENRES_URL}
      data_url={ALBUMS_DATA_URL}
      itemsPerPage={8}
      mapToGalleryItem={(album: SpotifyAlbum) => ({
        id: album.id,
        title: album.title,
        imageUrl: album.cover_url,
        linkTo: `/albums/${album.spotify_id}`,
        state: { album },
      })}
    />
  );
};

export default Albums;
