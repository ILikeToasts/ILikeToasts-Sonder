import FilterableGalleryPage from "@/components/Common/FilteredGalleryPage";
import { useEffect, useState } from "react";

interface GalleryPageProps<T> {
  genres_url: string;
  data_url: string;
  itemsPerPage?: number;
  mapToGalleryItem: (item: T) => {
    id: string | number;
    title: string;
    imageUrl: string;
    linkTo: string;
    state?: any;
  };
}

const GalleryPage = <T,>({
  genres_url,
  data_url,
  itemsPerPage,
  mapToGalleryItem,
}: GalleryPageProps<T>) => {
  const ITEMS_PER_PAGE = itemsPerPage || 8;
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch all data genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(genres_url);
        const data: string[] = await res.json();
        setGenres(["All", ...data]);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch all data + page
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedGenre !== "All") params.append("genre", selectedGenre);
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        const res = await fetch(`${data_url}${params}`);
        const data = await res.json();

        setData(data.results);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [selectedGenre, currentPage]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  return (
    <FilterableGalleryPage
      items={data}
      genreOptions={genres}
      selectedGenre={selectedGenre}
      onGenreChange={handleGenreChange}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      totalPages={totalPages}
      mapToGalleryItem={mapToGalleryItem}
    />
  );
};

export default GalleryPage;
