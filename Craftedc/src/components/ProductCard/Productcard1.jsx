import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import React, { useReducer, useState, useEffect } from "react";
import { authReducer, userAuthActions } from "../../Reducers/AuthReducer";

import {
  kartReducer,
  initialKartState,
  useCratActions,
} from "../../Reducers/KartReducer";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * ProductCard1 Component
 *
 * Renders a product card with customizable display options and interactions
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} [props.product=defaultProduct] - Product details to display
 * @param {string} props.product.id - Unique product identifier
 * @param {string} props.product.name - Product name
 * @param {string} props.product.category - Product category
 * @param {number} props.product.price - Product price
 * @param {string} props.product.description - Product description
 * @param {string[]} props.product.images - Array of product image URLs
 * @param {number} [props.product.quantity=1] - Product quantity
 * @param {string} props.product.color - Product color
 * @param {Object} props.product.dimensions - Product dimensions
 * @param {string} props.product.weight - Product weight
 * @param {string} props.product.material - Product material
 * @param {string} props.product.sku - Product SKU
 * @param {boolean} props.product.inStock - Product availability
 * @param {string[]} props.product.tags - Product tags
 * @param {string} props.product.roomType - Room type for the product
 *
 * @param {boolean} [props.showDetails=false] - Flag to show additional product details
 * @param {Function} [props.onClick=defaultClickHandler] - Click event handler
 *
 * @returns {React.ReactElement} Rendered product card
 *
 * @example
 * // Basic usage
 * <Productcard1 product={myProduct} />
 *
 * @example
 * // With additional details
 * <Productcard1
 *   product={myProduct}
 *   showDetails={true}
 *   onClick={handleProductClick}
 * />
 */

export default function Productcard1({
  product = {
    dimensions: {
      height: "110 cm",
      width: "65 cm",
      depth: "60 cm",
    },
    relatedProducts: [],
    _id: "678dccede62d1afdce975ded",
    productId: "IXCHAIR22350",
    name: "Ergonomic Office Chair",
    category: "Office Chair",
    roomType: "Office",
    tags: "Popular",
    price: 299.99,
    quantity: 50,
    color: "Black",
    images: [
      "../public/Images/product1.jpg",
      "../public/Images/product1.jpg",
      "../public/Images/product1.jpg",
      "../public/Images/product1.jpg",
      "../public/Images/product1.jpg",
    ],
    weight: "15 kg",
    material: "Leather and Steel",
    materialsUsed:
      "Premium, high-quality leather upholstery, meticulously crafted for exceptional comfort and durability, complemented by rich walnut wood accents that add a touch of sophistication and timeless elegance. This perfect fusion of luxury materials creates a stunning, durable piece that enhances any interior with a classic yet contemporary style.",
    sku: "OFFCH-001-BLK",
    inStock: true,
    createdAt: "2025-01-20T04:11:25.684Z",
    updatedAt: "2025-01-23T02:37:26.251Z",
    __v: 0,
    colorStock: ["beige", "gray", "black"],
  },
  showDetails = false,
  loading = false,
}) {
  const [Authstate, Authdispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  const [currentUser, setcurrentUser] = useState([]);
  const [guestId, setGuestId] = useState(null);
  const { fetchCurrentUser } = userAuthActions(Authdispatch);
  const [state, dispatch] = useReducer(kartReducer, initialKartState);
  const { addToCart } = useCratActions(dispatch);
  const Navigate = useNavigate();
  // const { addToCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = () => {
    Navigate(`/productdetails/${product.productId}`);
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      const response = await fetchCurrentUser();
      if (response?.user) {
        setcurrentUser(response.user);
        console.log("Fetched Current User:", response.user);
      } else {
        // Check localStorage for an existing guestId
        let storedGuestId = localStorage.getItem("guestId");

        if (!storedGuestId) {
          // Generate and store guestId only if it doesn't exist
          storedGuestId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          localStorage.setItem("guestId", storedGuestId);
        }

        setGuestId(storedGuestId);
        console.log("Using Guest ID:", storedGuestId);
      }
    };

    if (!Authstate.isAuthenticated) {
      loadCurrentUser();
    }
  }, []);
  useEffect(() => {
    console.log("current user", currentUser);
  }, []);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    let cartData; // Declare cartData outside of the if-else blocks

    try {
      if (currentUser && currentUser._id) {
        cartData = {
          productId: product.productId,
          quantity: 1,
          color: product.color || "gray", // Use product color or default
          userId: currentUser._id,
          guestId: null, // Set guestId to null for authenticated users
        };
      } else {
        cartData = {
          productId: product.productId,
          quantity: 1,
          color: product.color || "gray",
          userId: null, // Use product color or default
          guestId: guestId, // Use guestId if available
        };
      }

      // Add to cart
      console.log("Cart Data:", cartData);
      const cartResult = await addToCart(cartData);

      if (cartResult) {
        // Show success state
        setIsSuccess(true);

        // Reset to default after 2 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);

        // Optional: Show success toast
        toast.success("Item added to cart!", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Add to Cart Error:", error);
      toast.error("Failed to add item to cart", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  // Render cart button with different states
  const renderCartButton = () => {
    if (state.loading) {
      return (
        <div
          className="inline-block h-[16px] w-[16px] animate-spin rounded-full border border-current border-t-transparent"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <svg
          width="16px"
          height="16px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13L9 17L19 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      );
    }

    // Default cart icon
    return (
      <svg
        width="16px"
        height="16px"
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
    );
  };

  // If loading is true, render skeleton
  if (loading) {
    return (
      <div className="w-full animate-pulse">
        <div className="relative aspect-square w-full bg-gray-300/60"></div>
        {/* Skeleton details */}
      </div>
    );
  }
  return (
    <div className="w-full cursor-pointer" onClick={handleClick}>
      <ToastContainer />
      {/* Product image placeholder with hover effect */}
      <div
        className={`relative aspect-square w-full overflow-hidden bg-[#f4f4f4] transition-colors duration-500 hover:bg-[#dadada]`}
      >
        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0]
              : product.images || "/path/to/fallback/image.jpg"
          }
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 hover:scale-105"
          onError={(e) => {
            e.target.src = "/path/to/fallback/image.jpg"; // Fallback image
            e.target.onerror = null; // Prevent infinite loop
          }}
        />
        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={state.loading || isSuccess}
          className="absolute right-2 top-2 z-10 flex transform items-center justify-center rounded-full p-2 text-gray-600 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-200"
        >
          {renderCartButton()}
        </button>

        {/* Conditional rendering of product details inside the aspect-square */}
        {showDetails && (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
            <div className="flex justify-between">
              {/* Product name with truncation for overflow */}
              <p className="flex-1 truncate font-inter text-[10px] font-light leading-[14px] tracking-wide text-[#4d4d4d] lg:text-[11px]">
                {product.name}
              </p>
              {/* Price with nowrap to prevent breaking */}
              <p className="ml-2 whitespace-nowrap font-inter text-[10px] font-light leading-[14px] tracking-wider text-[#4d4d4d] lg:text-[11px]">
                ${product.price}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Product details container - shown only when showDetails is false */}
      {!showDetails && (
        <div className="mt-[8px] flex justify-between">
          {/* Product name with truncation for overflow */}
          <p className="flex-1 truncate font-inter text-[10px] font-light leading-[10px] tracking-[0.48px] text-[#4d4d4d] md:leading-[14px] lg:text-[11px]">
            {product.name}
          </p>
          {/* Price with nowrap to prevent breaking */}
          <p className="ml-2 whitespace-nowrap font-inter text-[10px] font-normal leading-[14px] text-[#939393] lg:text-[11px]">
            ${product.price}
          </p>
        </div>
      )}
    </div>
  );
}
