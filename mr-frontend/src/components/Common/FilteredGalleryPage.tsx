import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenreSelect } from "../Album/GenreSelect";
import { Button } from "../ui/button";
import { PageScroller } from "../ui/PageScroller";
import type { GalleryItem } from "./Gallery";
import GalleryGrid from "./Gallery";

export interface FilterableGalleryPageProps<T> {
  items: T[];
  galleryType?: string;
  extractGenres: (item: T) => string[];
  mapToGalleryItem: (item: T) => GalleryItem;
  items_per_page?: number;
}

export default function FilterableGalleryPage<T>({
  items,
  extractGenres,
  mapToGalleryItem,
  galleryType = "",
  items_per_page,
}: FilterableGalleryPageProps<T>) {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statsPath, setStatsPath] = useState<string>("");
  const ITEMS_PER_PAGE = items_per_page ? items_per_page : 8;

  const genres = Array.from(new Set(items.flatMap(extractGenres)));
  const options = ["All", ...genres];

  const filtered =
    selectedGenre === "All"
      ? items
      : items.filter((item) => extractGenres(item).includes(selectedGenre));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const galleryItems = paginatedItems.map(mapToGalleryItem);

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    setCurrentPage(1);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (galleryType === "tracks") {
      setStatsPath("/tracks/stats");
    }
  }, [galleryType]);

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between items-center flex-wrap px-4 pt-4">
        <GenreSelect
          options={options}
          value={selectedGenre}
          onValueChange={handleGenreChange}
        />
        {galleryType === "tracks" && (
          <Button onClick={() => navigate(statsPath)}>Stats</Button>
        )}
        {totalPages > 1 && (
          <PageScroller
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      <GalleryGrid items={galleryItems} />
    </div>
  );
}
