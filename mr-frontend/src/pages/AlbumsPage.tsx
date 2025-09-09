import FilterableGalleryPage from "@/components/Common/FilteredGalleryPage";
import type { SpotifyAlbum } from "@/types/spotify";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 8;

const Albums: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch all albums genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/albums/list-genres/",
        );
        const data: string[] = await res.json();
        setGenres(["All", ...data]);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch albums for current genre + page
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedGenre !== "All") params.append("genre", selectedGenre);
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        const res = await fetch(
          `http://localhost:8000/api/spotify/albums/?${params}`,
        );
        const data = await res.json();

        setAlbums(data.results);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch albums:", err);
      }
    };

    fetchAlbums();
  }, [selectedGenre, currentPage]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  return (
    <FilterableGalleryPage
      items={albums}
      genreOptions={genres}
      selectedGenre={selectedGenre}
      onGenreChange={handleGenreChange}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      totalPages={totalPages}
      mapToGalleryItem={(album) => ({
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
