import React from "react";
import { useCart } from "../../Context/CartContext";

export default function Shopproductcard({
  // Default props in case values aren't provided
  productName = "Product Name",
  productDescription = "Product Description",
  price = "99.99",
  showDetails = false,
}) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1,
    });
  };
  return (
    <div className="w-full">
      {/* Product image placeholder with hover effect */}
      <div
        className={`relative aspect-square w-full bg-white transition-colors duration-500 hover:bg-[#dadada]`}
      >
        <button
          onClick={handleAddToCart}
          className="absolute right-2 top-2 z-10 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <svg
            width="16"
            height="16"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5 22C20.3284 22 21 21.3284 21 20.5C21 19.6716 20.3284 19 19.5 19C18.6716 19 18 19.6716 18 20.5C18 21.3284 18.6716 22 19.5 22Z"
              fill="#000000"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M9.5 22C10.3284 22 11 21.3284 11 20.5C11 19.6716 10.3284 19 9.5 19C8.67157 19 8 19.6716 8 20.5C8 21.3284 8.67157 22 9.5 22Z"
              fill="#000000"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M5 4H22L20 15H7L5 4ZM5 4C4.83333 3.33333 4 2 2 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M20 15H7H5.23077C3.44646 15 2.5 15.7812 2.5 17C2.5 18.2188 3.44646 19 5.23077 19H19.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        {/* Conditional rendering of product details inside the aspect-square */}
        {showDetails && (
          <div className="absolute bottom-0 left-0 right-0 px-2 md:px-4 py-2">
            <div className="flex justify-between">
              {/* Product name with truncation for overflow */}
              <div className="flex flex-col gap-1">
                <p className="flex-1 truncate font-poppins text-[10px] font-normal leading-snug md:leading-normal tracking-wide text-[#4d4d4d] lg:text-[12px]">
                  {productName}
                </p>
                <p className="flex-1 truncate font-poppins text-[10px] font-light leading-snug tracking-wide text-[#9e9e9e] lg:text-[11px]">
                  {productDescription}
                </p>
              </div>
              {/* Price with nowrap to prevent breaking */}
              <p className="ml-2 whitespace-nowrap font-poppins text-[10px] font-light leading-snug md:leading-normal tracking-wide text-gray-600 lg:text-[12px]">
                ${price}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Product details container - shown only when showDetails is false */}
      {!showDetails && (
        <div className="mt-[8px] flex justify-between">
          {/* Product name with truncation for overflow */}
          <div className="flex flex-col">
            <p className="flex-1 truncate font-poppins text-[11px] font-medium leading-[14px] tracking-[0.58px] text-[#4d4d4d] lg:text-[12px]">
              {productName}
            </p>
            <p className="flex-1 truncate font-poppins text-[10px] font-light leading-[12px] tracking-[0.34px] text-[#9e9e9e] lg:text-[11px]">
              {productDescription}
            </p>
          </div>
          {/* Price with nowrap to prevent breaking */}
          <p className="ml-2 whitespace-nowrap font-poppins text-[8px] font-light leading-[14px] tracking-[0.48px] text-[#818181] lg:text-[11px]">
            ${price}
          </p>
        </div>
      )}
    </div>
  );
}
