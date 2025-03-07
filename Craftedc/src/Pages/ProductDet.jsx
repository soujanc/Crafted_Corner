import React from "react";
import { useReducer, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import SectionTag from "../components/Buttons/SectionTag";
import { toast, ToastContainer } from "react-toastify";
import {
  initialProductState,
  useProductActions,
  productReducer,
} from "../Reducers/ProductReducer";
import {
  kartReducer,
  initialKartState,
  useCratActions,
} from "../Reducers/KartReducer";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Button from "../components/Buttons/Button";
import Productcard1 from "../components/ProductCard/Productcard1";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../components/Bread/BreadCrumb";

export default function ProductDet() {
  const navigate = useNavigate();
  const [kartstate, kartdispatch] = useReducer(kartReducer, initialKartState);
  const { addToCart } = useCratActions(kartdispatch);

  const [quantity, setQuantity] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { id } = useParams();
  // This gets the 'id' from the route, which will be 'PROD005'

  const [state, dispatch] = useReducer(productReducer, initialProductState);
  const { fetchProductById } = useProductActions(dispatch);

  const [mainImage, setMainImage] = useState(null);
  const [loader, setLoader] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  // Add color state
  const [color, setColor] = useState(
    state.currentProduct?.colorStock?.[0] || "",
  );
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [id]);
  // Set images only when the product is loaded
  useEffect(() => {
    if (!state.loading.currentProduct && state.currentProduct?.images) {
      // Set the main image to the first image in the array
      setMainImage(state.currentProduct.images[0]);

      // Map product images to the format used for thumbnails
      setThumbnails(
        state.currentProduct.images.slice(0, 4).map((image) => ({
          src: image,
          alt: state.currentProduct.name,
        })),
      );
    }
  }, [state.loading.currentProduct, state.currentProduct]);

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };
  const breadcrumbItems = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "ProductDetails",
    },
    {
      label: "Checkout",
      link: "/checkout",
    },
  ];

  const categories = [
    {
      id: "1",
      name: "Materials",
      Details: state.currentProduct ? state.currentProduct.materialsUsed : [],
    },
    {
      id: "2",
      name: "Shiping details",
      Details:
        "Free standard shipping on orders over $50, processed within 1-3 business days. Tracking numbers are emailed upon shipment. Expedited options available at checkout.",
    },
    {
      id: "3",
      name: "Return policy",
      Details:
        "Returns accepted within 30 days for a full refund if items are in original condition. Contact customer service for a return shipping label. ",
    },
  ];
  const colorMap = {
    beige: "bg-[#F5F5DC]", // Soft beige color
    gray: "bg-gray-500", // Tailwind gray
    black: "bg-black", // Pure black
  };

  useEffect(() => {
    // Fetch product details only if an ID is present
    if (id) {
      const fetchProduct = async () => {
        await fetchProductById(id); // Fetch the product
      };

      fetchProduct(); // Call the async function
    }
  }, [id]);
  const handleColorSelect = (selectedColor) => {
    setColor(selectedColor);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    // Retrieve existing cart ID from localStorage
    const existingCartId = localStorage.getItem("cartId");

    try {
      const cartData = {
        productId: state.currentProduct.productId,
        quantity: quantity,
        color: color || "gray", // Use product color or default
        ...(existingCartId && { cartId: existingCartId }), // Conditionally add cartId if exists
      };

      // Add to cart
      const cartResult = await addToCart(cartData);

      if (cartResult && cartResult.cartId) {
        // Store new cart ID in localStorage
        localStorage.setItem("cartId", cartResult.cartId);

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

    //console.log("Cart Id:", cartResult.cartId);
  };

  return (
    <>
      {state.loading.currentProduct ? (
        <div className="w-full animate-pulse items-center bg-[#f9f9f9] px-[20px] py-[80px] font-inter lg:px-[200px] lg:py-[150px]">
          {/* Main Product Section */}
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Image Skeleton */}
            <div className="h-[500px] w-full rounded-lg bg-gray-300/60 md:w-1/2"></div>

            {/* Product Info Skeleton */}
            <div className="w-full space-y-4 md:w-1/2">
              <div className="h-8 w-3/4 rounded bg-gray-300/60"></div>
              <div className="h-4 w-1/2 rounded bg-gray-300/60"></div>

              {/* Price Skeleton */}
              <div className="h-10 w-1/3 rounded bg-gray-300/60"></div>

              {/* Color Options Skeleton */}
              <div className="flex space-x-2">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-6 rounded-full bg-gray-300/60"
                  ></div>
                ))}
              </div>

              {/* Button Skeletons */}
              <div className="flex space-x-4">
                <div className="h-10 w-1/2 rounded bg-gray-300/60"></div>
                <div className="h-10 w-1/2 rounded bg-gray-300/60"></div>
              </div>
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-12">
            <div className="mb-4 h-6 w-1/4 rounded bg-gray-300/60"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-48 rounded bg-gray-300/60"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-300/60"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-300/60"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : state.currentProduct ? (
        <div className="w-full items-center bg-[#f9f9f9] px-[20px] py-[80px] font-inter lg:px-[200px] lg:py-[150px]">
          <ToastContainer />
          <div>
            <BreadCrumb items={breadcrumbItems} />
            {/* Rest of your page content */}
          </div>

          <div className="mx-auto w-full">
            <div className="flex flex-col gap-8 md:flex-row md:gap-14">
              {/* Product Images */}
              <div className="mb-8 w-full md:w-1/2">
                <img
                  src={mainImage}
                  alt="Product"
                  className="mb-2 h-[400px] w-full bg-[#f4f4f4] object-cover object-center lg:h-[350px] lg:min-h-[500px]"
                />
                <div className="grid w-full grid-cols-4 gap-2">
                  {thumbnails.map((thumb, index) => (
                    <div
                      key={index}
                      className={`aspect-square cursor-pointer border-2 ${
                        mainImage === thumb.src ? "opacity-100" : "opacity-60"
                      }`}
                      onClick={() => setMainImage(thumb.src)}
                    >
                      <img
                        src={thumb.src}
                        alt={thumb.alt}
                        className="h-full w-full bg-gray-200 object-cover transition duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex w-full flex-col space-y-4 font-inter md:w-1/2">
                <SectionTag text={state.currentProduct.roomType} />

                <p className="max-w-[371px] font-inter text-[20px] font-[500] leading-[32px] tracking-[0.48px] text-gray-800 md:text-[28px] md:leading-[36px] lg:text-[32px] lg:leading-[40px]">
                  {state.currentProduct.name}
                </p>

                <p className="font-inter text-[12px] font-light leading-none tracking-wide text-gray-500 md:text-[14px]">
                  {state.currentProduct.category}
                </p>
                <div className="h-[1px] w-full bg-gray-200"></div>

                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      key={index}
                      viewBox="0 0 24 24"
                      fill="#FFCB45"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.0086 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>

                {/* Light divider line */}
                <div className="h-fit">
                  <span className="mr-2 block font-inter text-[16px] font-[500] leading-none text-[#373A38] md:text-[20px] lg:text-[24px] lg:tracking-wide">
                    ${state.currentProduct.price}
                  </span>
                </div>

                {/* Star Rating */}

                {/* Color Selection */}
                <div className="">
                  <h3 className="mb-3 font-inter text-[11px] font-normal tracking-normal text-gray-700 md:text-[12px]">
                    choose color :
                  </h3>
                  <div className="flex space-x-2">
                    {state.currentProduct.colorStock.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorSelect(color)}
                        className={`h-6 w-6 ${colorMap[color]} rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        title={color} // Add a tooltip for accessibility
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="">
                  <label
                    htmlFor="quantity"
                    className="mb-3 block font-inter text-[11px] font-normal tracking-normal text-gray-700 md:text-[12px]"
                  >
                    quantity:
                  </label>

                  <div className="flex w-fit items-center rounded border border-gray-200">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="flex h-6 w-6 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:opacity-75"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      id="Quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="h-6 w-8 border-transparent text-center text-sm [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="flex h-6 w-6 items-center justify-center text-gray-700 transition hover:bg-gray-100 hover:opacity-75"
                    >
                      +
                    </button>
                  </div>
                </div>
                <TabGroup
                  selectedIndex={selectedIndex}
                  onChange={setSelectedIndex}
                >
                  <TabList className="relative flex w-fit gap-4 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gray-200 after:content-['']">
                    {categories.map(({ name }) => (
                      <Tab
                        key={name}
                        className={({ selected }) =>
                          `z-10 cursor-pointer px-1 py-1 font-inter text-[11px] font-light tracking-[0.48px] text-[#818181] outline-none lg:text-xs ${selected ? "text-black" : "hover:text-black"} relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:transform after:bg-[#818181] after:transition-transform after:duration-300 after:content-[''] ${selected ? "after:scale-x-100" : "after:scale-x-0"} `
                        }
                      >
                        {name}
                      </Tab>
                    ))}
                  </TabList>
                  <TabPanels className="mt-4 min-h-[120px]">
                    {categories.map((category) => (
                      <TabPanel key={category.id}>
                        <div className="text-gray-600">
                          <div key={category.id} className="mb-3">
                            <p className="max-w-[464px] font-inter text-[11px] font-light normal-case leading-[20px] tracking-[0.24px] text-gray-700 lg:text-[12px]">
                              {category.Details}
                            </p>
                          </div>
                        </div>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </TabGroup>

                {/* Action Buttons */}
                <div className="mt-2 flex w-1/2 gap-5 pr-2 lg:gap-6">
                  <Button
                    text="Add to Cart"
                    onClick={handleAddToCart}
                    size="compact"
                    variant="filledBlackNoHover"
                    className="w-1/2"
                    loading={kartstate.loading}
                  />
                  <Button
                    onClick={() => {
                      navigate(
                        `/checkout/${state.currentProduct.productId}?color=${color}&quantity=${quantity}`,
                      );
                    }}
                    text="Buy Now"
                    size="compact"
                    variant="outlinedBlack"
                    className="w-1/2"
                  />
                </div>

                {/* Key Features */}
              </div>
            </div>
          </div>
          <div className="mt-10 w-full">
            <h2 className="mb-4 font-inter text-[12px] font-[400] tracking-wide text-[#373A38]">
              Customers Also Purchase
            </h2>
            <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3 lg:grid-cols-3">
              {state.relatedProducts.slice(0, 3).map((product, index) => (
                <Productcard1 key={product._id || index} product={product} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>No product found</div>
      )}
    </>
  );
}
