import { useState } from "react";
import GalleryGrid from "./Gallery";
import type { GalleryItem } from "./Gallery";
import { GenreSelect } from "../Album/GenreSelect";

export interface FilterableGalleryPageProps<T> {
  items: T[];
  extractGenres: (item: T) => string[];
  mapToGalleryItem: (item: T) => GalleryItem;
}

export default function FilterableGalleryPage<T>({
  items,
  extractGenres,
  mapToGalleryItem,
}: FilterableGalleryPageProps<T>) {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  const genres = Array.from(new Set(items.flatMap(extractGenres)));
  const options = ["All", ...genres];

  const filtered =
    selectedGenre === "All"
      ? items
      : items.filter((item) => extractGenres(item).includes(selectedGenre));

  const galleryItems = filtered.map(mapToGalleryItem);

  return (
    <div className="space-y-4">
      <GenreSelect
        options={options}
        value={selectedGenre}
        onValueChange={setSelectedGenre}
      />

      <GalleryGrid items={galleryItems} />
    </div>
  );
}
