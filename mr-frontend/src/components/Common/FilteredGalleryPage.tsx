import { useState } from "react";
import GalleryGrid from "./Gallery";
import type { GalleryItem } from "./Gallery";
import { GenreSelect } from "../Album/GenreSelect";
import { PageScroller } from "../ui/PageScroller";

export interface FilterableGalleryPageProps<T> {
  items: T[];
  extractGenres: (item: T) => string[];
  mapToGalleryItem: (item: T) => GalleryItem;
}

const ITEMS_PER_PAGE = 8;

export default function FilterableGalleryPage<T>({
  items,
  extractGenres,
  mapToGalleryItem,
}: FilterableGalleryPageProps<T>) {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between items-center flex-wrap px-4 pt-4">
        <GenreSelect
          options={options}
          value={selectedGenre}
          onValueChange={handleGenreChange}
        />
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
