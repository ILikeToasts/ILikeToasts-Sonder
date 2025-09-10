import { type Item } from "@/components/ui/Masonry";
import { PageScroller } from "@/components/ui/PageScroller";
import { TripsPage, YTContainer } from "@/styles/Trips/TripsPage.styles";
import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";

export default function Trips() {
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/yt-media-items/",
        );
        const data = await response.json();
        const items: Item[] = data.map((item: any) => ({
          id: item.id,
          img: item.file || "",
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
    <TripsPage>
      {categories.length > 1 && (
        <PageScroller
          currentPage={currentCategoryIndex + 1}
          totalPages={categories.length}
          onPageChange={(pageIndex) => setCurrentCategoryIndex(pageIndex - 1)}
        />
      )}
      {currentItems.map((item, index) => (
        <YTContainer>
          <ReactPlayer
            src={item.url}
            controls={true}
            width={"100%"}
            height={"100%"}
          />
        </YTContainer>
      ))}
    </TripsPage>
  );
}
