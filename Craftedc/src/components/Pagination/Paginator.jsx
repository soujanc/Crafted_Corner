export default function Paginator({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-4">
      <div className="flex w-full items-center justify-between border-gray-200">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex cursor-pointer items-center text-gray-700 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-600"
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            strokeWidth={1}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.1665 4L4.49984 7.33333"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.1665 4.00002L4.49984 0.666687"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="ml-2 text-[10px] font-light leading-none md:text-[12px] lg:ml-3">
            Previous
          </p>
        </button>

        {/* Mobile Page Indicator */}
        <span className="text-[10px] text-gray-500 sm:hidden">
          Page {currentPage} of {totalPages}
        </span>

        {/* Page Numbers */}
        <div className="hidden sm:flex">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`mr-2 cursor-pointer rounded-md px-3 py-2 text-[10px] font-medium leading-none md:text-[12px] ${
                currentPage === index + 1
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex cursor-pointer items-center font-inter font-normal text-gray-700 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-gray-600"
        >
          <p className="mr-2 text-[10px] font-light leading-none md:text-[12px] lg:mr-3">
            Next
          </p>
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            strokeWidth={1}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 7.33333L12.8333 4"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 0.666687L12.8333 4.00002"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
