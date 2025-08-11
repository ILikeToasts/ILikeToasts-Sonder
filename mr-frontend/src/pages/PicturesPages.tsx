import Masonry, { type Item } from "@/components/ui/Masonry";
import { PageScroller } from "@/components/ui/PageScroller";
import { MasonryContainer } from "@/styles/Pictures/Pictures.styles";
import { useEffect, useMemo, useState } from "react";

export default function Pictures() {
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/media-items/");
        const data = await response.json();
        const items: Item[] = data.map((item: any) => ({
          id: item.id,
          img: item.file,
          url: item.url || "#",
          height: item.height,
          mediaType: item.media_type,
          category: item.category || "Uncategorized",
        }));

        const grouped: Record<string, Item[]> = items.reduce(
          (acc, item) => {
            if (!acc[item.category]) {
              acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
          },
          {} as Record<string, Item[]>,
        );

        setGroupedItems(grouped);
        setCurrentCategoryIndex(0);
      } catch (error) {
        console.error("Failed to fetch media items: ", error);
      }
    };
    fetchMediaItems();
  }, []);

  const categories = useMemo(
    () => Object.keys(groupedItems).sort(),
    [groupedItems],
  );
  const currentCategory = categories[currentCategoryIndex];
  const currentItems = groupedItems[currentCategory] || [];

  return (
    <>
      {categories.length > 1 && (
        <PageScroller
          currentPage={currentCategoryIndex + 1}
          totalPages={categories.length}
          onPageChange={(pageIndex) => setCurrentCategoryIndex(pageIndex - 1)}
        />
      )}
      <MasonryContainer>
        <Masonry
          items={currentItems}
          ease="power3.out"
          duration={1}
          stagger={0.05}
          animateFrom="random"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      </MasonryContainer>
    </>
  );
}
