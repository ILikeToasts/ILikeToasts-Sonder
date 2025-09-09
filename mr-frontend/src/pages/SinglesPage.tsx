import FilterableGalleryPage from "@/components/Common/FilteredGalleryPage";
import type { SpotifyTrack } from "@/types/spotify";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 8;

const Tracks: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [singles, setSingles] = useState<SpotifyTrack[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/singles/list-genres/",
        );
        const data: string[] = await res.json();
        setGenres(["All", ...data]);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchSingles = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedGenre !== "All") params.append("genre", selectedGenre);
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        const res = await fetch(
          `http://localhost:8000/api/spotify/singles/?${params}`,
        );
        const data = await res.json();

        setSingles(data.results);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch albums:", err);
      }
    };

    fetchSingles();
  }, [selectedGenre, currentPage]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  return (
    <FilterableGalleryPage
      items={singles}
      genreOptions={genres}
      selectedGenre={selectedGenre}
      onGenreChange={handleGenreChange}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      totalPages={totalPages}
      mapToGalleryItem={(single) => ({
        id: single.id,
        title: single.title,
        imageUrl: single.cover_url,
        linkTo: `/singles/${single.spotify_id}`,
        state: { single },
      })}
    />
  );
};

export default Tracks;
