import FilterableGalleryPage from "@/components/Common/FilteredGalleryPage";
import type { Game } from "@/types/games";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 16;

const Games: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch all games genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/steam/games/list-genres/",
        );
        const data: string[] = await res.json();
        setGenres(["All", ...data]);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch games for current genre + page
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedGenre !== "All") params.append("genre", selectedGenre);
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        const res = await fetch(
          `http://localhost:8000/api/steam/games/list/?${params}`,
        );
        const data = await res.json();

        setGames(data.results);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch albums:", err);
      }
    };

    fetchGames();
  }, [selectedGenre, currentPage]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  return (
    <FilterableGalleryPage
      items={games}
      genreOptions={genres}
      selectedGenre={selectedGenre}
      onGenreChange={handleGenreChange}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      totalPages={totalPages}
      mapToGalleryItem={(game) => ({
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
