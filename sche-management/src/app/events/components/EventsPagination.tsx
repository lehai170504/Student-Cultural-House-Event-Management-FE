import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  isLastPage: boolean;
  loadingList: boolean;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
}

export default function EventsPagination({
  currentPage,
  totalPages,
  isLastPage,
  loadingList,
  onPageChange,
  getPageNumbers,
}: EventsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={
                currentPage === 0 || loadingList
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>

          {getPageNumbers().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className={
                  loadingList
                    ? "pointer-events-none opacity-50"
                    : "transition transform hover:scale-105"
                }
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={
                isLastPage || loadingList
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

