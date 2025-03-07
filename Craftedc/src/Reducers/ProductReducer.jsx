import axios from "axios";
axios.defaults.baseURL = "http://localhost:5001";

export const initialProductState = {
  allProducts: [],
  topPickProducts: [],
  currentProduct: null,
  relatedProducts: [],
  loading: {
    allProducts: false,
    topPickProducts: false,
    currentProduct: false,
  },
  error: {
    allProducts: null,
    topPickProducts: null,
    currentProduct: false,
  },
};

export const productReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ALL_PRODUCTS_REQUEST":
      return {
        ...state,
        loading: {
          //set loading to true for all products
          ...state.loading,
          allProducts: true,
        },
        error: {
          //set error to null for all products
          ...state.error,
          allProducts: null,
        },
      };
    case "FETCH_ALL_PRODUCTS_SUCCESS":
      return {
        ...state,
        allProducts: action.payload,
        loading: {
          //set loading to false for all products as it is successfully fetched
          ...state.loading,
          allProducts: false,
        },
      };
    case "FETCH_ALL_PRODUCTS_FAILURE":
      return {
        ...state,
        error: {
          ...state.error,
          allProducts: action.payload,
        },
        loading: {
          //set loading to false for all products as it has failed to load
          ...state.loading,
          allProducts: false,
        },
      };

    // Top Picks Fetch Actions
    case "FETCH_TOP_PICKS_REQUEST":
      return {
        ...state,
        loading: { ...state.loading, topPicks: true },
        error: { ...state.error, topPicks: null },
      };

    case "FETCH_TOP_PICKS_SUCCESS":
      return {
        ...state,
        topPickProducts: action.payload,
        loading: { ...state.loading, topPicks: false },
      };

    case "FETCH_TOP_PICKS_FAILURE":
      return {
        ...state,
        error: {
          ...state.error,
          topPicks: action.payload,
        },
        loading: { ...state.loading, topPicks: false },
      };

    case "FETCH_PRODUCT_BY_ID_REQUEST":
      return {
        ...state,
        loading: {
          ...state.loading,
          currentProduct: true,
        },
        error: {
          ...state.error,
          currentProduct: null,
        },
      };

    case "FETCH_PRODUCT_BY_ID_SUCCESS":
      return {
        ...state,
        currentProduct: action.payload.Product || null, // Add fallback
        relatedProducts: action.payload.relatedProduct || [],
        loading: {
          ...state.loading,
          currentProduct: false,
        },
      };

    case "FETCH_PRODUCT_BY_ID_FAILURE":
      return {
        ...state,
        error: {
          ...state.error,
          currentProduct: action.payload,
        },
        loading: {
          ...state.loading,
          currentProduct: false,
        },
      };

    default:
      return state;
  }
};

export const fetchAllProducts = async (dispatch) => {
  dispatch({ type: "FETCH_ALL_PRODUCTS_REQUEST" });
  try {
    const response = await axios.get("/api/products");

    dispatch({ type: "FETCH_ALL_PRODUCTS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({
      type: "FETCH_ALL_PRODUCTS_FAILURE",
      payload: error.message,
    });
  }
};

export const fetchTopPickProducts = async (dispatch) => {
  dispatch({ type: "FETCH_TOP_PICKS_REQUEST" });
  try {
    const response = await axios.get("/api/products?tags=Top%20Picks");

    dispatch({ type: "FETCH_TOP_PICKS_SUCCESS", payload: response.data });

    return response.data;
  } catch (error) {
    dispatch({
      type: "FETCH_TOP_PICKS_FAILURE",
      payload: error.message,
    });
  }
};

export const fetchProductById = async (dispatch, productId) => {
  // Dispatch request action to set loading state
  dispatch({ type: "FETCH_PRODUCT_BY_ID_REQUEST" });
  try {
    console.log("Fetching product with ID:", productId);
    const response = await axios.get(`/api/products/${productId}`);
    // Log the entire response for debugging

    // Dispatch success action with product and related products
    dispatch({
      type: "FETCH_PRODUCT_BY_ID_SUCCESS",
      payload: {
        Product: response.data.product,
        relatedProduct: response.data.relatedProducts,
      },
    });
    // Return fetched data for potential further use
    return response.data;
  } catch (error) {
    //Detailed error handling
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch product details";

    // Dispatch failure action
    dispatch({
      type: "FETCH_PRODUCT_BY_ID_FAILURE",
      payload: {
        message: errorMessage,
        productId: productId,
      },
    });

    // Optionally log the error
    console.error("Product Fetch Error:", {
      productId,
      error: errorMessage,
    });
  }
};

// Hook for product actions
export const useProductActions = (dispatch) => {
  return {
    fetchAllProducts: () => fetchAllProducts(dispatch),
    fetchTopPickProducts: () => fetchTopPickProducts(dispatch),
    fetchProductById: (productId) => fetchProductById(dispatch, productId),
  };
};
