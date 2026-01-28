import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from ".";

const Pagination = ({
  page,
  totalPages,
  setPage,
  disabled,
}: PaginationProps) => {
  if (!page || !totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-4 px-6 border-t border-border/40">
      <div className="text-sm font-medium">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || disabled}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant="outline"
            size="sm"
            onClick={() => setPage(p)}
            disabled={disabled}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || disabled}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
