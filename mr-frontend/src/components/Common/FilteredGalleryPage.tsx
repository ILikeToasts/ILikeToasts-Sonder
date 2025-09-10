import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { PageScroller } from "../ui/PageScroller";
import type { GalleryItem } from "./Gallery";
import GalleryGrid from "./Gallery";
import { GenreSelect } from "./GenreSelect";

export interface FilterableGalleryPageProps<T> {
  items: T[];
  genreOptions: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  mapToGalleryItem: (item: T) => GalleryItem;
  galleryType?: string;
}

export default function FilterableGalleryPage<T>({
  items,
  genreOptions,
  selectedGenre,
  onGenreChange,
  currentPage,
  onPageChange,
  totalPages,
  mapToGalleryItem,
  galleryType,
}: FilterableGalleryPageProps<T>) {
  const navigate = useNavigate();
  const [statsPath, setStatsPath] = useState<string>("");
  // Optional gallery type logic
  useEffect(() => {
    if (galleryType === "singles") setStatsPath("/singles/stats");
  }, [galleryType]);

  const galleryItems = items.map(mapToGalleryItem);

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between items-center flex-wrap px-4 pt-4">
        <GenreSelect
          options={genreOptions}
          value={selectedGenre}
          onValueChange={onGenreChange}
        />

        {galleryType === "singles" && (
          <Button onClick={() => navigate(statsPath)}>Stats</Button>
        )}

        {totalPages > 1 && (
          <PageScroller
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <GalleryGrid items={galleryItems} />
    </div>
  );
}
