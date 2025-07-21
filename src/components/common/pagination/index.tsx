import { usePagination } from "@/hooks/usePagination";
import LeftPageIcon from "@/assets/pagination/leftPage.svg?react";
import RightPageIcon from "@/assets/pagination/rightPage.svg?react";

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
  onPageSizeChange,
}: {
  onPageChange: (pageNumber: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
  onPageSizeChange: (pageSize: number) => void;
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  const pageSizeArray = [5, 10, 15, 20, 25];

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <div
      className={`flex items-center  justify-center flex-col md:flex-row gap-y-[16px]  md:justify-between ${className}`}
    >
      <div className="flex items-center gap-x-[16px]">
        <div className="flex items-center">
          <button
            className={`  flex md:hidden items-center bg-neutral-greys-800 px-[14px] py-[8px] rounded-[10px]  md:mr-[16px] ${
              currentPage === 1
                ? "pointer-events-none bg-neutral-greys-500 opacity-50"
                : " cursor-pointer"
            }`}
            onClick={onPrevious}
          >
            <LeftPageIcon className="h-[20px] w-[20px]" />
          </button>
          {pageSizeArray?.map((item, index) => {
            return (
              <button
                type="button"
                key={index}
                className={`h-[32px] w-[32px] md:flex items-center justify-center cursor-pointer transition-all ease-in-out duration-200 rounded-[6px] typo-b3-regular hidden ${
                  item === pageSize
                    ? "bg-neutral-greys-800 text-neutral-greys-100"
                    : "text-neutral-greys-500"
                }`}
                onClick={() => {
                  if (pageSize < item) {
                    onPageChange(Math.ceil((currentPage * pageSize) / item));
                  } else {
                    onPageChange(Math.ceil((currentPage * item) / pageSize));
                  }

                  onPageSizeChange(item);
                }}
              >
                {item}
              </button>
            );
          })}
          <button
            className={`  flex md:hidden items-center bg-neutral-greys-800 px-[14px] py-[8px] rounded-[10px] ml-[16px] ${
              currentPage === lastPage
                ? "pointer-events-none bg-neutral-greys-500 opacity-50"
                : "cursor-pointer"
            }`}
            onClick={onNext}
          >
            <RightPageIcon className="h-[20px] w-[20px]" />
          </button>
        </div>

        <p className=" hidden md:block text-neutral-greys-500 py-[11px] typo-b3-regular">
          Items per page
        </p>
      </div>
      <ul
        className={`hidden md:flex items-center gap-x-[16px]  typo-b3-regular`}
      >
        <li
          className={`  flex items-center bg-neutral-greys-800 px-[14px] py-[8px] rounded-[10px] ${
            currentPage === 1
              ? "pointer-events-none bg-neutral-greys-500 opacity-50"
              : " cursor-pointer"
          }`}
          onClick={onPrevious}
        >
          <LeftPageIcon className="h-[20px] w-[20px]" />
        </li>
        <li className="flex gap-x-[3px]">
          {paginationRange.map((pageNumber, index) => {
            return (
              <p
                key={index}
                className={`typo-b3-regular text-neutral-greys-500 `}
              >
                {pageNumber}
              </p>
            );
          })}
        </li>
        <li
          className={`  flex items-center bg-neutral-greys-800 px-[14px] py-[8px] rounded-[10px] ${
            currentPage === lastPage
              ? "pointer-events-none bg-neutral-greys-500 opacity-50"
              : "cursor-pointer"
          }`}
          onClick={onNext}
        >
          <RightPageIcon className="h-[20px] w-[20px]" />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
