import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ page, totalPages, total, limit, onPageChange, className = '' }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | '...')[] = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = ((page - 1) * (limit || 10)) + 1;
  const endItem = Math.min(page * (limit || 10), total || 0);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 ${className}`}>
      {total && limit && (
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {total} entries
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {getVisiblePages().map((pageNum, index) =>
          pageNum === '...' ? (
            <span key={`dots-${index}`} className="px-3 py-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={pageNum}
              variant={page === pageNum ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNum as number)}
              className="min-w-[40px]"
            >
              {pageNum}
            </Button>
          )
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
