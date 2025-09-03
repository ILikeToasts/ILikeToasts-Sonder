import type { Game } from "@/types/games";
import React, { useEffect, useState } from "react";
import FilterableGalleryPage from "../Common/FilteredGalleryPage";

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const response = await fetch(
        "http://localhost:8000/api/steam/games/list/",
      );
      const data = await response.json();
      setGames(data);
    };
    fetchGames();
  }, []);

  return (
    <FilterableGalleryPage
      items={games}
      extractGenres={(game) => game.genres.map((g) => g.name)}
      mapToGalleryItem={(game) => ({
        id: game.appID,
        title: game.name,
        imageUrl: game.image,
        linkTo: `/games/${game.appID}`,
        state: { game },
      })}
      items_per_page={4}
    />
  );
};

export default Games;
