// Import necessary dependencies
import React, { useState, useMemo, useEffect, useReducer } from "react";

import ScetionColorTag from "../components/Buttons/ScetionColorTag";
import Button from "../components/Buttons/Button";
import BreadCrumb from "../components/Bread/BreadCrumb";
import ImageModal from "../components/Modal/ImageModal";
import { useNavigate } from "react-router-dom";
import { authReducer, userAuthActions } from "../Reducers/AuthReducer";

import {
  kartReducer,
  initialKartState,
  useCratActions,
} from "../Reducers/KartReducer";
// Import icons from react-icons library

export default function CartPage() {
  const [Authstate, Authdispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  const { fetchCurrentUser } = userAuthActions(Authdispatch);
  const [currentUser, setcurrentUser] = useState([]);
  const [guestId, setGuestId] = useState(null);

  const [kartstate, kartdispatch] = useReducer(kartReducer, initialKartState);
  const { getCart, updateCartItemQuantity, deleteCartItem } =
    useCratActions(kartdispatch);
  // Define navigation breadcrumb structure
  const breadcrumbItems = [{ label: "Home", link: "/" }, { label: "Cart" }];

  // Update calculateTotal to use cart instead of state.cart
  const calculateTotal = useMemo(() => {
    if (!kartstate.loading && kartstate.cart !== null) {
      const subtotal = kartstate.cart.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      return { subtotal, total: subtotal };
    }
  }, [kartstate]);
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

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!currentUser && !guestId) return; // Ensure we have valid userId or guestId

        await getCart({ userId: currentUser?._id, guestId });
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        toast.error("Unable to retrieve cart items", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };

    // Call the fetch function
    fetchCartItems();
  }, [currentUser, guestId]); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (!kartstate.loading && kartstate.cart !== null) {
      console.log("treducer cart the cart", kartstate.cart.products);
    }
  }, [kartstate]);
  // Update totalItems to use cart instead of state.cart

  // State for image modal functionality
  const [selectedImage, setSelectedImage] = useState(null);
  // Navigation hook for routing
  const navigate = useNavigate();

  const CartPageSkeleton = () => (
    <div className="flex w-full animate-pulse flex-col gap-6 md:flex-row md:gap-6">
      {/* Cart Items Section Skeleton */}
      <div className="md:w-[65%] lg:w-[70%]">
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center space-x-4 rounded-md bg-gray-100 p-4"
            >
              {/* Image Skeleton */}
              <div className="h-24 w-24 rounded bg-gray-300"></div>

              {/* Details Skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                <div className="h-3 w-1/2 rounded bg-gray-300"></div>
                <div className="h-3 w-1/3 rounded bg-gray-300"></div>
              </div>

              {/* Actions Skeleton */}
              <div className="space-x-2">
                <div className="inline-block h-8 w-20 rounded bg-gray-300"></div>
                <div className="inline-block h-8 w-20 rounded bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Skeleton */}
      <div className="md:w-[35%] lg:w-[30%]">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {/* Title Skeleton */}
          <div className="mb-6 h-6 w-1/2 rounded bg-gray-300"></div>

          {/* Product List Skeleton */}
          <div className="mb-4 space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded bg-gray-300"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Details Skeleton */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-1/3 rounded bg-gray-300"></div>
              <div className="h-4 w-1/4 rounded bg-gray-300"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-1/3 rounded bg-gray-300"></div>
              <div className="h-4 w-1/4 rounded bg-gray-300"></div>
            </div>

            {/* Total Skeleton */}
            <div className="mt-4 flex justify-between">
              <div className="h-5 w-1/3 rounded bg-gray-300"></div>
              <div className="h-5 w-1/4 rounded bg-gray-300"></div>
            </div>
          </div>

          {/* Promo Code Skeleton */}
          <div className="mt-4 flex space-x-2">
            <div className="h-10 w-3/4 rounded bg-gray-300"></div>
            <div className="h-10 w-1/4 rounded bg-gray-300"></div>
          </div>

          {/* Checkout Button Skeleton */}
          <div className="mt-4">
            <div className="h-12 w-full rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#f9f9f9] px-[20px] py-[80px] font-inter lg:px-[250px] lg:py-[150px]">
      <h3 className="mb-6 mt-2 text-[18px] font-medium leading-none tracking-tight text-[#4D4D4D] lg:text-[20px]">
        My Cart
      </h3>
      <BreadCrumb items={breadcrumbItems} />

      {/* Flex container for cart items and order summary */}
      {kartstate.loading ? (
        <CartPageSkeleton />
      ) : kartstate.cart !== null ? (
        <div className="flex w-full flex-col gap-6 transition-all duration-300 ease-in-out md:flex-row md:gap-6">
          {/* Cart Items Section */}
          <div className="max-h-[800px] overflow-y-auto rounded-lg scrollbar-hide md:w-[65%] lg:w-[70%]">
            {/* Show message if cart is empty, otherwise show items */}
            {kartstate.cart.products.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-16 text-center transition-all duration-300 ease-in-out">
                <div className="mb-4 animate-bounce">
                  <svg
                    className="h-8 w-8"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#000000"
                  >
                    <path
                      d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
                      stroke="#9CA3AF"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M11.5 15.5C11.5 15.5 13 13.5 16 13.5C19 13.5 20.5 15.5 20.5 15.5"
                      stroke="#9CA3AF"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M3 4C3 1.24586 7 1.2458 7 3.99993C7 5.96716 5 5.63927 5 7.99994"
                      stroke="#9CA3AF"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M5 11.01L5.01 10.9989"
                      stroke="#9CA3AF"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M17.5 9C17.2239 9 17 8.77614 17 8.5C17 8.22386 17.2239 8 17.5 8C17.7761 8 18 8.22386 18 8.5C18 8.77614 17.7761 9 17.5 9Z"
                      fill="black"
                      stroke="#9CA3AF"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M10.5 9C10.2239 9 10 8.77614 10 8.5C10 8.22386 10.2239 8 10.5 8C10.7761 8 11 8.22386 11 8.5C11 8.77614 10.7761 9 10.5 9Z"
                      fill="black"
                      stroke="#9CA3AF"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>

                <h2 className="mb-3 font-poppins text-[12px] font-medium tracking-[0.28px] text-[#4D4D4D] lg:text-[14px]">
                  Your cart is Empty
                </h2>

                <p className="mb-5 max-w-md font-poppins text-[10px] font-light leading-relaxed tracking-[0.28px] text-[#818181] md:text-[12x] lg:text-[12px]">
                  Looks like you haven't added any items to your cart yet. Let's
                  find something amazing for you!
                </p>
                <Button
                  text="Start Shopping"
                  variant="filledBlack"
                  size="compact"
                  onClick={() => {
                    navigate("/");
                  }}
                />
              </div>
            ) : (
              <div className="h-fit space-y-6 overflow-y-auto rounded-[10px] scrollbar-thin md:max-h-[calc(100vh-260px)]">
                {/* Map through cart items and render each item */}
                {kartstate.cart.products.map((item) => {
                  console.log("Rendering cart item:", item);
                  return (
                    <div
                      key={item.productId}
                      className="items-top relative flex max-h-[144px] w-full flex-col justify-between gap-2 rounded-md border border-gray-200 bg-white p-3 transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-[0_4px_10px_rgba(0,0,0,0.05)] active:scale-[0.99] sm:flex-row md:min-w-[400px]"
                    >
                      {/* Item image with fallback on error */}
                      <div className="flex gap-4 md:gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0">
                          <img
                            src={item.images[3]}
                            alt={item.name}
                            className="absolute inset-0 h-full w-full cursor-pointer rounded-[4px] object-cover"
                            onClick={() => {
                              console.log("Selected image URL:", item.image);
                              setSelectedImage(item.image);
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e";
                            }}
                          />
                        </div>{" "}
                        <div className="absolute bottom-3 right-4 flex h-fit items-center justify-center gap-4 text-gray-500 transition-colors duration-300 md:right-6 md:gap-2">
                          <button
                            onClick={() => {
                              // Navigate to checkout with this specific item
                              navigate(`/productdetails/${item.productId}`, {
                                state: {
                                  items: [item],
                                  buyNow: true,
                                },
                              });
                            }}
                            className="flex items-center gap-1 rounded-md px-0 py-1 text-[10px] font-medium tracking-wide text-gray-500 transition-colors md:px-2 md:hover:bg-orange-50 md:hover:text-orange-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-3 w-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                              />
                            </svg>
                            Buy Now
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                const cartId = localStorage.getItem("cartId");
                                await deleteCartItem({
                                  cartId: cartId,
                                  productId: item.productId,
                                  color: item.color,
                                });
                              } catch (error) {
                                console.error(
                                  "Failed to delete cart item:",
                                  error,
                                );
                                // Optionally show a toast or error message to the user
                                toast.error("Could not remove item from cart");
                              }
                            }}
                            className="flex items-center gap-1 rounded-md px-0 py-0 text-[10px] font-medium text-gray-500 transition-colors md:px-2 md:py-1 md:hover:bg-red-50 md:hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-3 w-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                        {/* Item details */}
                        <div className="flex flex-col justify-start space-y-2 md:justify-normal">
                          <h3 className="font-inter text-[12px] font-light leading-none tracking-normal text-gray-700 md:font-normal lg:text-[13px]">
                            {item.name}

                            <span
                              className={`ml-2 text-[10px] font-normal leading-none tracking-normal ${
                                item.inStock ? "" : "text-red-500"
                              }`}
                            >
                              {item.inStock ? "" : "Out of Stock"}
                            </span>
                          </h3>

                          <p className="text-[10px] font-normal leading-none tracking-wide text-gray-500 lg:text-[11px]">
                            {item.category}
                          </p>
                          <p className="text-[10px] font-normal leading-none tracking-wide text-gray-500 lg:text-[11px]">
                            Diemensions : {item.dimensions.height} ×{" "}
                            {item.dimensions.width} × {item.dimensions.depth}{" "}
                          </p>
                          <p className="text-[10px] font-normal leading-none tracking-wide text-gray-500 lg:text-[11px]">
                            Weight : {item.weight}
                          </p>
                        </div>
                        <div className="absolute right-4 top-3 text-right md:hidden">
                          <p className="font-inter text-[12px] font-normal leading-none tracking-wide text-[#4d4d4d]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="hidden justify-between gap-6 px-4 md:flex lg:gap-10">
                        <ScetionColorTag
                          text={item.color}
                          color={`${item.color}`}
                        />

                        <div className="flex h-fit items-center gap-4">
                          <div className="flex w-fit items-center rounded border border-gray-200">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const cartId = localStorage.getItem("cartId");
                                  await updateCartItemQuantity({
                                    cartId: cartId,
                                    productId: item.productId,
                                    color: item.color,
                                    action: "decrease",
                                  });
                                } catch (error) {
                                  console.error(
                                    "Failed to increase item quantity:",
                                    error,
                                  );
                                  toast.error("Could not update item quantity");
                                }
                              }}
                              className="flex h-5 w-5 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:opacity-75"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              id="Quantity"
                              value={item.quantity}
                              min="1"
                              className="h-5 w-5 border-transparent text-center text-[12px] [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                            />

                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const cartId = localStorage.getItem("cartId");
                                  await updateCartItemQuantity({
                                    cartId: cartId,
                                    productId: item.productId,
                                    color: item.color,
                                    action: "increase",
                                  });
                                } catch (error) {
                                  console.error(
                                    "Failed to increase item quantity:",
                                    error,
                                  );
                                  toast.error("Could not update item quantity");
                                }
                              }}
                              className="flex h-5 w-5 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:opacity-75"
                            >
                              +
                            </button>
                          </div>
                          {/* Remove item button */}
                        </div>
                        <div className="text-right">
                          <p className="font-inter text-[12px] font-normal tracking-tight text-[#4D4D4D]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {/* Item total price */}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="md:w-[35%] lg:w-[30%]">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-[14px] font-medium text-[#4D4D4D]">
                Order Summary
              </h2>

              {/* Detailed Product List */}
              <div className="mb-4 space-y-4">
                {kartstate.cart.products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 border-b border-gray-100 pb-3 last:border-b-0"
                  >
                    <div className="relative h-16 w-16">
                      <img
                        src={item.images[3]}
                        alt={item.name}
                        className="h-full w-full rounded-md object-cover"
                      />
                      {item.quantity > 1 && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                          x{item.quantity}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-[12px] font-normal tracking-normal text-gray-700">
                            {item.name}
                          </h3>
                          <p className="text-[10px] text-gray-500">
                            {item.color}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {item.dimensions.height} × {item.dimensions.width} ×{" "}
                            {item.dimensions.depth}
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-gray-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[12px] text-gray-500">Subtotal</span>
                  <span className="text-[12px] font-medium text-[#4d4d4d]">
                    ${calculateTotal.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="my-2 border-t border-gray-200 tracking-[0.48px]"></div>
                <div className="my-1 flex justify-between">
                  <span className="text-[14px] font-medium text-[#4d4d4d]">
                    Total
                  </span>
                  <span className="text-[14px] font-medium text-gray-800">
                    ${calculateTotal.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* User Agreements and Instructions */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="termsAgreement"
                    className="mr-2 h-3 w-3 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="termsAgreement"
                    className="cursor-pointer text-[10px] text-gray-600 hover:text-gray-800"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletterConsent"
                    className="mr-2 h-3 w-3 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="newsletterConsent"
                    className="cursor-pointer text-[10px] text-gray-600 hover:text-gray-800"
                  >
                    I would like to receive promotional emails and updates
                  </label>
                </div>
                <p className="text-[9px] text-gray-400">
                  * Please ensure all entered information is accurate.
                  Double-check shipping address and payment details before
                  placing the order.
                </p>
              </div>

              {/* Checkout Button */}
              <Button
                text="Proceed to Checkout"
                variant="filledBlack"
                size="default"
                className="mt-4 w-full"
                fullWidth="true"
                onClick={() => {
                  navigate(`/checkout`, {
                    state: {
                      source: "cart", // Indicates the origin of navigation
                    },
                  });

                  // Implement order placement logic
                }}
              />
            </div>
          </div>

          {/* Promo Code Section */}
        </div>
      ) : // Existing empty cart message
      null}

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
