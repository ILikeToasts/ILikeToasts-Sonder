import type { TVShow } from "@/types/tmdb";
import React, { useEffect, useState } from "react";
import FilterableGalleryPage from "../components/Common/FilteredGalleryPage";

const ITEMS_PER_PAGE = 4;

const Animes: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [animes, setAnimes] = useState<TVShow[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch all animes genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/tmdb/animes/list-genres/",
        );
        const data: string[] = await res.json();
        setGenres(["All", ...data]);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch animes for current genre + page
  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedGenre !== "All") params.append("genre", selectedGenre);
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        const res = await fetch(
          `http://localhost:8000/api/tmdb/list/animes/?${params}`,
        );
        const data = await res.json();

        setAnimes(data.results);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch albums:", err);
      }
    };

    fetchAnimes();
  }, [selectedGenre, currentPage]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  return (
    <FilterableGalleryPage
      items={animes}
      genreOptions={genres}
      selectedGenre={selectedGenre}
      onGenreChange={handleGenreChange}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      totalPages={totalPages}
      mapToGalleryItem={(anime) => ({
        id: anime.id,
        title: anime.title,
        imageUrl: anime.poster_url,
        linkTo: `/animes/${anime.id}`,
        state: { anime },
      })}
    />
  );
};

export default Animes;
