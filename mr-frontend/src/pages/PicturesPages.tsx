import { GenreSelect } from "@/components/Album/GenreSelect";
import Masonry, { type Item } from "@/components/ui/Masonry";
import { PageScroller } from "@/components/ui/PageScroller";
import { MasonryContainer } from "@/styles/Pictures/Pictures.styles";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 17;

export default function Pictures() {
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>(
    {},
  );
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});
  const [totalPages, setTotalPages] = useState<Record<string, number>>({});

  const currentPage = currentCategory ? categoryPages[currentCategory] || 1 : 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/media-items/categories/",
        );
        const data: string[] = await response.json();
        setCategories(data);
        setCurrentCategory(data[0] || null);
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
          `http://127.0.0.1:8000/api/media-items/?${params}`,
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

  const setPageForCategory = (category: string, page: number) => {
    setCategoryPages((prev) => ({ ...prev, [category]: page }));
  };

  return (
    <>
      <div className="space-y-4">
        <div className="w-full flex justify-between items-center flex-wrap px-4 pt-4">
          <GenreSelect
            options={categories}
            value={currentCategory}
            onValueChange={(category) => {
              setCurrentCategory(category);
              setPageForCategory(category, 1);
            }}
          />
          {currentCategory && totalPages[currentCategory] > 1 && (
            <PageScroller
              currentPage={currentPage}
              totalPages={totalPages[currentCategory]}
              onPageChange={(page) => setPageForCategory(currentCategory, page)}
            />
          )}
        </div>
        <MasonryContainer>
          <Masonry
            items={groupedItems[currentCategory] || []}
            ease="power3.out"
            duration={1}
            stagger={0.05}
            animateFrom="random"
            scaleOnHover
            hoverScale={0.95}
            blurToFocus
            colorShiftOnHover={false}
          />
        </MasonryContainer>
      </div>
    </>
  );
}
