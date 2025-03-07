import React from "react";
import { useState, useReducer, useEffect } from "react";
import SectionTag from "../Buttons/SectionTag";
import SectionHeadText from "../Typography/SectionHeadText";
import Button from "../Buttons/Button";
import Shopproductcard from "../ProductCard/Shopproductcard";
import Productcard1 from "../ProductCard/Productcard1";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import {
  productReducer,
  initialProductState,
  useProductActions,
} from "../../Reducers/ProductReducer";

export default function Shop() {
  const [state, dispatch] = useReducer(productReducer, initialProductState);
  const { fetchAllProducts } = useProductActions(dispatch); //usehook
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchAllProducts();
    console.log("this is all products", state.allProducts);
  }, []);

  const categories = [
    { name: "Popular", type: "Popular" },
    { name: "Trending", type: "Trending" },
    { name: "New Arrivals", type: "New Arrivals" },
  ];
  // This function filters the products based on the selected category
  // If the selected category is 0 (popular), it will return all products
  // If the selected category is 1 (trending), it will return all trending products
  // If the selected category is 2 (recent), it will return all recent products
  const filteredProducts = state.allProducts.filter(
    (product) => product.tags === categories[selectedIndex].type,
  );
  return (
    <section>
      <div className="w-fill h-max-[784px] items-center justify-center bg-[#f5f5f5] px-[16px] py-[80px] sm:px-[40px] lg:px-[150px] lg:py-[150px]">
        <div className="flex w-full flex-col gap-8 md:gap-[64px]">
          <div className="flex flex-col items-center justify-center gap-6 md:gap-[24px]">
            <SectionTag text="Shop" />
            <SectionHeadText
              text1="Discover"
              text2="our Collection"
              stacked={false}
            />
          </div>
          <div className="flex w-full justify-center">
            <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
              {/* 
                This is a TabGroup component from headlessui.com
                It takes in a selectedIndex and an onChange function
                The selectedIndex is used to determine which tab is currently active
                The onChange function is called when the user selects a different tab
                The function will be passed the index of the newly selected tab
                The TabList component is used to render the tabs
                The Tab component is used to render each individual tab
                The classnames used are from tailwindcss.com
              */}
              <TabList className="relative flex gap-4">
                {categories.map(({ name }) => (
                  <Tab
                    key={name}
                    className={({ selected }) =>
                      `cursor-pointer px-4 py-1 font-poppins text-[10px] font-light tracking-[0.48px] text-[#818181] outline-none transition-all duration-300 md:text-xs ${selected ? "text-black" : "hover:text-black"} relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:transform after:bg-[#818181] after:transition-transform after:duration-300 after:content-[''] ${selected ? "after:scale-x-100" : "after:scale-x-0"} `
                    }
                  >
                    {name}
                  </Tab>
                ))}
              </TabList>
            </TabGroup>
          </div>
          <div className="grid grid-cols-2 gap-[12px] md:grid md:grid-cols-3">
            {state.loading.allProducts
              ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="w-full animate-pulse">
                      <div className="relative aspect-square w-full bg-gray-300/60"></div>
                    </div>
                  ))
              : filteredProducts
                  .slice(0, 6)
                  .map((product, index) => (
                    <Productcard1
                      key={index}
                      product={product}
                      showDetails={true}
                    />
                  ))}
          </div>
          {/* <div className="flex w-full justify-center">
            <Button text="Shop All" variant="filledBlack" size="variable" />
          </div> */}
        </div>
      </div>
    </section>
  );
}
