import React, { useEffect, useReducer } from "react";
import SectionTag from "../Buttons/SectionTag";
import SectionHeadText from "../Typography/SectionHeadText";
import Button from "../Buttons/Button";
import Productcard1 from "../ProductCard/Productcard1";
import {
  productReducer,
  initialProductState,
  useProductActions,
} from "../../Reducers/ProductReducer";

import { Swiper, SwiperSlide } from "swiper/react"; //this is the swiper imports
import "swiper/css"; //this is the swiper css

export default function Toppick() {
  const [state, dispatch] = useReducer(productReducer, initialProductState);
  const { fetchTopPickProducts } = useProductActions(dispatch); //usehook

  /**
   * Fetches and manages top pick products lifecycle
   *
   * @function useEffect
   * @description
   * - Automatically fetches top pick products when component mounts
   * - Manages loading and error states for product retrieval
   * - Provides retry mechanism for failed product fetches
   *
   * @workflow
   * 1. Calls fetchTopPickProducts on component mount
   * 2. Handles three possible states:
   *    - Loading: Displays loading message
   *    - Error: Shows error message with retry option
   *    - Success: Renders top pick products
   *
   * @state {Object} state - Reducer state containing:
   *  - loading.topPickProducts: Boolean indicating fetch in progress
   *  - error.topPickProducts: Error message if fetch fails
   *  - topPickProducts: Array of successfully fetched products
   *
   * @dependencies
   * - productReducer
   * - useProductActions hook
   *
   * @example
   * // Typical rendering flow
   * if (loading) return <LoadingSpinner />;
   * if (error) return <ErrorDisplay />;
   * return <ProductList products={topPickProducts} />;
   *
   * @example
   * // Possible error scenarios
   * - Network failure
   * - Backend service unavailable
   * - Invalid API response
   *
   * @returns {React.ReactElement}
   * Renders loading state, error state, or product list
   */
  // Fetch all products on component mount
  useEffect(() => {
    fetchTopPickProducts();
  }, []);

  /**
   * Conditional rendering for top pick products fetch state
   *
   * @description
   * Handles different states of product fetching:
   * - Loading state with informative message
   * - Error state with retry mechanism
   *
   * @state {Object} state.loading.topPickProducts
   * Indicates whether products are being fetched
   *
   * @state {Object} state.error.topPickProducts
   * Contains error message if product fetch fails
   *
   * @function fetchTopPickProducts
   * Retry mechanism to reload top pick products
   *
   * @returns {React.ReactElement}
   * Appropriate UI based on fetch state
   */
  // Conditional rendering based on loading and error states

  if (state.error.topPickProducts) {
    return (
      <div className="error-container">
        <p>Error loading Products: {state.error.topPickProducts}</p>
        <button onClick={() => fetchAllProducts()}>Try Again</button>
      </div>
    );
  }

  return (
    <section>
      <div className="w-fill h-max-[774px] items-center bg-white px-[16px] py-[80px] sm:px-[40px] lg:px-[150px] lg:py-[150px]">
        <div className="flex w-full flex-col gap-8 md:gap-[64px]">
          <div className="flex flex-col gap-6 md:gap-[24px]">
            <SectionTag text="About Us" />
            <SectionHeadText
              text1="Our Top"
              text2="Picks"
              stacked={false}
              bgColor="white"
            />{" "}
            {/*this copmonent is imported  */}
          </div>

          <div className="hidden grid-cols-3 gap-[12px] md:grid">
            {state.loading.topPickProducts
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="w-full animate-pulse">
                      <div className="relative aspect-square w-full bg-gray-300/60"></div>
                    </div>
                  ))
              : state.topPickProducts
                  .slice(0, 3)
                  .map((product) => (
                    <Productcard1
                      key={product.id}
                      product={product}
                      showDetails={false}
                    />
                  ))}
          </div>

          <div className="w-full md:hidden">
            <Swiper
              spaceBetween={12}
              slidesPerView={1.2}
              centeredSlides={false}
              className="mySwiper"
            >
              {state.loading.topPickProducts
                ? Array(3)
                    .fill(0)
                    .map((product, index) => (
                      <SwiperSlide key={index}>
                        <div key={index} className="w-full animate-pulse">
                          <div className="relative aspect-square w-full bg-gray-300/60"></div>
                        </div>
                      </SwiperSlide>
                    ))
                : state.topPickProducts.map((product, index) => (
                    <SwiperSlide key={index}>
                      <Productcard1 product={product} showDetails={false} />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
          {/* this is the button for the show more button imported from the button component */}
          <Button
            text="Show More"
            icon={true}
            variant="filledBlack"
            size="variable"
            display="flex"
          />
        </div>
      </div>
    </section>
  );
}
