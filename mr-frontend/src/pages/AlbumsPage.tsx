import { API_ROUTES } from "@/constants/ApiRoutes";
import type { SpotifyAlbum } from "@/types/spotify";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const Albums: React.FC = () => {
  return (
    <GalleryPage
      genres_url={API_ROUTES.albums.genres}
      data_url={API_ROUTES.albums.data}
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
