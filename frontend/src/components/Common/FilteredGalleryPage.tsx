import React, { useState } from "react";
import GalleryGrid, { GalleryItem } from "./Gallery";

export interface FilterableGalleryPageProps<T> {
  items: T[];
  extractGenres: (item: T) => string[]; // e.g., album.genres.map(g => g.name)
  mapToGalleryItem: (item: T) => GalleryItem;
}

function FilterableGalleryPage<T>({
  items,
  extractGenres,
  mapToGalleryItem,
}: FilterableGalleryPageProps<T>) {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  const genres = Array.from(new Set(items.flatMap(extractGenres)));

  const filteredItems =
    selectedGenre === "All"
      ? items
      : items.filter((item) => extractGenres(item).includes(selectedGenre));

  const galleryItems = filteredItems.map(mapToGalleryItem);

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setSelectedGenre("All")}>All</button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              fontWeight: selectedGenre === genre ? "bold" : "normal",
              marginRight: "0.5rem",
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      <GalleryGrid items={galleryItems} />
    </div>
  );
}

export default FilterableGalleryPage;
