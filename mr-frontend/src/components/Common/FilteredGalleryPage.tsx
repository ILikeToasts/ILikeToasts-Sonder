import { useState } from "react";
import GalleryGrid from "./Gallery";
import type { GalleryItem } from "./Gallery";
import { Button } from "../ui/button";

export interface FilterableGalleryPageProps<T> {
  items: T[];
  extractGenres: (item: T) => string[];
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
        <Button variant={"ghost"} onClick={() => setSelectedGenre("All")}>
          All
        </Button>
        {genres.map((genre) => (
          <Button
            variant={"ghost"}
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              fontWeight: selectedGenre === genre ? "bold" : "normal",
              marginRight: "0.5rem",
              backgroundColor:
                selectedGenre === genre ? "#e0e0e096" : "transparent",
            }}
          >
            {genre}
          </Button>
        ))}
      </div>

      <GalleryGrid items={galleryItems} />
    </div>
  );
}

export default FilterableGalleryPage;
