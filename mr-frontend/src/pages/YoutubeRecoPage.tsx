import { GenreSelect } from "@/components/Common/GenreSelect";
import { type Item } from "@/components/ui/Masonry";
import { PageScroller } from "@/components/ui/PageScroller";
import { API_ROUTES } from "@/constants/ApiRoutes";
import { TripsPage, YTContainer } from "@/styles/Trips/TripsPage.styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";

export default function YotubeReco() {
  const ITEMS_PER_PAGE = 4;
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>(
    {},
  );
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});
  const [totalPages, setTotalPages] = useState<Record<string, number>>({});
  const currentItems = useMemo(
    () => groupedItems[currentCategory] || [],
    [groupedItems, currentCategory],
  );
  const currentPage = currentCategory ? categoryPages[currentCategory] || 1 : 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_ROUTES.ytMediaItems.genres);
        const data: string[] = await response.json();
        setCategories(data);
        setCurrentCategory(data[0] || "");
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!currentCategory) return;

    const fetchItems = async () => {
      try {
        const params = new URLSearchParams();
        params.append("category", currentCategory);
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        const response = await fetch(
          API_ROUTES.ytMediaItems.data + `?${params}`,
        );
        const data = await response.json();

        const items: Item[] = data.results.map((item: any) => ({
          id: item.id,
          img: item.file,
          url: item.url || "#",
          height: item.height,
          mediaType: item.media_type,
          category: item.category || "Uncategorized",
        }));

        setGroupedItems((prev) => ({ ...prev, [currentCategory]: items }));
        setTotalPages((prev) => ({
          ...prev,
          [currentCategory]: Math.ceil(data.count / ITEMS_PER_PAGE),
        }));
      } catch (err) {
        console.error("Failed to fetch media items:", err);
      }
    };

    fetchItems();
  }, [currentCategory, currentPage]);

  const setPageForCategory = useCallback((category: string, page: number) => {
    setCategoryPages((prev) => ({ ...prev, [category]: page }));
  }, []);

  const handleCategoryChange = useCallback(
    (category: string) => {
      setCurrentCategory(category);
      setPageForCategory(category, 1);
    },
    [setPageForCategory],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (currentCategory) setPageForCategory(currentCategory, page);
    },
    [currentCategory, setPageForCategory],
  );

  return (
    <>
      <TripsPage>
        <div className="w-full flex justify-between items-center flex-wrap px-4 pt-4">
          <GenreSelect
            options={categories}
            value={currentCategory}
            onValueChange={handleCategoryChange}
          />
          {currentCategory && totalPages[currentCategory] > 1 && (
            <PageScroller
              currentPage={currentPage}
              totalPages={totalPages[currentCategory]}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        {currentItems?.map((item) => (
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
    </>
  );
}
