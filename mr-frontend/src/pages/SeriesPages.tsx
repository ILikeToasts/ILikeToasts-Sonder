import type { TVShow } from "@/types/tmdb";
import React, { useEffect, useState } from "react";
import FilterableGalleryPage from "../components/Common/FilteredGalleryPage";

const ITEMS_PER_PAGE = 4;

const Series: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [series, setSeries] = useState<TVShow[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch all series genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/tmdb/series/list-genres/",
        );
        const data: string[] = await res.json();
        setGenres(["All", ...data]);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch series for current genre + page
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedGenre !== "All") params.append("genre", selectedGenre);
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        const res = await fetch(
          `http://localhost:8000/api/tmdb/list/series/?${params}`,
        );
        const data = await res.json();

        setSeries(data.results);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch albums:", err);
      }
    };

    fetchSeries();
  }, [selectedGenre, currentPage]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  return (
    <FilterableGalleryPage
      items={series}
      genreOptions={genres}
      selectedGenre={selectedGenre}
      onGenreChange={handleGenreChange}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      totalPages={totalPages}
      mapToGalleryItem={(serie) => ({
        id: serie.id,
        title: serie.title,
        imageUrl: serie.poster_url,
        linkTo: `/series/${serie.id}`,
        state: { serie },
      })}
    />
  );
};

export default Series;
