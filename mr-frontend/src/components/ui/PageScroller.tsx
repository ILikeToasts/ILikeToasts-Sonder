import { Button } from "./Button";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

interface PageScrollerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PageScroller: React.FC<PageScrollerProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-4 pt-4">
      <Button
        variant="secondary"
        size="icon"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon />
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};
