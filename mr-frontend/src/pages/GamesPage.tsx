import { API_ROUTES } from "@/constants/ApiRoutes";
import type { Game } from "@/types/games";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const ITEMS_PER_PAGE = 16;

const Games: React.FC = () => {
  return (
    <GalleryPage
      genres_url={API_ROUTES.games.genres}
      data_url={API_ROUTES.games.data}
      itemsPerPage={ITEMS_PER_PAGE}
      mapToGalleryItem={(game: Game) => ({
        id: game.appID,
        title: game.name,
        imageUrl: game.image,
        linkTo: `/games/${game.appID}`,
        state: { game },
      })}
    />
  );
};

export default Games;
