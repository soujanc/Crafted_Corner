import React, { useState, useRef, useReducer, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import UseStripeStore from "../Store/UseStripeStore";
import {
  initialOrderState,
  orderReducer,
  useOrderActions,
} from "../Reducers/Ordereducers";
import {
  kartReducer,
  initialKartState,
  useCratActions,
} from "../Reducers/KartReducer";
import { authReducer, userAuthActions } from "../Reducers/AuthReducer";
import ChkoutFrm from "../components/checkout/ChkoutFrm";
import ChkoutFrmskelton from "../components/checkout/ChkoutFrmskelton";
import { useCheckoutContext } from "../Context/ChkeckoutContext";
import { useParams, useLocation } from "react-router-dom";
import {
  addressreducer,
  initialAddressState,
  useAddressActions,
} from "../Reducers/Addressreducer";
import {
  initialProductState,
  useProductActions,
  productReducer,
} from "../Reducers/ProductReducer";
import Button from "../components/Buttons/Button";
import BreadCrumb from "../components/Bread/BreadCrumb";

export default function CheckoutPage() {
  const { setClientSecretForSuccess } = UseStripeStore(); //hook for using the client secret or setting the client secret of stripe anytime anywhere
  const [orderId, setOrderId] = useState(null); //order created id to pass to chkoiutfrm
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isOrderLoading, setIsOrderLoading] = useState(false); //leader state for ordercreation process
  const [orderError, setOrderError] = useState(null); //erro state if any during ordercreation
  const { setCheckoutProductwo } = useCheckoutContext(); //global context to store the items to be passed to stripe api inside chkoutfrm
  const [sampeloader, setSampeloader] = useState(true); //sample loader to test skeleton loader
  const location = useLocation(); //gets the current url
  const { productId } = useParams(); //gets the product id from the url ie params
  const [stripedetails, setStripedetails] = useState(null);
  const queryParams = new URLSearchParams(location.search); //gets the query params from the url
  const color = queryParams.get("color"); //gets the color from the url
  const quantity = queryParams.get("quantity"); //gets the quantity from the url
  const [state, dispatch] = useReducer(productReducer, initialProductState); //product reducer go to file to understand this and how it works
  const [orderstate, orderdispatch] = useReducer(
    orderReducer,
    initialOrderState,
  );
  const [addresstate, addressdispatch] = useReducer(
    addressreducer,
    initialAddressState,
  );
  const [kartstate, kartdispatch] = useReducer(kartReducer, initialKartState);
  const { getCart } = useCratActions(kartdispatch);

  //address reducer go to file to understand this and how it works
  const { fetchProductById } = useProductActions(dispatch); //an reducer function to fetch the product by id
  const { createorder } = useOrderActions(orderdispatch); //am use hook to use the create order rducer function
  const [checkoutProducts, setCheckoutProducts] = useState({
    items: [],
    pricing: {
      subtotal: 0,
      taxAmount: 0,
      shippingFee: 0, // Default shipping fee
      totalAmount: 0,
    },
  }); //this is where the details are stored to display in order summary
  const [promoCode, setPromoCode] = useState(""); //this is where the promocode is stored
  const [promoError, setPromoError] = useState(""); //this is where the promocode error is stored
  const taxRate = 0.08; //tax rate remeber t update the same in server.js

  const validPromoCodes = ["tghbvfg", "cffvhjk", "cvghjk"]; //sample rpomocodes which work
  const [currentSection, setCurrentSection] = useState("details"); //this state responsible for the change of chekout -> payment in left div of checkout.jsx page
  // Add a new state for form validation errors
  const [formErrors, setFormErrors] = useState({
    //all the error variables
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  /**
   * Ref to prevent multiple fetch requests
   * @type {React.MutableRefObject<boolean>}
   * @description Ensures payment intent is created only once
   */
  const [clientSecret, setClientSecret] = useState("");
  const hasFetched = useRef(false); //so that te stripe api runs only once
  const isLoaded = state.loading.currentProduct || kartstate.loading;
  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "Cart",
      link: "/cart",
    },
    {
      label: "Checkout",
    },
    {
      label: "Payment",
      link: "/payment",
    },
  ];
  const id = useParams().productId;
  console.log("id", id);
  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // State to track whether to save the address
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1"); //default countrycode

  const countryCodes = [
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    // Add more country codes as needed
  ].sort((a, b) => a.country.localeCompare(b.country)); //sorts the country name in aphabetical order
  // Country list for validation
  const { fetchAddresses, addAddress } = useAddressActions(addressdispatch);
  const appearance = {
    theme: "flat",
    variables: {
      fontFamily: "Inter, sans-serif",
      fontSizeBase: "12px",
      accordionItemSpacing: "20px",
      spacingUnit: "5px",
      fontWeightLight: 200,
      colorPrimary: "#6B7280",
      colorTextSecondary: "#9CA3AF",
    },

    rules: {
      ".RadioIcon": {
        width: "18px",
      },
      ".RadioIconOuter": {
        stroke: "#E0E6EB",
      },
      ".RadioIconInner": {
        r: "16",
      },
      ".Tab": {
        border: "12px solid #E0E6EB",
        borderRadius: "8px",
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
      },

      ".Input": {
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        padding: "12px",
        fontFamily: "Inter, sans-serif",
      },
      ".Label": {
        color: "#9CA3AF",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",

        lineHeight: "14px",
        letterSpacing: "0.25px",
      },
      ".AccordionItem": {
        padding: "18px",
        fontSize: "12px",
        letterSpacing: "0.5px",
        fontWeight: "400",
        lineHeight: "14px",
        fontFamily: "Inter, sans-serif",
      },
      ".Tab:hover": {
        color: "var(--colorText)",
      },
      ".Tab--selected": {
        borderColor: "#E0E6EB",
      },
    },

    fonts: [
      {
        family: "Inter",
        src: "url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;700&display=swap')",
        weight: [100, 200, 300, 400, 500, 700],
        style: "normal",
        display: "swap",
      },
    ],
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";
  // Make sure to call loadStripe outside of a component’s render to avoid
  // recreating the Stripe object on every render.
  // This is your test publishable API key.
  const stripePromise = loadStripe(
    "pk_test_51QlthVHjzz3ZRfG0n0KXWztCyV1ex5Hbrc6ZQEPTaOZjiOMamm5CsHxqSqhsNGswozqKgS9ENIo9MZQGRoufr4yz00h5i8b9ai",
  );

  // Loader state based on clientSecret
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const [Authstate, Authdispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  const { fetchCurrentUser } = userAuthActions(Authdispatch);

  /************USEFFECTS******************/
  /**
   * Asynchronously loads the current user or generates a guest ID.
   *
   * This function checks if a user is authenticated by calling the
   * `fetchCurrentUser` function. If a user is found, it sets the
   * current user state. If no user is found, it checks localStorage
   * for an existing guest ID. If no guest ID exists, it generates
   * a new guest ID, stores it in localStorage, and updates the
   * guest ID state.
   *
   * This effect runs once when the component mounts.
   */
  useEffect(() => {
    const loadCurrentUser = async () => {
      const response = await fetchCurrentUser();
      if (response?.user) {
        setCurrentUser(response.user);
        console.log("Fetched Current User:", response.user);
        console.log("this is Authstate.user:", Authstate.user);
        console.log("this is Authstate.user:", Authstate.isAuthenticated);
      } else {
        console.log("this is Authstate.user:", Authstate.user);
        console.log("this is Authstate.user:", Authstate.isAuthenticated);
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

    loadCurrentUser();
  }, []);

  // Trigger updates when relevant data changes
  useEffect(() => {
    console.log("Effect triggered with:", {
      shippingMethod,
      personalInfo: personalInfo ? personalInfo.firstName : "No Personal Info",
      checkoutProducts: checkoutProducts
        ? checkoutProducts.items.length
        : "No Checkout Products",
      shippingAddress: shippingAddress
        ? shippingAddress.street
        : "No Shipping Address",
    });
    updateOrderData();
    console.log("this is order data", orderData);
  }, [personalInfo, checkoutProducts, shippingMethod, shippingAddress]);

  useEffect(() => {
    console.log("Shipping Method Changed:", shippingMethod);
  }, [shippingMethod]);

  // Update loading state when clientSecret changes
  useEffect(() => {
    // Set loading to false when clientSecret is set
    // Set loading to true if clientSecret is empty
    setIsLoading(!clientSecret);
  }, [clientSecret]);

  /**
   * Effect to create Stripe payment intent
   * @description Handles the creation of a payment intent by sending items to the server
   *
   * @fires fetch - Sends a POST request to create a payment intent
   *
   * @workflow
   * 1. Checks if fetch has not been triggered before
   * 2. Logs the items being sent to the server
   * 3. Prevents multiple fetch requests using hasFetched ref
   * 4. Sends items to payment intent creation endpoint
   * 5. Handles successful response by setting client secret
   * 6. Manages potential errors during the process
   *
   * @dependencies
   * - items: The current checkout items
   * - hasFetched: Ref to prevent multiple fetch attempts
   *
   * @state-updates
   * - Sets clientSecret state on successful response
   *
   * @error-handling
   * - Throws error for non-OK responses
   * - Logs any errors during payment intent creation
   *
   * @example
   * // Typical flow
   * if (!hasFetched.current) {
   *   fetch(paymentIntentEndpoint, {
   *     method: 'POST',
   *     body: JSON.stringify(items)
   *   })
   *   .then(handleResponse)
   *   .catch(handleError)
   * }
   *
   * @returns {void}
   */
  useEffect(
    () => {
      // if (!hasFetched.current) {
      console.log("stripe details:", stripedetails);
      hasFetched.current = true; // Prevent further fetches
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stripedetails),
        },
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Received client secret:", data.clientSecret);
          setClientSecret(data.clientSecret);
          setClientSecretForSuccess(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
        });
    },
    // }
    [stripedetails],
  );

  /**
   * Loads user addresses when the checkout page mounts
   * @function loadAddresses
   *
   * @description
   * Asynchronously fetches user addresses using the address actions
   * - Triggers on component mount
   * - Logs fetched addresses for debugging
   * - Handles and logs any errors during fetch
   *
   * @workflow
   * 1. Create an async function to fetch addresses
   * 2. Call fetchAddresses from useAddressActions
   * 3. Log successful address retrieval
   * 4. Catch and log any errors
   *
   * @async
   * @throws {Error} If address fetching fails
   *
   * @side-effects
   * - Updates address state in reducer
   * - Logs addresses to console
   *
   * @example
   * useEffect(() => {
   *   const loadAddresses = async () => {
   *     try {
   *       await fetchAddresses();
   *     } catch (error) {
   *       console.error("Address fetch failed");
   *     }
   *   };
   *   loadAddresses();
   * }, []);
   *
   * @returns {void}
   */
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        await fetchAddresses();
        console.log("Fetched Addresses:", addresstate.addresses);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    loadAddresses();
  }, []);

  /**
   * Fetches product details based on the product ID
   *
   * This effect performs the following actions:
   * 1. Checks if a product ID is present
   * 2. Attempts to fetch product details using the provided ID
   * 3. Handles potential errors during the fetch process
   * 4. Provides detailed logging for debugging purposes
   *
   * Key behaviors:
   * - Skips fetch if no product ID is provided
   * - Logs detailed information about the fetch process
   * - Captures and logs any unexpected errors
   *
   * @async
   * @function fetchProduct
   * @throws {Error} Logs any unexpected errors during product fetching
   *
   * @logs
   * - Attempted product ID
   * - Fetch function details
   * - Current product state
   * - Loading state
   *
   * @dependency {string} productId - Triggers the effect when product ID changes
   */
  // useEffect(() => {
  //   if (location.state?.source === "cart") {
  //     console.log("Navigated from Cart Page");

  //     const fetchCartItems = async () => {
  //       try {
  //         // Retrieve cart ID from localStorage
  //         const cartId = localStorage.getItem("cartId");

  //         // If no cart ID exists, do nothing
  //         if (!cartId) {
  //           return;
  //         }

  //         // Fetch cart items using the cart ID
  //         await getCart(cartId);
  //       } catch (error) {
  //         console.error("Failed to fetch cart items:", error);

  //       }
  //     };

  //     // Call the fetch function
  //     fetchCartItems();
  //   }
  //   // Fetch product details only if an ID is present
  //   if (productId) {
  //     const fetchProduct = async () => {
  //       try {
  //         console.log("Attempting to fetch product with ID:", productId);

  //         // Add error handling and more detailed logging
  //         await fetchProductById(productId);

  //         // Additional state logging
  //         console.log("Current product state:", state.currentProduct);
  //         console.log("Loading state:", state.loading);
  //       } catch (error) {
  //         console.error("Unexpected error in fetchProduct:", error);
  //       }
  //     };

  //     fetchProduct(); // Call the async function
  //   } else {
  //     console.warn("No product ID provided");
  //   }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location.state?.source === "cart") {
          //check here
          console.log("Navigated from Cart Page");

          const cartId = localStorage.getItem("cartId");
          if (!cartId) {
            console.warn("No cart ID found in localStorage");
            return;
          }

          await getCart(cartId); // Ensures cart data is fully fetched
        } else if (productId) {
          console.log("Fetching product with ID:", productId);
          await fetchProductById(productId); // Ensures product data is fully fetched
        } else {
          console.warn("No valid source detected (Neither Cart nor Product)");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.state?.source, productId]);

  // Add an additional effect to log state changes
  useEffect(() => {
    if (state.currentProduct && !state.loading.currentProduct) {
      console.log("Product Reducer State Updated:", state);

      // Create an `items` array with the selected product (without pricing inside)
      const items = [
        {
          productId,
          color,
          quantity: Number(quantity),
          productDetails: state.currentProduct,
        },
      ];

      // Calculate overall order pricing
      const subtotal = items.reduce(
        (acc, item) => acc + item.productDetails.price * item.quantity,
        0,
      );
      const taxAmount = Number((subtotal * taxRate).toFixed(2));
      const shippingFee = shippingMethod === "express" ? 15 : 5;
      const totalAmount = subtotal + taxAmount + shippingFee;

      // Set checkoutProducts in new format
      setCheckoutProducts((prevState) => ({
        ...prevState,
        items,
        pricing: { subtotal, taxAmount, shippingFee, totalAmount },
      }));

      console.log("Updated checkoutProducts for single product:", {
        items,
        pricing: { subtotal, taxAmount, shippingFee, totalAmount },
      });
    }
  }, [state.currentProduct, shippingMethod]);

  // Watches for `kartstate.cart` updates and updates `checkoutProducts`
  useEffect(() => {
    if (kartstate.cart?.products && !kartstate.loading) {
      console.log("Cart Updated:", kartstate.cart.products);

      // Create an `items` array without pricing inside
      const items = kartstate.cart.products.map((item) => ({
        productId: item.productId,
        color: item.color,
        quantity: item.quantity,
        productDetails: item,
      }));

      // Calculate overall order pricing
      const subtotal = items.reduce(
        (acc, item) => acc + item.productDetails.price * item.quantity,
        0,
      );
      const taxAmount = Number((subtotal * taxRate).toFixed(2));
      const shippingFee = shippingMethod === "express" ? 15 : 5;
      const totalAmount = subtotal + taxAmount + shippingFee;

      // Set checkoutProducts in new format
      setCheckoutProducts((prevState) => ({
        ...prevState,
        items,
        pricing: { subtotal, taxAmount, shippingFee, totalAmount },
      }));

      console.log("Updated checkoutProducts from cart:", {
        items,
        pricing: { subtotal, taxAmount, shippingFee, totalAmount },
      });
    }
  }, [kartstate.cart, shippingMethod]); // Runs when `kartstate.cart`, `taxRate`, or `shippingMethod` changes

  /************USEFFECTS END******************/

  /*************FUNCTIONS*************/

  // Update function to keep orderData in sync
  const updateOrderData = () => {
    setOrderData((prevData) => ({
      ...prevData,
      name: personalInfo.firstName + " " + personalInfo.lastName,
      email: personalInfo.email,
      phone: personalInfo.phoneNumber,

      shippingMethod: shippingMethod,

      // Update items (pricing removed)
      items: checkoutProducts.items.map((product) => ({
        productId: product.productId,
        name: product.productDetails.name,
        roomtype: product.productDetails.roomType,
        color: product.color,
        category: product.productDetails.category,
        price: product.productDetails.price,
        quantity: product.quantity,
        dimensions: {
          height: parseFloat(product.productDetails.dimensions.height),
          width: parseFloat(product.productDetails.dimensions.width),
          depth: parseFloat(product.productDetails.dimensions.depth),
        },
        weight: product.productDetails.weight,
        material: product.productDetails.material,
        image: product.productDetails.images[0],
      })),

      // Use outer pricing object instead of summing inside `items`
      taxAmount: checkoutProducts.pricing.taxAmount,
      shippingFee: checkoutProducts.pricing.shippingFee,
      totalAmount: checkoutProducts.pricing.totalAmount,

      // Update shipping address
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || "USA",
      },
    }));
    console.log("Order Data Updated with Shipping Fee:", {
      shippingMethod,
      shippingFee: checkoutProducts.pricing.shippingFee,
    });
  };
  // Function to generate a random userId
  const generateRandomUserId = () => {
    return "USER" + Math.random().toString(36).slice(2, 11).toUpperCase();
  };

  // Function to generate a tracking number
  const generateTrackingNumber = () => {
    // Combination of prefix, timestamp, and random string
    const prefix = "TRK";
    const timestamp = new Date().getTime().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).slice(2, 7).toUpperCase();

    return `${prefix}-${timestamp}-${randomStr}`;
  };
  //orderstate function
  const [orderData, setOrderData] = useState({
    userId: "",
    guestId: "", // Will be set from user context
    name: personalInfo.firstName + " " + personalInfo.lastName || "",
    email: personalInfo.email || "",
    phone: personalInfo.phoneNumber || "",
    // Order date (set to the current date)
    date: new Date().toISOString(), // Correct format for MongoDB

    // Shipping Method from Pricing Calculation
    shippingMethod: shippingMethod || "standard",

    // Items Mapping from Checkout Products
    items: checkoutProducts.items.map((product) => ({
      productId: product.productId,
      name: product.productDetails.name,
      roomtype: product.productDetails.roomType,
      color: product.color,
      category: product.productDetails.category,
      price: product.productDetails.price,
      quantity: product.quantity,
      dimensions: {
        height: parseFloat(product.productDetails.dimensions.height),
        width: parseFloat(product.productDetails.dimensions.width),
        depth: parseFloat(product.productDetails.dimensions.depth),
      },
      weight: product.productDetails.weight,
      material: product.productDetails.material,
      image: product.productDetails.images[0], // First image
    })),

    // Financial Details from Pricing
    // Use outer pricing object instead of reducing items
    taxAmount: checkoutProducts.pricing.taxAmount,
    shippingFee: checkoutProducts.pricing.shippingFee,
    totalAmount: checkoutProducts.pricing.totalAmount,

    // Optional Fields
    trackingNumber: generateTrackingNumber(), // Will be generated by backend
    paymentStatus: "pending",

    // Status Dates (can be null initially)
    statusDates: {
      confirmed: null,
      shipped: null,
      out_for_delivery: null,
      delivered: null,
    },

    // Placeholder for Shipping Address (to be filled from form)
    shippingAddress: {
      street: shippingAddress.street || "",
      city: shippingAddress.city || "",
      state: shippingAddress.state || "",
      zipCode: shippingAddress.zipCode || "",
      country: shippingAddress.country || "USA",
    },
  });
  useEffect(() => {
    console.log("freshly produced order datat to chek details:", orderData);
  }, [orderData]);
  useEffect(() => {
    setOrderData((prevData) => ({
      ...prevData,
      userId: currentUser ? currentUser._id : null, // Set userId if currentUser._id is present
      guestId: currentUser ? null : guestId, // Set guestId if currentUser._id is absent
    }));
  }, [currentUser, guestId]);
  /**
   * Validates and processes a promotional code during checkout
   *
   * This function performs the following actions:
   * 1. Trims and converts the promo code to uppercase
   * 2. Validates the promo code against a predefined list
   * 3. Sets appropriate error messages for different scenarios
   * 4. Implements a self-clearing error mechanism using setTimeout
   *
   * Validation Scenarios:
   * - Empty promo code: Displays "Promo code cannot be empty"
   * - Valid promo code: Clears any existing errors
   * - Invalid promo code: Displays "Invalid promo code"
   *
   * Key Behaviors:
   * - Case-insensitive promo code comparison
   * - Automatically clears error messages after 15 seconds
   * - Logs detailed information about the promo code validation process
   *
   * @function
   * @name handlePromoCodeApply
   *
   * @state-updates
   * - Updates promoError state
   *
   * @logs
   * - Promo code input details
   * - Validation results
   * - Timeout trigger events
   *
   * @requires validPromoCodes - Array of valid promotional codes
   */
  const handlePromoCodeApply = () => {
    // Trim and convert to uppercase for case-insensitive comparison
    const trimmedPromoCode = promoCode.trim().toUpperCase();

    console.log("Promo code apply called", {
      trimmedPromoCode,
      validPromoCodes,
    });

    if (!trimmedPromoCode) {
      setPromoError("Promo code cannot be empty");

      setTimeout(() => {
        console.log("Timeout triggered for empty promo code");
        setPromoError("");
      }, 15000);

      return;
    }

    if (validPromoCodes.includes(trimmedPromoCode)) {
      // Valid promo code logic here
      setPromoError("");
      console.log("Valid promo code");
    } else {
      setPromoError("Invalid promo code");
      console.log("Invalid promo code error set");

      setTimeout(() => {
        console.log("Timeout triggered for invalid promo code");
        setPromoError("");
      }, 15000);
    }
  };

  // Helper validation functions that validate input values
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return name === "firstName" && value.trim().length < 2
          ? "first name is too short"
          : !value.trim()
            ? `${name === "firstName" ? "first" : "last"} name cannot be empty}`
            : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";

      case "phoneNumber":
        const phoneRegex = /^[0-9]{10}$/;
        return !phoneRegex.test(value.replace(/\D/g, ""))
          ? "Please enter a valid 10-digit phone number"
          : "";

      case "street":
        return value.trim().length < 3
          ? "Please enter a valid street address"
          : "";

      case "city":
        return value.trim().length < 2 ? "Please enter a valid city" : "";

      case "state":
        return !value ? "Please select a state" : "";

      case "zipCode":
        const zipRegex = /^\d{5}(-\d{4})?$/;
        return !zipRegex.test(value) ? "Please enter a valid zip code" : "";

      case "country":
        // Check if country is selected and is in the valid countries list
        return !value ? "Please select a country" : "";

      default:
        return "";
    }
  };

  /**
   * Handles changes to personal information input fields
   *
   * This function performs two primary actions:
   * 1. Updates the personal information state with the new input value
   * 2. Validates the input field and manages form error state
   *
   * @function
   * @name handlePersonalInfoChange
   *
   * @param {Event} e - The input change event from form fields
   * @param {string} e.target.name - The name of the input field being changed
   * @param {string} e.target.value - The new value of the input field
   *
   * @state-updates
   * - Updates personalInfo state with new field value
   * - Updates formErrors state with validation results
   *
   * @validation
   * - Calls validateField to check input validity
   * - Sets error messages for invalid inputs
   *
   * @example
   * // Example of function usage in an input onChange event
   * <input
   *   name="firstName"
   *   onChange={handlePersonalInfoChange}
   *   value={personalInfo.firstName}
   * />
   *
   * @complexity O(1) - Constant time complexity for state update and validation
   *
   * @see validateField For detailed input validation logic
   */
  // Handle Input Changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;

    // Update personal info
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Only validate and set error if the input is not empty
    if (value.trim() !== "") {
      const error = validateField(name, value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else {
      // Clear the error for this field if input is empty
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  //jsdoc similar to above
  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;

    // Update shipping address
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Only validate and set error if the input is not empty
    if (value.trim() !== "") {
      const error = validateField(name, value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else {
      // Clear the error for this field if input is empty
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateCheckoutDetails = () => {
    // Comprehensive validation of checkout details
    const errors = {};
    // Check personal information
    if (!personalInfo.firstName) errors.firstName = "First name is required";
    if (!personalInfo.lastName) errors.lastName = "Last name is required";
    if (!personalInfo.email) errors.email = "Email is required";
    if (!personalInfo.phoneNumber) errors.phoneNumber = "phone is required";
    // Check shipping address
    if (!shippingAddress.street) errors.street = "Street address is required"; //take this for ordercreration address
    if (!shippingAddress.city) errors.city = "City is required";
    if (!shippingAddress.state) errors.state = "State is required";
    if (!shippingAddress.country) errors.country = "country is required";
    if (!shippingAddress.zipCode) errors.zipCode = "Zip code is required";
    // Update form errors
    setFormErrors(errors);
    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateCheckoutDetails()) {
      console.log("Validation Failed ❌");
      return;
    }
    // Validate order data runs only if orderstat exists
    if (!orderData) {
      setOrderError("Order data is missing"); //else set error
      return;
    }
    if (orderData) {
      console.log("freah af order Order Data:", orderData);
    }
    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "shippingMethod",

      "items",
      "shippingAddress",
    ];
    const missingFields = requiredFields.filter(
      //check if any of the required fields are missing and aslso shcek is the field is an array and if array check if it is empty
      (field) =>
        !orderData[field] ||
        (Array.isArray(orderData[field]) && orderData[field].length === 0),
    );

    if (missingFields.length > 0) {
      setOrderError(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    try {
      setOrderError(null); // Clear previous errors
      // Create order and ensure response is valid
      const createdOrder = await createorder(orderData);
      if (!createdOrder || !createdOrder.orderId) {
        throw new Error("Order creation failed");
      }
      console.log("Created Order:", createdOrder.orderId);
      setOrderId(createdOrder.orderId); // Store orderId in state
      // Validate checkout details before moving to payment

      // Transform checkout products to match previous format
      let checkoutProductwo;

      // Check if user came from the cart
      if (location.state?.source === "cart") {
        //check here
        console.log("Checkout from Cart");

        // Use all cart items for checkout
        checkoutProductwo = {
          items: kartstate.cart.products.map((item) => ({
            id: item.productId,
            quantity: Number(item.quantity),
            productprice: item.price,
            shippingMethod: shippingMethod || "standard",
          })),
        };
      } else {
        console.log("Checkout from Single Product Page");

        // Use only the current product for checkout
        checkoutProductwo = {
          items: [
            {
              id: state.currentProduct?._id || state.currentProduct?.productId,
              quantity: Number(quantity),
              productprice: state.currentProduct?.price || 0,
              shippingMethod: shippingMethod || "standard",
            },
          ],
        };
      }
      console.log("item to be sent to stripe", checkoutProductwo);
      setStripedetails(checkoutProductwo);
      // Set the transformed items in context only when placing order
      setCheckoutProductwo(checkoutProductwo);
      // Navigate to payment section
      // Proceed to next step if order creation successful
      setCurrentSection("payment");
    } catch (error) {
      console.error("Order Creation Error:", error);
      setOrderError(error.message || "Failed to create order");
    }
  };

  const handleBackToDetails = () => {
    setCurrentSection("details");
  };

  const handleSavedAddressSelect = (address) => {
    // Set the selected address
    setShippingAddress(address);
    // Clear all shipping address related errors
    setFormErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors.street;
      delete updatedErrors.city;
      delete updatedErrors.state;
      delete updatedErrors.zipCode;
      delete updatedErrors.country;
      return updatedErrors;
    });
  };

  /*************END OF FUNCTIONS*************/

  return (
    <>
      {state.loading.currentProduct ? (
        <div className="w-full animate-pulse space-y-6 bg-[#f9f9f9] px-[20px] py-[80px] font-inter lg:px-[250px] lg:py-[150px]">
          <div className="mb-11 flex flex-col space-y-8">
            <div className="h-8 w-1/4 rounded-lg bg-gray-300/60"></div>
            <div className="h-4 w-1/4 rounded bg-gray-300/60"></div>
          </div>
          <div className="flex w-full flex-col gap-8 md:flex-row md:gap-6">
            {/* Checkout Details Skeleton */}
            <div className="md:w-[65%] lg:w-[70%]">
              {/* Personal Information Skeleton */}
              <div className="mb-6 rounded-lg bg-white p-6">
                <div className="mb-4 h-4 w-1/3 bg-gray-300/60"></div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-10 rounded-lg bg-gray-300/60"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Shipping Address Skeleton */}
              <div className="mb-6 rounded-lg bg-white p-6">
                <div className="mb-4 flex justify-between">
                  <div className="h-4 w-1/3 bg-gray-300/60"></div>
                  <div className="h-4 w-1/4 bg-gray-300/60"></div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="h-10 rounded-lg bg-gray-300/60"
                    ></div>
                  ))}
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="h-3 w-3 rounded bg-gray-300/60"></div>
                  <div className="h-3 w-1/2 bg-gray-300/60"></div>
                </div>
              </div>

              {/* Shipping Method Skeleton */}
              <div className="mb-6 rounded-lg bg-white p-6">
                <div className="mb-4 h-4 w-1/3 bg-gray-300/60"></div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 rounded-full bg-gray-300/60"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-24 bg-gray-300/60"></div>
                          <div className="h-2 w-16 bg-gray-300/60"></div>
                        </div>
                      </div>
                      <div className="h-4 w-12 bg-gray-300/60"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Skeleton */}
              <div className="rounded-lg bg-white p-6">
                <div className="mb-4 h-4 w-1/3 bg-gray-300/60"></div>
                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="collapse-plus rounded-lg border border-gray-300"
                    >
                      <div className="h-12 rounded-lg bg-gray-300/60"></div>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center justify-center space-x-4">
                    <div className="flex-grow border-t"></div>
                    <div className="h-4 w-24 bg-gray-300/60"></div>
                    <div className="flex-grow border-t"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex h-20 flex-col items-center justify-center rounded-lg bg-gray-300/60 p-3"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Skeleton */}
            <div className="md:w-[35%] lg:w-[30%]">
              <div className="rounded-lg bg-white p-6">
                <div className="mb-6 h-4 w-1/2 bg-gray-300/60"></div>
                <div className="mb-4 space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 border-b border-gray-100 pb-3"
                    >
                      <div className="h-16 w-16 rounded-lg bg-gray-300/60"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-gray-300/60"></div>
                        <div className="flex justify-between">
                          <div className="h-2 w-1/2 bg-gray-300/60"></div>
                          <div className="h-2 w-1/4 bg-gray-300/60"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex justify-between">
                      <div className="h-3 w-1/3 bg-gray-300/60"></div>
                      <div className="h-3 w-1/4 bg-gray-300/60"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex w-full flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <div className="h-10 w-full rounded-lg bg-gray-300/60"></div>
                  <div className="h-10 w-full rounded-lg bg-gray-300/60"></div>
                </div>
                <div className="mt-4 space-y-2">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded bg-gray-300/60"></div>
                      <div className="h-3 w-1/2 bg-gray-300/60"></div>
                    </div>
                  ))}
                  <div className="h-2 w-full bg-gray-300/60"></div>
                  <div className="mt-4 h-10 w-full rounded-lg bg-gray-300/60"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full items-center bg-[#f9f9f9] px-[20px] py-[80px] font-inter lg:px-[250px] lg:py-[150px]">
          <h3 className="mb-6 mt-2 text-[18px] font-medium leading-none tracking-tight text-[#4D4D4D] lg:text-[20px]">
            {currentSection === "details" ? "Checkout " : "Payment"}
          </h3>
          <BreadCrumb items={breadcrumbItems} />

          <div className="flex w-full flex-col gap-8 md:flex-row md:gap-6">
            {/* Checkout Details Section */}
            {currentSection === "details" ? (
              <div className="md:w-[65%] lg:w-[70%]">
                {/* Personal Information */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 h-fit text-[14px] font-medium leading-none tracking-normal text-[#4D4D4D]">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        placeholder="First Name"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.firstName
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.firstName || " "}
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        placeholder="Last Name"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.lastName
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.lastName || " "}
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        placeholder="Email Address"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.email
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.email || " "}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300">
                        <div className="dropdown dropdown-right dropdown-bottom w-[10%] md:dropdown-left">
                          <div
                            tabIndex={0}
                            role="button"
                            className="flex cursor-pointer items-center border-gray-300 pr-2 text-[12px]"
                          >
                            <span>{phoneCountryCode}</span>
                            <svg
                              className="ml-1 h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] grid max-h-[300px] w-[250px] grid-cols-1 overflow-y-auto rounded-box border border-gray-200 bg-white p-2 shadow-lg"
                          >
                            {countryCodes.map((country) => (
                              <li
                                key={country.code}
                                onClick={() =>
                                  setPhoneCountryCode(country.code)
                                }
                                className="w-full"
                              >
                                <label className="flex w-full cursor-pointer items-center rounded-md p-2 text-[12px] hover:bg-gray-100">
                                  <span className="mr-2">{country.flag}</span>
                                  <span className="flex-grow">
                                    {country.country}
                                  </span>
                                  <span className="text-gray-500">
                                    {country.code}
                                  </span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={personalInfo.phoneNumber}
                          className="focus:outline-none"
                          onChange={(e) => {
                            // Validate phone number input
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handlePersonalInfoChange({
                              target: {
                                name: "phoneNumber",
                                value: numericValue,
                              },
                            });
                          }}
                          placeholder="Phone Number"
                        />
                      </div>
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.phoneNumber
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.phoneNumber || " "}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                  <div className="mb-4 flex h-fit items-center justify-between">
                    <h3 className="text-[14px] font-medium leading-none tracking-normal text-[#4D4D4D]">
                      Shipping Address
                    </h3>
                    {addresstate.loading.addresses ? (
                      <div className="flex w-1/2 items-center justify-center">
                        <span className="loading loading-spinner loading-sm text-gray-500"></span>
                        <span className="ml-2 text-[12px] text-gray-500">
                          Loading addresses...
                        </span>
                      </div>
                    ) : (
                      addresstate.addresses &&
                      addresstate.addresses.length > 0 && (
                        <div className="menu dropdown dropdown-end w-1/2 cursor-pointer">
                          <div
                            tabIndex={0}
                            role="button"
                            className="flex w-full items-center justify-end gap-2 rounded-md text-left text-[12px] font-light tracking-normal text-gray-400"
                          >
                            <span className="truncate">
                              {addresstate.addresses.find(
                                (addr) => addr._id === shippingAddress.id,
                              )
                                ? `${shippingAddress.street}, ${shippingAddress.city}`
                                : "Select Saved Address"}
                            </span>
                            <svg
                              className="h-4 w-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                          <ul
                            tabIndex={0}
                            className="menu dropdown-content z-[1] w-full rounded-box border border-gray-200 bg-white p-2 shadow-lg"
                          >
                            <li className="w-full">
                              <label
                                onClick={() => {
                                  // Set to a "None" state that allows full custom input
                                  setShippingAddress({
                                    street: "",
                                    apartment: "",
                                    city: "",
                                    state: "",
                                    zipCode: "",
                                    country: "",
                                    id: "custom_address",
                                  });
                                  // Clear all errors when switching to custom input
                                  setFormErrors((prev) => {
                                    const updatedErrors = { ...prev };
                                    delete updatedErrors.street;
                                    delete updatedErrors.city;
                                    delete updatedErrors.state;
                                    delete updatedErrors.zipCode;
                                    delete updatedErrors.country;
                                    return updatedErrors;
                                  });
                                }}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-md text-left text-[12px] font-light tracking-normal hover:bg-gray-100"
                              >
                                None
                              </label>
                            </li>
                            {addresstate.addresses.map((address) => (
                              <li key={address.id} className="w-full">
                                <label
                                  onClick={() =>
                                    handleSavedAddressSelect(address)
                                  }
                                  className="block w-full cursor-pointer rounded-md py-2 text-[12px] hover:bg-gray-100"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {address.street}
                                    </p>
                                    <p className="text-gray-500">
                                      {address.city}, {address.state}{" "}
                                      {address.zipCode}
                                    </p>
                                  </div>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative">
                      <input
                        type="text"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleShippingAddressChange}
                        placeholder="Street Address"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.street
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.street || " "}
                      </p>
                    </div>

                    <input
                      type="text"
                      name="apartment"
                      value={shippingAddress.apartment}
                      onChange={handleShippingAddressChange}
                      placeholder="Landmark : Apartment, Suite, etc. (optional)"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingAddressChange}
                        placeholder="City"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.city
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.city || " "}
                      </p>
                    </div>
                    <div className="relative">
                      {" "}
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingAddressChange}
                        placeholder="State"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.state
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.state || " "}
                      </p>
                    </div>
                    <div className="relative">
                      {" "}
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleShippingAddressChange}
                        placeholder="Zip Code"
                        className="mt-1 flex w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.zipCode
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.zipCode || " "}
                      </p>
                    </div>
                    <div className="relative w-full">
                      <div
                        tabIndex={0}
                        className="dropdown dropdown-end dropdown-bottom w-full"
                      >
                        <div
                          tabIndex={0}
                          role="button"
                          className="mt-1 flex w-full items-center justify-between rounded-lg border border-gray-300 p-2 text-left text-[12px] font-light tracking-normal text-gray-400"
                        >
                          <span className="truncate">
                            {shippingAddress.country || "Select Country"}
                          </span>
                          <svg
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] grid max-h-[300px] w-full grid-cols-1 overflow-y-auto rounded-box border border-gray-200 bg-white p-2 shadow-lg"
                        >
                          {[
                            "United States",
                            "Canada",
                            "United Kingdom",
                            "Australia",
                            "Germany",
                            "France",
                            "Japan",
                            "China",
                            "India",
                            "Brazil",
                            "Russia",
                            "Italy",
                            "Spain",
                            "Mexico",
                            "South Korea",
                            "Netherlands",
                            "Switzerland",
                            "Sweden",
                            "Singapore",
                            "United Arab Emirates",
                            "Saudi Arabia",
                            "South Africa",
                            "New Zealand",
                            "Ireland",
                            "Israel",
                            "Poland",
                            "Turkey",
                            "Argentina",
                            "Indonesia",
                            "Malaysia",
                            "Thailand",
                            "Egypt",
                          ]
                            .sort()
                            .map((country) => (
                              <li
                                key={country}
                                onChange={handleShippingAddressChange}
                                onClick={() => {
                                  // Update shipping address country
                                  setShippingAddress((prev) => ({
                                    ...prev,
                                    country: country,
                                  }));
                                }}
                                className="w-full"
                              >
                                <label
                                  htmlFor="country-dropdown"
                                  className="block w-full cursor-pointer rounded-md p-2 text-[12px] hover:bg-gray-100"
                                >
                                  {country}
                                </label>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <p
                        className={`absolute mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                          formErrors.country
                            ? "-translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        }`}
                      >
                        {formErrors.country || " "}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={saveAddressChecked}
                      onChange={(e) => setSaveAddressChecked(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <label
                      htmlFor="saveAddress"
                      className="cursor-pointer select-none text-[10px] text-gray-600"
                    >
                      Save this address for future purchases
                    </label>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 transition-all duration-500 ease-in-out">
                  <h3 className="mb-4 h-fit text-[14px] font-medium text-[#4D4D4D] transition-all duration-300">
                    Shipping Method
                  </h3>
                  <div className="grids-cols-1 grid gap-4 md:grid-cols-2">
                    <label
                      className={`duration-400 relative flex transform cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ease-in-out ${
                        shippingMethod === "standard"
                          ? "border-blue-200 bg-blue-50"
                          : "hover:shadow-xs border-gray-300 hover:bg-gray-50 hover:ring-1 hover:ring-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="hidden"
                        />

                        <div className="mr-4">
                          {shippingMethod === "standard" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-5 w-5 text-blue-400 transition-all duration-300 ease-in-out"
                            >
                              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
                              <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
                              <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1}
                              stroke="currentColor"
                              className="h-5 w-5 text-gray-400 transition-transform duration-300 ease-in-out"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.75a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-[12px] font-medium transition-all duration-300 ${
                              shippingMethod === "standard"
                                ? "text-blue-400"
                                : "text-gray-500"
                            }`}
                          >
                            Standard Shipping
                          </p>
                          <p
                            className={`text-[10px] transition-all duration-300 ${
                              shippingMethod === "standard"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            3-5 Business Days
                          </p>
                        </div>
                      </div>
                      <span
                        className={`${shippingMethod === "standard" ? "text-[#4d4d4d]" : "text-gray-400"} text-[12px] font-medium transition-all duration-300`}
                      >
                        $5.00
                      </span>
                    </label>

                    <label
                      className={`relative flex transform cursor-pointer items-center justify-between rounded-lg border p-4 transition-all duration-300 ease-in-out ${
                        shippingMethod === "express"
                          ? "border-green-300 bg-green-50"
                          : "hover:shadow-xs border-gray-300 hover:bg-gray-50 hover:ring-1 hover:ring-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className="hidden"
                        />
                        <div className="mr-4">
                          {shippingMethod === "express" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-5 w-5 text-green-400 transition-transform duration-300 ease-in-out"
                            >
                              <path
                                fillRule="evenodd"
                                d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1}
                              stroke="currentColor"
                              className="h-5 w-5 text-gray-400 transition-transform duration-300 ease-in-out"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Zm0 0h7.5"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-[12px] font-medium transition-all duration-300 ${
                              shippingMethod === "express"
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            Express Shipping
                          </p>
                          <p
                            className={`text-[10px] transition-all duration-300 ${
                              shippingMethod === "express"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            1-2 Business Days
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[12px] font-medium transition-all duration-300 ${
                          shippingMethod === "express"
                            ? "text-[#4d4d4d]"
                            : "text-gray-400"
                        }`}
                      >
                        $15.00
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              <ChkoutFrmskelton />
            ) : (
              <Elements
                options={{ clientSecret, appearance, loader }}
                stripe={stripePromise}
              >
                {orderId ? (
                  <ChkoutFrm orderId={orderId} />
                ) : (
                  <p>Loading Order Details...</p>
                )}
              </Elements>
            )}
            {/* Order Summary Section */}
            <div className="md:w-[35%] lg:w-[30%]">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-6 text-[14px] font-medium text-[#4D4D4D]">
                  Order Summary
                </h2>
                {checkoutProducts.items.map((item) => (
                  <>
                    {/* Detailed Product List */}
                    <div className="mb-4 space-y-4 border-b border-gray-200 pb-2">
                      <div
                        key={item.id}
                        className="mb-3 flex items-start gap-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="relative h-16 w-16">
                          <img
                            src={item.productDetails.images[3]}
                            alt={item.productDetails.name}
                            className="h-full w-full rounded-lg object-cover"
                          />
                          {item.quantity > 1 && (
                            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                              x{item.quantity}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[12px] font-normal tracking-normal text-gray-700">
                              {item.productDetails.name}
                            </h3>
                            <span className="text-[12px] font-medium text-gray-700">
                              $
                              {(
                                item.productDetails.price * item.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500">
                            {item.productDetails.category}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {item.color}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            H {item.productDetails.dimensions?.height || '24"'}×
                            W {item.productDetails.dimensions?.width || '20"'} ×
                            D {item.productDetails.dimensions?.depth || '20"'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))}

                {/* Summary Details */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[12px] text-gray-500">Subtotal</span>
                    <span className="text-[12px] font-medium text-[#4d4d4d]">
                      ${checkoutProducts.pricing.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[12px] text-gray-500">Shipping</span>
                    <span className="text-[12px] font-medium text-[#4d4d4d]">
                      ${checkoutProducts.pricing.shippingFee.toFixed(2)}
                      <span className="ml-1 text-[10px] text-gray-500">
                        (
                        {shippingMethod === "standard" ? "Standard" : "Express"}
                        )
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[12px] text-gray-500">Tax</span>
                    <span className="text-[12px] font-medium text-[#4d4d4d]">
                      ${checkoutProducts.pricing.taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="my-2 border-t border-gray-200 tracking-[0.48px]"></div>
                  <div className="my-1 flex justify-between">
                    <span className="text-[14px] font-medium text-[#4d4d4d]">
                      Total
                    </span>
                    <span className="text-[14px] font-medium text-gray-800">
                      ${checkoutProducts.pricing.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="mt-4 flex w-full flex-col sm:flex-col">
                  <div className="flex w-full flex-col gap-4 md:flex-row md:gap-0">
                    <div className="w-full md:flex-grow">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError(""); // Clear error when user starts typing
                        }}
                        className={`w-full flex-1 rounded-lg border ${
                          promoError
                            ? "border-red-500"
                            : "border-gray-200 focus:border-gray-300"
                        } px-3 py-2 text-[12px] focus:outline-none sm:rounded-l-md sm:rounded-r-none`}
                      />
                      {promoError && (
                        <p className="mt-1 text-[10px] text-red-500 md:hidden">
                          {promoError}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handlePromoCodeApply}
                      className="w-full rounded-lg bg-gray-100 px-3 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-200 sm:w-auto sm:rounded-l-none sm:rounded-r-md"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="mt-1 hidden text-[10px] text-red-500 md:flex">
                      {promoError}
                    </p>
                  )}
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
                  text="Continue to payment"
                  variant="filledBlack"
                  size="default"
                  className="mt-4 w-full"
                  fullWidth={true}
                  onClick={handlePlaceOrder}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
