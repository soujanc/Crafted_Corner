// Import necessary dependencies
import React, { useState, useReducer, useRef, useEffect } from "react";
import { format } from "date-fns";
import Paginator from "../components/Pagination/Paginator";

import {
  addressreducer,
  initialAddressState,
  useAddressActions,
} from "../Reducers/Addressreducer";
import {
  orderReducer,
  initialOrderState,
  useOrderActions,
} from "../Reducers/Ordereducers";
import {
  profileReducer,
  initialProfileState,
} from "../Reducers/ProfileReducer"; // Import the reducer and initial state

import Button from "../components/Buttons/Button";
import Modal from "../components/Modal/Modal"; // New import statement
import OrderStatusTracker from "../components/ordertracker/OrderStatusTracker";
import { authReducer, userAuthActions } from "../Reducers/AuthReducer";
export default function Profile() {
  const [state, dispatch] = useReducer(addressreducer, initialAddressState);
  const [Authstate, Authdispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  const { fetchCurrentUser } = userAuthActions(Authdispatch);
  const [currentUser, setcurrentUser] = useState([]);
  const [guestId, setGuestId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //order related functions start here
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  const [Filtermenuopen, setFiltermenuopen] = useState(false);
  const StatusOrder = ["confirmed", "shipped", "out for delivery", "delivered"];
  const StatusDetails = [
    {
      step: 1,
      title: "Order Confirmed",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-[16px] w-[16px] duration-300 ease-in-out hover:scale-110 md:h-[18px] md:w-[18px] lg:h-[20px] lg:w-[20px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
          />
        </svg>
      ),
      status: "confirmed",
    },
    {
      step: 2,
      title: "Shipped",
      icon: () => (
        <svg
          className="h-[16px] w-[16px] duration-300 ease-in-out hover:scale-110 md:h-[18px] md:w-[18px] lg:h-[20px] lg:w-[20px]"
          stroke-width={1.5}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="currentColor"
        >
          <path
            d="M8 19C9.10457 19 10 18.1046 10 17C10 15.8954 9.10457 15 8 15C6.89543 15 6 15.8954 6 17C6 18.1046 6.89543 19 8 19Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M18 19C19.1046 19 20 18.1046 20 17C20 15.8954 19.1046 15 18 15C16.8954 15 16 15.8954 16 17C16 18.1046 16.8954 19 18 19Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M10.05 17H15V6.6C15 6.26863 14.7314 6 14.4 6H1"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          ></path>
          <path
            d="M5.65 17H3.6C3.26863 17 3 16.7314 3 16.4V11.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          ></path>
          <path
            d="M2 9L6 9"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M15 9H20.6101C20.8472 9 21.0621 9.13964 21.1584 9.35632L22.9483 13.3836C22.9824 13.4604 23 13.5434 23 13.6273V16.4C23 16.7314 22.7314 17 22.4 17H20.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          ></path>
          <path
            d="M15 17H16"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          ></path>
        </svg>
      ),
      status: "shipped",
    },
    {
      step: 3,
      title: "Out for Delivery",
      icon: () => (
        <svg
          className="h-[16px] w-[16px] duration-300 ease-in-out hover:scale-110 md:h-[18px] md:w-[18px] lg:h-[20px] lg:w-[20px]"
          stroke-width={1.5}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="currentColor"
        >
          <path
            d="M14 7C15.1046 7 16 6.10457 16 5C16 3.89543 15.1046 3 14 3C12.8954 3 12 3.89543 12 5C12 6.10457 12.8954 7 14 7Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M11.5 18L13 14L8.11768 12L11.1179 8.50006L14.1179 11.0001L17.6179 11.0001"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      ),
      status: "out_for_delivery",
    },
    {
      step: 4,
      title: "Delivered",
      icon: (scale) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="currentColor"
          className="h-[16px] w-[16px] duration-300 ease-in-out hover:scale-110 md:h-[18px] md:w-[18px] lg:h-[20px] lg:w-[20px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
      status: "delivered",
    },
  ];
  const [selectedFullOrder, setSelectedFullOrder] = useState(null);
  const [orderstate, orderdispatch] = useReducer(orderReducer, {
    ...initialOrderState,
    orders: [],
    filteredOrders: [],
  });
  const { fetchOrders, sortOrder } = useOrderActions(orderdispatch);
  const [viewFullOrderDetails, setViewFullOrderDetails] = useState(false);
  // Fetch orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        await fetchOrders({ userId: currentUser._id, guestId: guestId });
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    loadOrders();
  }, [currentUser, guestId]);
  useEffect(() => {
    if (orderstate.filteredOrders.length > 0) {
      console.log("Filtered Orders are:", orderstate.filteredOrders);
    }
  }, [orderstate.filteredOrders]);

  // Add these functions to your component
  const handleFullOrderView = (order) => {
    // Directly set the selected order using useState
    console.log("this is the selected order", order);
    setSelectedFullOrder(order);

    // Set modal visibility
    setViewFullOrderDetails(true);
  };
  const handleBackToOrderHistory = () => {
    // Directly set the selected order to null using useState
    setSelectedFullOrder(null);

    // Close the order details render
    setViewFullOrderDetails(false);
  };
  const ExtractStatusDatesFromOrder = (order) => {
    // Mapping to handle different key variations and provide fallbacks

    const dateMapping = {
      confirmed: order.statusDates?.confirmed || "Pending",
      shipped: order.statusDates?.shipped || "Pending",
      out_for_delivery:
        order.statusDates?.out_for_delivery ||
        order.statusDates?.outfordelivery ||
        "Estimated",
      delivered: order.statusDates?.delivered || "Estimated",
    };

    return dateMapping;
  };
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //order related functions ends here
  //
  //
  //
  //
  //
  //
  //user related functions start here
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
  }, []); // Empty dependency array ensures this runs only once on mount
  //user related functions ends here
  //
  //
  //
  ///
  //
  //
  //
  //
  //
  //

  //menu items
  //
  //
  //
  //
  //
  ///
  //
  //
  //
  //
  const menuItems = [
    {
      id: "profile",
      label: "Profile Details",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
          />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Order Details",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      ),
    },
    {
      id: "address",
      label: "Saved Addresses",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
      ),
    },
  ];
  //
  //
  ///
  //
  //
  ///
  //
  //
  //
  ///
  //
  //menu items end here

  //Address related functions here
  //
  //
  //
  //
  //
  //
  //
  //
  //

  // Get address actions
  const { fetchAddresses, addAddress, deleteAddress, setDefaultAddress } =
    useAddressActions(dispatch);
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        await fetchAddresses(currentUser._id);
        console.log("Fetched Addresses:", state.addresses);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    if (currentUser._id) {
      loadAddresses();
    }
  }, [currentUser]);
  // Handle setting default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      await setDefaultAddress({ addressId, userId: currentUser._id });
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  // State to track current address
  const currentAddress = state.defaultAddress;
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // State for address modalthis state is used when new addreses are created
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    name: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  /**
   * Handles the addition of a new address for both authenticated and guest users.
   *
   * @async
   * @function handleAddAddress
   *
   * @description
   * This method prepares and submits address data with the following key features:
   * - Supports both authenticated and guest user scenarios
   * - Dynamically sets userId or guestId based on authentication status
   * - Resets address form after successful submission
   * - Handles potential errors during address creation
   *
   * @workflow
   * 1. Prepare address data object
   * 2. Determine user identification method (userId or guestId)
   * 3. Call addAddress action with prepared data
   * 4. Reset form fields
   * 5. Handle potential errors
   *
   * @usageScenario
   * - Logged-in user: Uses their authenticated userId
   * - Guest user: Uses a generated guestId
   *
   * @example
   * // For authenticated user
   * addressData = {
   *   userId: "user123",
   *   guestId: null,
   *   name: "John Doe",
   *   street: "123 Main St"
   * }
   *
   * // For guest user
   * addressData = {
   *   userId: null,
   *   guestId: "guest_12345",
   *   name: "Guest User",
   *   street: "456 Guest St"
   * }
   *
   * @throws {Error} Logs and potentially displays error if address creation fails
   *
   * @returns {Promise<void>}
   */
  // Function to handle address addition
  const handleAddAddress = async () => {
    try {
      // Prepare address data
      const addressData = {
        type: newAddress.type,
        name: newAddress.name,
        street: newAddress.street,
        landmark: newAddress.landmark,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zipCode,
        country: newAddress.country,
        userId: currentUser?._id || null, // Use userId if authenticated
        guestId: currentUser ? null : guestId, // Use guestId if not authenticated
      };

      // Use addAddress action from useAddressActions
      await addAddress(addressData);

      // Reset form
      setNewAddress({
        type: "Home",
        name: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      });
    } catch (error) {
      console.error("Failed to add address:", error);
      // Optionaly, handle error (e.g., show error message to user)
    }
  };

  // Function to handle address deletion
  // Function to handle address deletion
  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      // Refetch addresses to ensure updated state
      await fetchAddresses(currentUser._id);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //Adress related functions end herel

  //profile related functions start here
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // State for profile details
  const [profileState, dispatchProfile] = useReducer(
    //The useReducer hook is used to manage state in a React component. It takes two arguments: a reducer function (profileReducer in this case) and an initial state (initialProfileState).
    profileReducer,
    initialProfileState,
  ); // Use profileReducer

  // State for profile image
  const [profileImage, setProfileImage] = useState({
    preview: "../public/Images/profile.jpg", // Default profile image
    file: null,
  });

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image (JPEG, PNG, or GIF)");
        return;
      }

      if (file.size > maxSize) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage({
          preview: reader.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatchProfile({ type: "UPDATE_PROFILE", payload: { [name]: value } }); // Ensure this dispatch is correct
  };

  // State for tracking which field is being edited
  const [editingField, setEditingField] = useState({
    fullName: false,
    email: false,
    phone: false,
  });

  const handleEditingFieldChange = (field, value) => {
    // Add a small delay to allow smooth transitions
    if (value) {
      // When enabling editing
      setTimeout(() => {
        setEditingField((prev) => ({
          ...prev,
          [field]: true,
        }));
      }, 100); // Small 100ms delay
    } else {
      // When disabling editing
      setEditingField((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  // State for delete account modal
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  // Function to handle delete account
  const handleDeleteAccount = () => {
    console.log("Deleting account...");
    setIsDeleteAccountModalOpen(false);
  };

  //function to create a profile completeness progress bar
  const calculateProfileCompleteness = () => {
    let completeness = 0;
    const totalFields = 4; // Total fields to check

    if (profileState.fullName) completeness++;
    if (profileState.email) completeness++;
    if (profileState.phone) completeness++;
    if (state.addresses.length > 0) completeness++; // At least one address

    return (completeness / totalFields) * 100; // Return percentage
  };

  // Function to calculate profile completeness
  const profileCompleteness = calculateProfileCompleteness(); // Call the function here

  useEffect(() => {
    console.log("Profile Completeness:", profileCompleteness);
  }, [profileState, state.addresses]); // Add dependencies here

  //
  //
  //
  //
  //
  //
  //
  //profile functions end here

  // Function to render different content based on active menu
  const renderContent = () => {
    switch (
      activeMenu //when activemenu is et to something it sees if it is same as the case and deipslay the
    ) {
      // Profile Details Section
      case "profile":
        return (
          <div className="flex h-full max-h-[calc(100vh-200px)] w-full flex-col overflow-y-auto scrollbar-thin">
            {/* Section Header */}
            <div className="mb-5 mt-1 flex h-fit items-center justify-between md:mb-6 md:mt-0 lg:mb-7">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] font-medium tracking-normal text-[#4D4D4D] md:text-[16px] lg:text-[20px]">
                  Profile Details
                </h3>
                <p className="text-[10px] font-light tracking-normal text-gray-600 md:text-[12px] md:text-[12x]">
                  Manage your personal information and preferences
                </p>
              </div>
            </div>

            {/* Profile Header with Image and Basic Info */}
            {/* Profile Header with Image and Basic Info */}
            {!currentUser._id ? (
              <div className="flex h-fit w-full flex-col items-center justify-center rounded-lg bg-gray-100 px-16 py-24 text-center transition-all duration-300 ease-in-out">
                {/* Updated Icon */}
                <div className="mb-4">
                  <svg
                    className="h-8 w-8 text-[#9CA3AF]"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 20V19C2 15.134 5.13401 12 9 12V12"
                      stroke="currentColor"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15.8038 12.3135C16.4456 11.6088 17.5544 11.6088 18.1962 12.3135V12.3135C18.5206 12.6697 18.9868 12.8628 19.468 12.8403V12.8403C20.4201 12.7958 21.2042 13.5799 21.1597 14.532V14.532C21.1372 15.0132 21.3303 15.4794 21.6865 15.8038V15.8038C22.3912 16.4456 22.3912 17.5544 21.6865 18.1962V18.1962C21.3303 18.5206 21.1372 18.9868 21.1597 19.468V19.468C21.2042 20.4201 20.4201 21.2042 19.468 21.1597V21.1597C18.9868 21.1372 18.5206 21.3303 18.1962 21.6865V21.6865C17.5544 22.3912 16.4456 22.3912 15.8038 21.6865V21.6865C15.4794 21.3303 15.0132 21.1372 14.532 21.1597V21.1597C13.5799 21.2042 12.7958 20.4201 12.8403 19.468V19.468C12.8628 18.9868 12.6697 18.5206 12.3135 18.1962V18.1962C11.6088 17.5544 11.6088 16.4456 12.3135 15.8038V15.8038C12.6697 15.4794 12.8628 15.0132 12.8403 14.532V14.532C12.7958 13.5799 13.5799 12.7958 14.532 12.8403V12.8403C15.0132 12.8628 15.4794 12.6697 15.8038 12.3135V12.3135Z"
                      stroke="currentColor"
                      stroke-width="1"
                    ></path>
                    <path
                      d="M15.3636 17L16.4546 18.0909L18.6364 15.9091"
                      stroke="currentColor"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M9 12C11.2091 12 13 10.2091 13 8C13 5.79086 11.2091 4 9 4C6.79086 4 5 5.79086 5 8C5 10.2091 6.79086 12 9 12Z"
                      stroke="currentColor"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>

                {/* Title */}
                <h2 className="mb-4 font-poppins text-[12px] font-medium tracking-[0.28px] text-[#4D4D4D] lg:text-[14px]">
                  Login to Access Your Profile
                </h2>

                {/* Description */}
                <p className="mb-6 max-w-md font-poppins text-[10px] font-light leading-relaxed tracking-wider text-[#818181] md:text-[12x] lg:text-[12px]">
                  It looks like you need to log in to access your profile to
                  manage your Personal Details. Please log in to continue.
                </p>

                {/* Optional Divider */}
                <Button text="Login" variant="filledBlackNoHover" />

                {/* Login Button */}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mb-4 flex flex-col rounded-lg border border-gray-200 bg-white">
                  <div className="z-1 relative h-32 w-full overflow-hidden rounded-t-lg bg-header bg-cover bg-center">
                    {/* Ensure the image is styled to fill the container */}
                    <img
                      className="absolute h-full w-full object-cover object-center transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg hover:brightness-110"
                      src="../public/Images/5.png"
                      alt="https://via.placeholder.com/150"
                    />
                  </div>
                  <div className="z-10 -mt-12 mb-4 flex items-center justify-center px-5">
                    <img
                      src={
                        profileImage.preview ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                      className="h-24 w-24 rounded-full border-white bg-white object-cover ring-[6px] ring-white"
                    />
                  </div>
                  <div className="px-14 pb-6 text-center">
                    <h2 className="text-[16px] font-medium text-gray-700">
                      {profileState.fullName}
                    </h2>
                    <p className="mt-2 text-[12px] text-gray-500">
                      {profileState.phone}
                    </p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        onClick={() => {
                          document.getElementById("profileImageUpload").click();
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 px-3 py-1 text-[10px] text-gray-700 hover:bg-gray-100 md:text-[12x]"
                      >
                        Edit Profile
                      </button>
                      {profileImage.preview && (
                        <Modal
                          title="Remove Profile Photo"
                          trigger={(props) => (
                            <button
                              {...props}
                              className="inline-flex items-center justify-center rounded-full border border-red-300 px-3 py-1 text-[10px] text-red-700 hover:bg-red-50 md:text-[12x]"
                            >
                              Remove Photo
                            </button>
                          )}
                        >
                          {({ closeModal }) => (
                            <div className="space-y-4">
                              <p className="text-left text-[10px] font-light leading-none text-[#4D4D4D] md:text-[12px]">
                                Are you sure you want to remove your profile
                                photo?
                              </p>
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={closeModal}
                                  size="compact"
                                  text="Cancel"
                                  variant="filledWhiteNoHover"
                                />
                                <Button
                                  onClick={() => {
                                    setProfileImage({
                                      preview: null,
                                      raw: null,
                                    });
                                    closeModal();
                                  }}
                                  size="compact"
                                  text="Remove"
                                  variant="filledBlackNoHover"
                                />
                              </div>
                            </div>
                          )}
                        </Modal>
                      )}
                    </div>
                  </div>
                  <hr className="mt-2" />
                  <input
                    type="file"
                    id="profileImageUpload"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>

                <div className="flex w-full flex-col-reverse rounded-lg border border-gray-200 bg-white p-6 md:flex md:flex-row lg:p-8">
                  {/* Left Side - Profile Details Form */}
                  <div className="w-full space-y-6 md:w-full">
                    {/* Section Header */}

                    {/* Profile Form Container */}
                    <div className="space-y-2">
                      <p className="text-[12px] font-medium leading-none tracking-normal text-[#4d4d4d] lg:text-[14px]">
                        Basic info
                      </p>
                      <p className="text-[10px] font-light leading-none tracking-wide text-gray-600 hover:text-gray-600 md:text-[12px] md:text-[12x]">
                        Tell us your basic info details
                      </p>
                    </div>

                    <div className="border-t-[1px] border-gray-100"></div>

                    <div className="flex h-fit flex-col space-y-2 py-1">
                      <label className="text-[10px] font-light leading-none tracking-wide text-gray-500">
                        Profile completion {profileCompleteness}%
                      </label>
                      <div className="mt-1 flex w-full items-center gap-x-1">
                        {/* Progress Bar */}
                        <div
                          className={`flex h-1 w-full flex-col justify-center overflow-hidden whitespace-nowrap rounded-l-lg ${profileCompleteness >= 25 ? "bg-green-300" : "bg-gray-400"} text-center text-xs text-white transition duration-500`}
                          role="progressbar"
                          aria-valuenow={profileCompleteness >= 25 ? 25 : 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                        <div
                          className={`flex h-1 w-full flex-col justify-center overflow-hidden ${profileCompleteness >= 50 ? "bg-green-300" : "bg-gray-300/60"} text-center text-xs text-white transition duration-500`}
                          role="progressbar"
                          aria-valuenow={profileCompleteness >= 50 ? 50 : 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                        <div
                          className={`flex h-1 w-full flex-col justify-center overflow-hidden ${profileCompleteness >= 75 ? "bg-green-300" : "bg-gray-300/60"} text-center text-xs text-white transition duration-500`}
                          role="progressbar"
                          aria-valuenow={profileCompleteness >= 75 ? 75 : 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                        <div
                          className={`flex h-1 w-full flex-col justify-center overflow-hidden rounded-r-lg ${profileCompleteness === 100 ? "bg-green-300" : "bg-gray-300/60"} text-center text-xs text-white transition duration-500`}
                          role="progressbar"
                          aria-valuenow={profileCompleteness === 100 ? 100 : 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>

                    <div className="w-full space-y-4 tracking-normal md:max-w-[350px] md:space-y-5 lg:max-w-[450px]">
                      {/* Personal Information */}
                      <div className="relative w-full">
                        <div className="mb-1 flex items-center justify-between">
                          <label className="block text-[10px] font-normal tracking-wide text-gray-600 md:text-[12x]">
                            Full Name
                          </label>
                          <button
                            onClick={() =>
                              handleEditingFieldChange(
                                //this function sets the value to true whichwas previously false so the button appears whenyu click save the button disspaear as it uses sma efunction to makeit true
                                "fullName",
                                !editingField.fullName,
                              )
                            }
                            className="flex items-center justify-center gap-1 text-[10px] font-light tracking-wide text-gray-400 transition-colors duration-300 hover:text-gray-600 md:text-[12px] md:text-[12x]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            edit
                          </button>
                        </div>
                        <div className="flex w-full items-center space-x-2">
                          <input
                            type="text"
                            name="fullName" // Ensure this matches the state property
                            value={profileState.fullName} // Ensure this is correctly bound to state
                            onChange={handleInputChange} // This should work if the above function is correct
                            className={`h-[30px] transform rounded-lg border border-gray-300 px-3 text-[10px] text-[#4d4d4d] transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-200 md:h-[36px] md:text-[12px] md:text-[12x] ${
                              editingField.fullName
                                ? "w-[calc(100%-80px)] opacity-100"
                                : "w-full opacity-90"
                            }`}
                            readOnly={!editingField.fullName}
                          />

                          {editingField.fullName && (
                            <Button
                              text="Save"
                              variant="filledBlack"
                              size="compact"
                              className={`ml-2 w-auto min-w-[60px] text-[10px] transition-all duration-1000 ease-in-out md:text-[12x] ${
                                editingField.fullName
                                  ? "translate-x-0 opacity-100"
                                  : "translate-x-full opacity-0"
                              }`}
                              onClick={() =>
                                handleEditingFieldChange(
                                  "fullName",
                                  !editingField.fullName,
                                )
                              }
                            />
                          )}
                        </div>
                      </div>

                      <div className="relative w-full">
                        <div className="mb-1 flex items-center justify-between">
                          <label className="block text-[10px] font-normal tracking-wide text-gray-600 md:text-[12x]">
                            Contact Email
                          </label>
                          <button
                            onClick={() =>
                              handleEditingFieldChange(
                                "email",
                                !editingField.email,
                              )
                            }
                            className="flex items-center justify-center gap-1 text-[10px] font-light tracking-wide text-gray-400 transition-colors duration-300 hover:text-gray-600 md:text-[12px] md:text-[12x]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            edit
                          </button>
                        </div>
                        <div className="flex w-full items-center space-x-2">
                          <input
                            type="text"
                            name="email" // Ensure this matches the state property
                            value={profileState.email} // Ensure this is correctly bound to state
                            onChange={handleInputChange} // This should work if the above function is correct
                            className={`h-[30px] transform rounded-lg border border-gray-300 px-3 text-[10px] text-[#4d4d4d] transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-200 md:h-[36px] md:text-[12px] md:text-[12x] ${
                              editingField.email
                                ? "w-[calc(100%-80px)] opacity-100"
                                : "w-full opacity-90"
                            }`}
                            readOnly={!editingField.email}
                          />

                          {editingField.email && (
                            <Button
                              text="Save"
                              variant="filledBlack"
                              size="compact"
                              className={`ml-2 w-auto min-w-[60px] text-[10px] transition-all duration-1000 ease-in-out md:text-[12x] ${
                                editingField.email
                                  ? "translate-x-0 opacity-100"
                                  : "translate-x-full opacity-0"
                              }`}
                              onClick={() =>
                                handleEditingFieldChange(
                                  "email",
                                  !editingField.email,
                                )
                              }
                            />
                          )}
                        </div>
                      </div>

                      <div className="relative w-full">
                        <div className="mb-1 flex items-center justify-between">
                          <label className="block text-[10px] font-normal tracking-wide text-gray-600 md:text-[12x]">
                            Phone
                          </label>
                          <button
                            onClick={() =>
                              handleEditingFieldChange(
                                "phone",
                                !editingField.phone,
                              )
                            }
                            className="flex items-center justify-center gap-1 text-[10px] font-light tracking-wide text-gray-400 transition-colors duration-300 hover:text-gray-600 md:text-[12px] md:text-[12x]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            edit
                          </button>
                        </div>
                        <div className="flex w-full items-center space-x-2">
                          <input
                            type="text"
                            name="phone" // Ensure this matches the state property
                            value={profileState.phone} // Ensure this is correctly bound to state
                            onChange={handleInputChange} // This should work if the above function is correct
                            className={`h-[30px] transform rounded-lg border border-gray-300 px-3 text-[10px] text-[#4d4d4d] transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-200 md:h-[36px] md:text-[12px] md:text-[12x] ${
                              editingField.phone
                                ? "w-[calc(100%-80px)] opacity-100"
                                : "w-full opacity-90"
                            }`}
                            readOnly={!editingField.phone}
                          />

                          {editingField.phone && (
                            <Button
                              text="Save"
                              variant="filledBlack"
                              size="compact"
                              className={`ml-2 w-auto min-w-[60px] text-[10px] transition-all duration-1000 ease-in-out md:text-[12x] ${
                                editingField.phone
                                  ? "translate-x-0 opacity-100"
                                  : "translate-x-full opacity-0"
                              }`}
                              onClick={() =>
                                handleEditingFieldChange(
                                  "phone",
                                  !editingField.phone,
                                )
                              }
                            />
                          )}
                        </div>
                      </div>

                      <div className="relative w-full">
                        <div className="mb-1 flex items-center justify-between">
                          <label className="block text-[10px] font-normal tracking-wide text-gray-600 md:text-[12x]">
                            Current Password
                          </label>
                        </div>
                        <div className="flex w-full items-center">
                          <input
                            type="password"
                            value="************"
                            readOnly
                            className="h-[30px] w-full rounded-lg border border-gray-300 px-3 text-[12px] tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 md:h-[36px]"
                          />
                        </div>
                        <p className="mt-2 cursor-pointer text-[10px] text-blue-600 transition-colors duration-200 ease-in-out hover:text-blue-800 md:text-[12x]">
                          Reset Password
                        </p>
                      </div>

                      <div className="relative w-full">
                        <div clossName="mb-6 h-fit">
                          <label
                            htmlFor="confirmPassword"
                            className="block text-[10px] font-normal tracking-wide text-gray-600 md:text-[12x]"
                          >
                            Shipping Address
                          </label>
                          <input
                            className="mt-1 h-[30px] w-full truncate rounded-lg border border-gray-300 px-3 text-[12px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 md:h-[36px] md:text-[12px]"
                            value={
                              currentAddress
                                ? `${currentAddress.name}, ${currentAddress.street}, ${currentAddress.landmark}, ${currentAddress.city}, ${currentAddress.state}, ${currentAddress.zipCode}, ${currentAddress.country}`
                                : "No address selected"
                            }
                          ></input>

                          <label
                            htmlFor="savedAddresses"
                            className="ml-1 mt-1 flex items-center text-[10px] font-light tracking-wide text-gray-500 md:text-[12x]"
                          >
                            <svg
                              width="12px"
                              height="12px"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.5 14.5L11.9926 12M14.5 9.5L11.9926 12M11.9926 12L9.5 9.5M11.9926 12L14.5 14.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                            {state.addresses.length === 0 ? (
                              <span className="ml-1">
                                Please navigate to the Saved Addresses section
                                to add new addresses.
                              </span>
                            ) : (
                              <span className="ml-1">
                                Please navigate to the Saved Addresses section
                                to change current addresses.
                              </span>
                            )}
                          </label>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-[10px] font-medium text-gray-700 md:text-[12px] md:text-[12x]">
                              Delete Account
                            </h3>
                            <p className="text-[10px] font-normal text-gray-600 md:text-[12px] md:text-[12x]">
                              Permanently delete your account and all associated
                              data. This action cannot be undone.
                            </p>
                            <Modal
                              title="Delete Account"
                              trigger={(props) => (
                                <button
                                  {...props}
                                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-[10px] font-normal text-red-500 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 md:mt-4 md:text-[12px] md:text-[12x]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 md:h-4 md:w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete My Account
                                </button>
                              )}
                            >
                              {({ closeModal }) => (
                                <div className="space-y-4">
                                  <p className="text-[10px] font-light leading-none text-[#4D4D4D] md:text-[12px] md:text-[12x]">
                                    Are you sure you want to delete this
                                    account?
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      onClick={closeModal}
                                      size="compact"
                                      text="Cancel"
                                      variant="filledWhiteNoHover"
                                    />

                                    <Button
                                      onClick={() => {
                                        handleDeleteAccount();
                                        closeModal();
                                      }}
                                      size="compact"
                                      text="Delete"
                                      variant="filledBlackNoHover"
                                    />
                                  </div>
                                </div>
                              )}
                            </Modal>
                          </div>

                          {/* Delete Account Confirmation Modal */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // Order History Section
      case "orders":
        const handleFilterOrders = (filter) => {
          // Use filterOrders from the context instead of dispatching an action
          sortOrder(filter);
        };

        const itemsPerPage = 5;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = orderstate.filteredOrders.slice(
          indexOfFirstItem,
          indexOfLastItem,
        );

        return (
          <>
            {!viewFullOrderDetails ? (
              // Main container with scrolling functionality

              <div className="flex h-full max-h-[calc(100vh-200px)] w-full flex-col scrollbar-thin">
                {/* Section Header */}
                <div className="mb-5 mt-1 flex h-fit items-center justify-between md:mb-6 md:mt-0 lg:mb-7">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[14px] font-medium tracking-normal text-[#4D4D4D] md:text-[16px] lg:text-[20px]">
                      Order History
                    </h3>
                    <p className="text-[10px] font-light tracking-normal text-gray-600 md:text-[12px] md:text-[12x]">
                      Check the status of recent orders, manage returns, and
                      download invoices
                    </p>
                  </div>
                  <div className="item-center relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-[12px] font-normal leading-none text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300"
                        id="menu-button"
                        aria-expanded="true"
                        aria-haspopup="true"
                        onClick={() => setFiltermenuopen(!Filtermenuopen)}
                      >
                        Options
                        <svg
                          className="-mr-1 h-4 w-4 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div
                      className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ${
                        Filtermenuopen
                          ? "scale-100 transform opacity-100 transition duration-100 ease-out"
                          : "pointer-events-none scale-95 transform opacity-0 transition duration-75 ease-in"
                      }`}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                      tabIndex="-1"
                    >
                      <div className="py-1" role="none">
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-0"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("all");
                          }}
                        >
                          All
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-1"
                          onClick={() => {
                            setFiltermenuopen(false);

                            handleFilterOrders("delivered");
                          }}
                        >
                          Delivered
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-2"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("shipped");
                          }}
                        >
                          Shipped
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-3"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("out_for_delivery");
                          }}
                        >
                          Out for delivery
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-3"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("pending");
                          }}
                        >
                          Pending
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-3"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("confirmed");
                          }}
                        >
                          Confirmed
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-4"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("last7Days");
                          }}
                        >
                          Last 7 Days
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-5"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("lastMonth");
                          }}
                        >
                          Last Month
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-6"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("last3Months");
                          }}
                        >
                          Last 3 Month
                        </a>
                        <a
                          className="block px-4 py-2 text-xs text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-7"
                          onClick={() => {
                            setFiltermenuopen(false);
                            handleFilterOrders("last6Months");
                          }}
                        >
                          Last 6 Months
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter select */}
                {/*govinda*/}
                {/* Scrollable Container for Order List */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                  {
                    orderstate.loading ? (
                      // Loading skeleton or spinner
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-[#f7f7f7] p-16 text-center">
                        <div className="animate-pulse space-y-4">
                          <div className="h-8 w-48 rounded bg-gray-300"></div>
                          <div className="h-4 w-64 rounded bg-gray-200"></div>
                          <div className="h-12 w-full rounded bg-gray-100"></div>
                        </div>
                      </div>
                    ) : orderstate.filteredOrders.length === 0 ? (
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-[#f7f7f7] px-16 py-24 text-center">
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
                          No orders
                        </h2>

                        <p className="mb-5 max-w-md font-poppins text-[10px] font-light leading-relaxed tracking-[0.28px] text-[#818181] md:text-[12x] lg:text-[12px]">
                          Looks like you haven't made any orders yet.
                        </p>
                        <Button
                          text="Start Shopping"
                          variant="filledBlack"
                          size="compact"
                        />
                      </div>
                    ) : (
                      <>
                        {/* //orderhistory start */}
                        <div className="flex flex-col gap-4">
                          {/* Orders Data Array - Add or modify orders here */}
                          {currentItems.map((order) => {
                            // Calculate total from items
                            //from the reducer dawg

                            return (
                              // Individual Order Card
                              <div
                                key={order._id}
                                className="flex flex-col gap-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] md:gap-6 md:p-6 lg:gap-8 lg:p-8"
                              >
                                {/* Order Header - Date and Total */}
                                <div className="flex items-start justify-between">
                                  <div className="flex gap-4 sm:gap-4 md:gap-6">
                                    <div className="flex h-fit flex-col gap-2 tracking-normal md:gap-2">
                                      <span className="text-[12px] font-medium leading-none text-[#4D4D4D] md:text-[14px]">
                                        Date Placed
                                      </span>
                                      <span className="text-[10px] font-light leading-none text-gray-600 md:text-[12px] md:text-[12x]">
                                        {format(
                                          new Date(order.date),
                                          "MMMM d, yyyy",
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex h-fit flex-col gap-2 tracking-normal md:gap-2">
                                      <span className="text-[12px] font-medium leading-none text-[#4D4D4D] md:text-[14px]">
                                        Total
                                      </span>
                                      <span className="text-[10px] font-light leading-none text-gray-600 md:text-[12px] md:text-[12x]">
                                        ${order.totalAmount}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex h-fit flex-col gap-2 text-right md:gap-2">
                                    <span className="text-[12px] font-medium leading-none text-[#4D4D4D] md:text-[14px]">
                                      Order Id
                                    </span>
                                    <span className="font-98 9 text-[10px] font-light leading-none text-gray-600 md:text-[12px] md:text-[12x]">
                                      {order.orderId}
                                    </span>
                                  </div>
                                </div>
                                <div className="-mx-8 h-[1px] bg-gray-100"></div>

                                {/* Order Items Section */}
                                <div className="flex flex-col gap-6 font-inter">
                                  {/* Map through each item in the order */}
                                  {order.items.map((item, index) => (
                                    <>
                                      {/* Add divider between items */}
                                      {index > 0 && (
                                        <div className="h-[1px] w-full bg-gray-100/70"></div>
                                      )}
                                      {/* Individual Item Display */}
                                      <div
                                        key={index}
                                        className="relative flex items-start gap-4 md:gap-6"
                                      >
                                        {/* Product Image */}
                                        <div className="overflow-hidden rounded-[4px]">
                                          <img
                                            src={item.image}
                                            alt="Product"
                                            className="h-24 w-24 rounded-[4px] bg-gray-100 object-cover md:h-28 md:w-28 lg:h-32 lg:w-32"
                                          />
                                        </div>
                                        <span className="absolute right-0 top-1 text-[10px] font-light leading-none tracking-normal text-gray-700 md:text-[12px] md:text-[12x]">
                                          {item.price}
                                        </span>
                                        {/* Product Details */}
                                        <div className="flex flex-col gap-[2px] md:gap-0.5">
                                          {/* Product Name and Type */}
                                          <h3 className="text-[10px] font-normal tracking-normal text-gray-700 md:text-[12px] md:text-[12x]">
                                            {item.name}
                                            <span className="ml-1 font-light leading-none text-gray-600">
                                              ({item.category})
                                            </span>
                                          </h3>

                                          {/* Order Details */}
                                          <span className="text-[10px] font-light tracking-normal text-gray-600 md:text-[12px] md:text-[12x]">
                                            Dimensions:{" "}
                                            {`h ${item.dimensions.height}" × w ${item.dimensions.width}" × d ${item.dimensions.depth}"`}
                                          </span>

                                          <span className="text-[10px] font-light tracking-normal text-gray-600 md:text-[12px] md:text-[12x]">
                                            Qty: {item.quantity}
                                          </span>
                                          <div className="my-2 h-[1px] w-full bg-gray-100"></div>
                                          {/* Delivery Address */}
                                          <p className="text-[10px] font-normal tracking-normal text-gray-700 md:text-[12px] md:text-[12x]">
                                            Delivered to:
                                          </p>
                                          <span className="text-[10px] font-light tracking-normal text-gray-600 md:text-[12px] md:text-[12x]">
                                            <span>
                                              {order.shippingAddress.street},
                                            </span>
                                            <span>
                                              {order.shippingAddress.city}
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  ))}

                                  <div className="flex justify-between gap-2 font-poppins text-xs font-normal">
                                    <div className="flex max-w-[200px] items-center justify-center gap-1 md:max-w-[500px]">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={
                                          order.orderStatus ===
                                          "out_for_delivery"
                                            ? "#7dd3fc"
                                            : order.orderStatus === "shipped"
                                              ? "#fbbf24" // Tailwind's yellow-400
                                              : order.orderStatus ===
                                                  "delivered"
                                                ? "#16a34a"
                                                : order.orderStatus ===
                                                    "confirmed"
                                                  ? "#a3e635"
                                                  : "gray"
                                        }
                                        viewBox="0 0 24 24"
                                        strokeWidth={1}
                                        stroke="currentColor"
                                        className="h-4 w-4 text-white"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                        />
                                      </svg>
                                      <span
                                        className={`text-[10px] font-light tracking-wide text-gray-600 md:text-[11px] md:text-[12x]`}
                                      >
                                        <span className="text-gray-700">
                                          Order Status :{" "}
                                        </span>
                                        {/**
                                         * Formats the order status display with a localized date and time.
                                         *
                                         * @description
                                         * This code snippet handles the formatting of order status text, applying the following rules:
                                         * 1. For "pending" status:
                                         *    - Displays the status with first letter capitalized (e.g., "Pending")
                                         *    - No date is shown
                                         *
                                         * 2. For other statuses:
                                         *    - Special handling for "out_for_delivery" to display as "Out for delivery"
                                         *    - Other statuses are capitalized normally
                                         *    - Appends the status date with the following formatting:
                                         *      a. Converts the status date to a localized string
                                         *      b. Uses en-US locale for consistent formatting
                                         *      c. Displays:
                                         *         - Full month name
                                         *         - Numeric day
                                         *         - Full year
                                         *         - Hour (12-hour format)
                                         *         - Minutes
                                         *         - AM/PM indicator
                                         *
                                         * 3. Fallback mechanism:
                                         *    - If no status date is available, falls back to `order.statusdate`
                                         *
                                         * @example
                                         * // Possible outputs:
                                         * "Pending"
                                         * "Confirmed on February 8, 2024, 9:00 AM"
                                         * "Out for delivery on February 12, 2024, 2:20 PM"
                                         *
                                         * @param {Object} order - The order object containing status and dates
                                         * @returns {string} Formatted order status text with optional date
                                         */}
                                        {order.orderStatus === "pending"
                                          ? `${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}`
                                          : `${order.orderStatus === "out_for_delivery" ? "Out for delivery" : order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)} on ${
                                              order.statusDates?.[
                                                order.orderStatus
                                              ]
                                                ? new Date(
                                                    order.statusDates[
                                                      order.orderStatus
                                                    ],
                                                  ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                      month: "long",
                                                      day: "numeric",
                                                      year: "numeric",
                                                      hour: "numeric",
                                                      minute: "numeric",
                                                      hour12: true,
                                                    },
                                                  )
                                                : order.statusdate
                                            }`}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-normal tracking-normal md:gap-2 md:text-[12x] lg:text-[12px]">
                                      <button className="text-orange-500">
                                        Buy Again
                                      </button>
                                      <span className="text-orange-300">|</span>
                                      <button className="text-orange-500">
                                        View Item
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="-mx-8 h-[1px] bg-gray-100"></div>
                                <div className="mt-2 flex items-start justify-start gap-8">
                                  <Button
                                    text="View Order"
                                    size="compact"
                                    variant="filledBlackNoHover"
                                    onClick={() => handleFullOrderView(order)} //the order mapped and selected is passed to handleFullOrderView go to the function to see
                                  />

                                  <Button
                                    text="View Invoice"
                                    size="compact"
                                    variant="outlinedBlackNoHover"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Paginator
                          totalItems={orderstate.filteredOrders.length}
                          itemsPerPage={itemsPerPage}
                          currentPage={currentPage}
                          onPageChange={(page) => setCurrentPage(page)}
                        />
                        {/* Add Paginator component */}
                      </>
                    )
                    //orderhistory end
                  }
                </div>
              </div>
            ) : (
              <div className="flex h-full max-h-[calc(100vh-200px)] w-full flex-col scrollbar-thin">
                {/* Full Order Details View */}
                <div className="mb-2 flex h-fit items-center justify-between md:mb-2 lg:mb-8">
                  <div
                    className="group flex cursor-pointer items-center gap-2"
                    onClick={handleBackToOrderHistory}
                  >
                    <svg
                      className="h-4 w-4 text-gray-500 transition-colors duration-300 group-hover:text-gray-800"
                      stroke-width="1.5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      color="currentColor"
                    >
                      <path
                        d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <span className="text-[12px] font-medium tracking-wide text-gray-500 transition-colors duration-300 group-hover:text-gray-800">
                      Back
                    </span>
                  </div>
                </div>
                <div className="overflow-y-auto pr-2 scrollbar-thin">
                  <div className="space-y-12 rounded-lg border border-gray-200 bg-white p-4 md:p-6 lg:p-8">
                    {/* Order Header */}
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <h2 className="mb-1 text-[14px] font-medium text-gray-800 md:text-[18px]">
                          Order #{selectedFullOrder.orderId}{" "}
                        </h2>
                        <p className="text-[10px] text-gray-600 md:text-[12px] md:text-[12x]">
                          Placed on{" "}
                          {format(
                            new Date(selectedFullOrder.date),
                            "MMMM d, yyyy",
                          )}
                          {selectedFullOrder.orderStatus === "pending" && (
                            <span className="ml-2 text-[10px] font-light tracking-normal text-gray-500 md:text-[12px]">
                              (Your order is currently Pending and awaiting
                              confirmation)
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          text="Download Invoice"
                          size="compact"
                          variant="filledBlackNoHover"
                        />
                      </div>
                    </div>
                    {/* Log all values being passed to OrderStatusTracker */}

                    <OrderStatusTracker
                      currentOrderStatus={selectedFullOrder.orderStatus}
                      statusDates={ExtractStatusDatesFromOrder(
                        selectedFullOrder,
                      )} //use the function to extract status dates from the order array of current order
                      statusOrder={StatusOrder} //passed from orderconfig
                      orderStatuses={StatusDetails} //passed from orderconfig
                    />
                    {/* <div className="-mx-8 h-[1px] bg-gray-100"></div> */}
                    {/* Order Status Tracker */}
                    {/* Order Status Tracker */}
                    {/* Order Status Tracker */}

                    {/* Order Details Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Left Column - Order Items */}
                      <div className="space-y-6">
                        <h3 className="text-[12px] font-medium tracking-normal text-gray-700 md:text-[14px]">
                          Order Items
                        </h3>
                        {selectedFullOrder.items.map((item, index) => (
                          <div
                            key={index}
                            className="mb-4 flex items-start border-b border-gray-100 pb-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="mr-4 h-20 w-20 rounded-md bg-gray-100 object-cover md:h-24 md:w-24"
                            />
                            <div className="space-y-1">
                              <h4 className="text-[10px] font-normal text-gray-800 md:text-[12px]">
                                {item.name}
                                <span className="ml-1 text-gray-600">
                                  ({item.category})
                                </span>
                              </h4>
                              <p className="text-[10px] font-light text-gray-600 md:text-[12px]">
                                Qty: {item.quantity} | {item.price}
                              </p>
                              <p className="text-[10px] font-light text-gray-600 md:text-[12px]">
                                Dimensions:{" "}
                                {`${item.dimensions.height}" × ${item.dimensions.width}" × ${item.dimensions.depth}"`}
                              </p>
                              <p className="text-[10px] font-light text-gray-600 md:text-[12px]">
                                Material: {`${item.material}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right Column - Order Summary */}
                      <div className="flex flex-col justify-between space-y-6">
                        <div className="space-y-6">
                          <h3 className="mb-3 text-[12px] font-medium tracking-normal text-gray-700 md:text-[14px]">
                            Order Summary
                          </h3>
                          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                            {/* Subtotal */}
                            <div className="flex justify-between">
                              <span className="text-[10px] font-normal text-gray-600 md:text-[12px]">
                                Subtotal
                              </span>
                              <span className="text-[10px] text-gray-600 md:text-[12px]">
                                ${selectedFullOrder.totalAmount}
                              </span>
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between">
                              <span className="text-[10px] text-gray-600 md:text-[12px]">
                                Shipping
                              </span>
                              <span className="text-[10px] text-gray-600 md:text-[12px]">
                                {selectedFullOrder.shippingFee}
                              </span>
                            </div>

                            {/* Tax */}
                            <div className="flex justify-between">
                              <span className="text-[10px] text-gray-600 md:text-[12px]">
                                Tax (8%)
                              </span>
                              <span className="text-[10px] text-gray-600 md:text-[12px]">
                                ${selectedFullOrder.taxAmount}
                              </span>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-[10px] font-medium text-gray-800 md:text-[12px]">
                                Total
                              </span>
                              <span className="text-[10px] font-medium text-gray-800 md:text-[12px]">
                                ${selectedFullOrder.totalAmount}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="space-y-6">
                          <h3 className="text-[12px] font-medium tracking-normal text-gray-700 md:text-[14px]">
                            Shipping Information
                          </h3>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <div className="space-y-1 rounded-lg tracking-normal">
                              <p className="text-[10px] font-light text-gray-600 md:text-[12px]">
                                <span className="font-light text-gray-600">
                                  Delivery Address :
                                </span>{" "}
                                {selectedFullOrder.shippingAddress.street},
                                {selectedFullOrder.shippingAddress.city}
                              </p>

                              <p className="text-[10px] font-light text-gray-600 md:text-[12px]">
                                <span className="font-light text-gray-600">
                                  Shipping Method :
                                </span>{" "}
                                {selectedFullOrder.shippingMethod}
                              </p>
                              <p className="text-[10px] font-light text-gray-600 md:text-[12px]">
                                <span className="font-light text-gray-600">
                                  Transaction Date :
                                </span>{" "}
                                {format(
                                  new Date(selectedFullOrder.date),
                                  "MMMM d, yyyy",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <h3 className="text-[12px] font-medium leading-none tracking-normal text-gray-700 md:text-[14px]">
                            Payment Details
                          </h3>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <div className="space-y-1 rounded-lg tracking-wide">
                              <p className="text-[10px] font-light text-gray-600 md:text-[12px]">
                                <span className="font-light text-gray-600">
                                  Payment Method :
                                </span>{" "}
                                {selectedFullOrder.paymentMethod}
                              </p>
                              <p className="text-[10px] font-light text-gray-600 md:text-[12px]">
                                <span className="font-light text-gray-600">
                                  Transaction Date:
                                </span>{" "}
                                {format(
                                  new Date(selectedFullOrder.date),
                                  "MMMM d, yyyy",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      // Saved Addresses Section
      case "address":
        return (
          <div className="flex h-full max-h-[calc(100vh-200px)] w-full flex-col">
            {/* Section Header with Add Button */}
            <div className="mb-5 flex items-center justify-between md:mb-6 md:mt-0 lg:mb-7">
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] font-medium tracking-normal text-[#4D4D4D] md:text-[16px] lg:text-[20px]">
                  Saved Addresses
                </h3>
                <p className="text-[10px] font-light tracking-normal text-gray-600 md:text-[12px] md:text-[12x]">
                  Manage your saved addresses
                </p>
              </div>
              {currentUser?._id && (
                <Modal
                  title="Add New Address"
                  trigger={(props) => (
                    <Button
                      {...props}
                      //the onclick is rendered above that we passed as trigger prop
                      size="compact"
                      variant="filledBlack"
                      text={"ADD"}
                    />
                  )}
                >
                  {/* the contentin the modal is passed aa a function and rendered in model with {(closemodel)} prop we can use closemodel here in any line   */}
                  {({ closeModal }) => (
                    <div className="space-y-4">
                      {/* Name Input */}
                      <div>
                        <label className="mb-2 block text-[12px] font-light text-gray-600">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newAddress.name}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter full name"
                          className="w-full rounded-md border border-gray-300 p-2 text-[12px]"
                        />
                      </div>

                      {/* Address Type */}
                      <div className="mt-4">
                        <label className="mb-2 block text-[12px] font-light text-gray-600">
                          Address Type
                        </label>
                        <select
                          value={newAddress.type}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          className="w-full rounded-md border border-gray-300 p-2 text-[12px]"
                        >
                          <option
                            className="text-[12px] font-light"
                            value="Home"
                          >
                            Home
                          </option>
                          <option
                            className="text-[12px] font-light"
                            value="Work"
                          >
                            Work
                          </option>
                          <option
                            className="text-[12px] font-light"
                            value="Other"
                          >
                            Other
                          </option>
                        </select>
                      </div>

                      {/* Street Address */}
                      <div>
                        <label className="mb-2 block text-[12px] font-light text-gray-600">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={newAddress.street}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              street: e.target.value,
                            }))
                          }
                          placeholder="Enter street address"
                          className="w-full rounded-md border border-gray-300 p-2 text-[12px]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[12px] font-light text-gray-600">
                          landmark
                        </label>
                        <input
                          type="text"
                          value={newAddress.landmark}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              landmark: e.target.value,
                            }))
                          }
                          placeholder="Enter street address"
                          className="w-full rounded-md border border-gray-300 p-2 text-[12px]"
                        />
                      </div>

                      {/* City and State */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="mb-2 block text-[12px] font-light text-gray-600">
                            City
                          </label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            placeholder="City"
                            className="w-full rounded-md border border-gray-300 p-2 text-[12px]"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="mb-2 block text-[12px] font-light text-gray-600">
                            State
                          </label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) =>
                              setNewAddress((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            placeholder="State"
                            className="w-full rounded-md border border-gray-300 p-2 text-[12px]"
                          />
                        </div>
                      </div>

                      {/* Zip Code */}
                      <div>
                        <label className="mb-2 block text-[12px] font-light text-gray-600">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          value={newAddress.zipCode}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              zipCode: e.target.value,
                            }))
                          }
                          placeholder="Zip Code"
                          className="w-full rounded-md border border-gray-300 p-2 text-[12px]"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="mb-2 block text-[12px] font-light text-gray-600">
                          Country
                        </label>
                        <input
                          type="text"
                          value={newAddress.country}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                          placeholder="Country"
                          className="w-full rounded-md border border-gray-300 p-2 text-[12px]"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 flex justify-end gap-2">
                        <Button
                          onClick={() => closeModal()}
                          size="compact"
                          variant="filledWhiteNoHover"
                          text="Cancel"
                        />
                        <Button
                          onClick={() => {
                            // Wrap in a function that ensures both actions occur
                            const handleAdd = () => {
                              handleAddAddress();
                              closeModal();
                            };

                            handleAdd();
                          }}
                          text="Save"
                          size="compact"
                          variant="filledBlackNoHover"
                        />
                      </div>
                    </div>
                  )}
                </Modal>
              )}
            </div>

            {/* Address List Container */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              {!currentUser._id ? (
                <div className="flex h-fit w-full flex-col items-center justify-center rounded-lg bg-gray-100 px-16 py-24 text-center transition-all duration-300 ease-in-out">
                  {/* Updated Icon */}
                  <div className="mb-4">
                    <svg
                      className="h-8 w-8 text-[#9CA3AF]"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 20V19C2 15.134 5.13401 12 9 12V12"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M15.8038 12.3135C16.4456 11.6088 17.5544 11.6088 18.1962 12.3135V12.3135C18.5206 12.6697 18.9868 12.8628 19.468 12.8403V12.8403C20.4201 12.7958 21.2042 13.5799 21.1597 14.532V14.532C21.1372 15.0132 21.3303 15.4794 21.6865 15.8038V15.8038C22.3912 16.4456 22.3912 17.5544 21.6865 18.1962V18.1962C21.3303 18.5206 21.1372 18.9868 21.1597 19.468V19.468C21.2042 20.4201 20.4201 21.2042 19.468 21.1597V21.1597C18.9868 21.1372 18.5206 21.3303 18.1962 21.6865V21.6865C17.5544 22.3912 16.4456 22.3912 15.8038 21.6865V21.6865C15.4794 21.3303 15.0132 21.1372 14.532 21.1597V21.1597C13.5799 21.2042 12.7958 20.4201 12.8403 19.468V19.468C12.8628 18.9868 12.6697 18.5206 12.3135 18.1962V18.1962C11.6088 17.5544 11.6088 16.4456 12.3135 15.8038V15.8038C12.6697 15.4794 12.8628 15.0132 12.8403 14.532V14.532C12.7958 13.5799 13.5799 12.7958 14.532 12.8403V12.8403C15.0132 12.8628 15.4794 12.6697 15.8038 12.3135V12.3135Z"
                        stroke="currentColor"
                        stroke-width="1"
                      ></path>
                      <path
                        d="M15.3636 17L16.4546 18.0909L18.6364 15.9091"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M9 12C11.2091 12 13 10.2091 13 8C13 5.79086 11.2091 4 9 4C6.79086 4 5 5.79086 5 8C5 10.2091 6.79086 12 9 12Z"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>

                  {/* Title */}
                  <h2 className="mb-4 font-poppins text-[12px] font-medium tracking-[0.28px] text-[#4D4D4D] lg:text-[14px]">
                    Login to Access Your Saved Addresses
                  </h2>

                  {/* Description */}
                  <p className="mb-6 max-w-md font-poppins text-[10px] font-light leading-relaxed tracking-wider text-[#818181] md:text-[12x] lg:text-[12px]">
                    It looks like you need to log in to view and manage your
                    saved addresses. Please log in to continue.
                  </p>

                  {/* Optional Divider */}
                  <Button text="Login" variant="filledBlackNoHover" />

                  {/* Login Button */}
                </div>
              ) : state.loading.addresses ? (
                <div className="flex flex-col gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="flex animate-pulse flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:p-6 lg:p-8"
                    >
                      {/* Address Card Header with Actions */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-gray-300/60"></div>
                          <div className="h-4 w-20 rounded bg-gray-300/60"></div>
                        </div>
                        <div className="h-4 w-4 rounded-full bg-gray-300/60"></div>
                      </div>
                      {/* Address Details */}
                      <span className="flex flex-col gap-1 text-[10px] font-light leading-4 tracking-normal text-gray-600 md:text-[12px] md:text-[12x]">
                        <span className="mb-1 h-3 w-3/4 rounded bg-gray-300/60"></span>
                        <span className="mb-1 h-3 w-1/2 rounded bg-gray-300/60"></span>
                        <span className="mb-1 h-3 w-1/2 rounded bg-gray-300/60"></span>
                        <span className="h-3 w-2/3 rounded bg-gray-300/60"></span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : state.addresses.length === 0 ? (
                <div className="flex h-fit w-full flex-col items-center justify-center rounded-lg bg-gray-100 px-16 py-24 text-center transition-all duration-300 ease-in-out">
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
                    No adresses here
                  </h2>

                  <p className="mb-6 max-w-md font-poppins text-[10px] font-light leading-relaxed tracking-[0.28px] text-[#818181] md:text-[12x] lg:text-[12px]">
                    Looks like you haven't added any addresses yet. click the
                    add button to add one
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {state.addresses
                    .sort(
                      (a, b) =>
                        (b._id === state.defaultAddress?._id ? 1 : 0) -
                        (a._id === state.defaultAddress?._id ? 1 : 0),
                    )
                    .map(
                      (
                        address, //Positive result (1) → b moves up.Negative result (-1) → a moves up.Zero (0) → No movement.That’s why the default address (the one with 1) always moves to the top of the sorted list.
                      ) => (
                        <div
                          key={address._id}
                          className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:p-6 lg:p-8"
                        >
                          {/* Address Card Header with Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <label
                                className="relative flex cursor-pointer items-center rounded-full"
                                htmlFor={`address-${address._id}`}
                                data-ripple-dark="true"
                              >
                                <input
                                  id={`address-${address._id}`}
                                  type="checkbox"
                                  checked={
                                    address._id === state.defaultAddress?._id
                                  }
                                  onChange={() =>
                                    handleSetDefaultAddress(address._id)
                                  }
                                  className="border-slate-300 before:bg-slate-400 peer relative h-3 w-3 cursor-pointer appearance-none rounded border shadow transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-blue-600 checked:bg-blue-500 checked:before:bg-blue-50"
                                />
                                <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={4}
                                    stroke="currentColor"
                                    className="h-2 w-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m4.5 12.75 6 6 9-13.5"
                                    />
                                  </svg>
                                </span>
                              </label>
                              <div className="flex min-h-[24px] items-center gap-2">
                                <span className="text-[10px] font-medium leading-none tracking-wide text-gray-600 md:text-[12px] md:text-[12x]">
                                  {address.type}
                                </span>
                                {address._id === state.defaultAddress?._id && (
                                  <span className="w-fit rounded-md bg-blue-100/40 px-2 py-1 text-[10px] font-normal leading-none text-blue-600 md:text-[12x]">
                                    Current
                                  </span>
                                )}
                              </div>
                            </div>

                            <Modal
                              title="Delete Address"
                              trigger={(props) => (
                                <svg
                                  className="h-4 w-4 text-gray-600 transition-colors duration-300 hover:scale-110 hover:text-red-600"
                                  onClick={props.onClick}
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                </svg>
                              )}
                            >
                              {({ closeModal }) => (
                                <div className="space-y-4">
                                  <p className="text-[12px] font-light leading-none text-[#4D4D4D]">
                                    Are you sure you want to delete this
                                    address?
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      onClick={closeModal}
                                      size="compact"
                                      text="Cancel"
                                      variant="filledWhiteNoHover"
                                    />

                                    <Button
                                      onClick={() => {
                                        // Wrap in a function that ensures both actions occur
                                        const handleDelete = () => {
                                          handleDeleteAddress(address._id);
                                          closeModal();
                                        };

                                        handleDelete();
                                      }}
                                      size="compact"
                                      text="Delete"
                                      variant="filledBlackNoHover"
                                    />
                                  </div>
                                </div>
                              )}
                            </Modal>
                          </div>
                          {/* onClick={() => {
                                    handleDeleteAddress(address._id);
                                    closeModal();
                                  }} */}
                          {/* Address Details */}
                          <span className="flex flex-col gap-1 text-[10px] font-light leading-4 tracking-normal text-gray-600 md:text-[12px] md:text-[12x]">
                            <span className="font-normal text-[#4D4D4D]">
                              {address.name}{" "}
                            </span>

                            <span>
                              {address.street}, {address.landmark}
                            </span>
                            <span>
                              {address.city}, {address.state} {address.zipCode}
                            </span>
                            <span>{address.country}</span>
                          </span>
                        </div>
                      ),
                    )}
                </div>
              )}
            </div>
          </div>
        );

      // Default fallback content
      default:
        return <div>Profile Details Content</div>;
    }
  };

  // Main component render
  return (
    <div className="no-scrollbar mx-auto w-full bg-[#f9f9f9] px-[20px] py-[80px] font-inter lg:px-[200px] lg:py-[150px]">
      <div className="flex min-h-screen flex-col overflow-hidden rounded-[10px] border-2 border-gray-200 bg-white scrollbar-thin md:min-h-[600px] md:flex-row">
        {/* Mobile Header with Hamburger */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 tracking-normal md:hidden">
          <div className="flex items-center gap-3">
            <img
              src="../public/Images/profile.jpg"
              alt="Profile"
              className="h-[35px] w-[35px] rounded-full object-cover object-center"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-light text-gray-400 md:text-[12x]">
                welcome Back
              </span>
              <span className="font-sMedium text-[12px] text-gray-800">
                John Doe
              </span>
            </div>
          </div>
          <button onClick={toggleMobileMenu} className="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar - Slide out on mobile */}
        <nav
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r-2 border-gray-100 bg-white transition-transform duration-300 ease-in-out md:relative md:w-[180px] md:translate-x-0 lg:w-[200px] ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Desktop Profile Header */}
          <div className="border-b border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <img
                src="../public/Images/profile.jpg"
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-300 md:h-9 md:w-9"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-light text-gray-400 md:text-[12x]">
                  welcome Back
                </span>
                <span className="font-sMedium text-[12px] text-gray-800">
                  John Doe
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="space-y-1 p-4 tracking-normal md:p-3">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-[12px] font-normal ${
                  activeMenu === item.id
                    ? "bg-white text-gray-600 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)]"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="text-current">{item.icon}</span>
                <span className="ml-3">{item.label}</span>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="absolute bottom-0 w-full border-t border-gray-100 p-4">
            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] text-gray-600 transition-colors duration-300 hover:text-red-600">
              <svg
                className="tetxt-gray-600 h-4 w-4"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
              >
                <path
                  d="M19 12H12M12 12L15 15M12 12L15 9"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>

              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 bg-[#fcfcfd]">
          <div className="p-4 sm:p-6 md:p-8">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

// Log orderStatusState whenever it changes
