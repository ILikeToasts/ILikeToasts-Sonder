import { GAMES_DATA_URL, GAMES_GENRES_URL } from "@/api/ApiRoutes";
import type { Game } from "@/types/games";
import React from "react";
import GalleryPage from "./GalleryPageTemplate";

const ITEMS_PER_PAGE = 16;

const Games: React.FC = () => {
  return (
    <GalleryPage
      genres_url={GAMES_GENRES_URL}
      data_url={GAMES_DATA_URL}
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
