import { useMemo } from "react";

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}): (number | string)[] => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    return [currentPage, "of", totalPageCount];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
