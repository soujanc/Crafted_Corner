import axios from "axios";
axios.defaults.baseURL = "http://localhost:5001";

export const initialKartState = {
  cart: null, //to store whole cart from payload
  cartId: null, //to store cart id from payload
  loading: false,
  deleteItemLoading: false,
  updateQuantityLoading: false,
  error: null,
};

export const kartReducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM_REQUEST":
    case "CART_GET_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "CART_UPDATE_QUANTITY_REQUEST":
      return {
        ...state,
        updateQuantityLoading: true,
        error: null,
      };

    case "CART_DELETE_ITEM_REQUEST":
      return {
        ...state,
        deleteItemLoading: true,
        error: null,
      };

    case "CART_ADD_ITEM_FAILURE":
    case "CART_GET_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CART_UPDATE_QUANTITY_FAILURE":
      return {
        ...state,
        updateQuantityLoading: false,
        error: action.payload,
      };

    case "CART_DELETE_ITEM_FAILURE":
      return {
        ...state,
        deleteItemLoading: false,
        error: action.payload,
      };

    case "CART_ADD_ITEM_SUCCESS":
      return {
        ...state,
        cart: action.payload,
        cartId: action.payload?.cartId || state.cartId,
        loading: false,
        error: null,
      };

    case "CART_GET_SUCCESS":
      return {
        ...state,
        cart: action.payload,
        cartId: action.payload?.cartId || state.cartId,
        loading: false,
        error: null,
      };

    case "CART_UPDATE_QUANTITY_SUCCESS":
      return {
        // Spread the existing state to maintain other state properties
        ...state,
        // Create a new cart object to ensure immutability
        cart: {
          // Spread existing cart properties
          ...state.cart,
          // Map through existing products to update the specific product's quantity
          products: state.cart.products.map((product) =>
            // Check if the current product matches the updated product
            // by comparing both productId and color
            product.productId === action.payload.productId &&
            product.color === action.payload.color
              ? // If matched, create a new product object with updated quantity
                {
                  ...product, // Spread existing product properties
                  quantity: action.payload.quantity, // Update the quantity
                }
              : // If not matched, return the original product unchanged
                product,
          ),
        },
        // Reset loading state
        updateQuantityLoading: false,
        // Clear any previous errors
        error: null,
      };

    case "CART_DELETE_ITEM_SUCCESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          products: state.cart.products.filter(
            (product) =>
              !(
                product.productId === action.payload.productId &&
                product.color === action.payload.color
              ),
          ),
        },
        deleteItemLoading: false,
        error: null,
      };

    default:
      return state;
  }
};
/**
 * Adds an item to the cart by making an API request and updating the cart state.
 *
 * @async
 * @function addToCart
 * @param {function} dispatch - The Redux dispatch function from useReducer
 * @param {Object} cartData - The data of the item to be added to the cart
 * @param {string} cartData.productId - Unique identifier of the product
 * @param {string} cartData.color - Color variant of the product
 * @param {number} cartData.quantity - Quantity of the product to be added
 *
 * @returns {Promise<Object>} The updated cart object
 *
 * @throws {Error} Throws an error if:
 * - The server response is invalid
 * - There's a network or server error during the request
 *
 * @example
 * // Usage in a component
 * const { addToCart } = useCratActions(dispatch);
 * try {
 *   const updatedCart = await addToCart({
 *     productId: '123',
 *     color: 'red',
 *     quantity: 2
 *   });
 * } catch (error) {
 *   console.error('Failed to add item to cart', error);
 * }
 */
export const addToCart = async (dispatch, cartData) => {
  dispatch({ type: "CART_ADD_ITEM_REQUEST" });
  try {
    const response = await axios.post("/api/cart/add-to-cart", cartData);

    if (response.data && response.data.cart) {
      dispatch({
        type: "CART_ADD_ITEM_SUCCESS",
        payload: response.data.cart,
      });
      return response.data.cart;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    dispatch({
      type: "CART_ADD_ITEM_FAILURE",
      payload: error.message || "Failed to add item to cart",
    });
  }
};

/**
 * Retrieves the cart for a given cart ID by making an API request and updating the cart state.
 *
 * @async
 * @function getCart
 * @param {function} dispatch - The Redux dispatch function from useReducer
 * @param {string} cartId - Unique identifier of the cart to retrieve
 *
 * @returns {Promise<Object>} The retrieved cart object
 *
 * @throws {Error} Throws an error if:
 * - The server response is invalid
 * - There's a network or server error during the request
 * - The cart with the given ID cannot be found
 *
 * @example
 * // Usage in a component
 * const { getCart } = useCratActions(dispatch);
 * try {
 *   const cart = await getCart('user123_cart');
 *   // Process the retrieved cart
 * } catch (error) {
 *   console.error('Failed to retrieve cart', error);
 *   // Handle cart retrieval error (e.g., show error message)
 * }
 *
 * @description
 * This function does the following:
 * 1. Dispatches a request action to indicate cart retrieval is in progress
 * 2. Makes an API call to fetch the cart by its ID
 * 3. Dispatches a success action with the retrieved cart data
 * 4. Returns the cart object for further processing
 * 5. Handles and dispatches any errors that occur during the process
 */
export const getCart = async (dispatch, cartData) => {
  dispatch({ type: "CART_GET_REQUEST" });
  try {
    const { userId, guestId } = cartData;

    if (!userId && !guestId)
      throw new Error("Either userId or guestId is required");

    const response = await axios.get(`/api/cart/get-cart`, {
      params: { userId, guestId },
    });

    if (response.data && response.data.cart) {
      dispatch({
        type: "CART_GET_SUCCESS",
        payload: response.data.cart,
      });
      return response.data.cart;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    dispatch({
      type: "CART_GET_FAILURE",
      payload: error.message || "Failed to retrieve cart",
    });
  }
};

/**
 * Updates the quantity of a specific item in the cart by making an API request.
 *
 * @async
 * @function updateCartItemQuantity
 * @param {function} dispatch - The Redux dispatch function from useReducer
 * @param {Object} quantityData - The data for updating cart item quantity
 * @param {string} quantityData.productId - Unique identifier of the product
 * @param {string} quantityData.color - Color variant of the product
 * @param {number} quantityData.quantity - New quantity of the product
 * @param {string} quantityData.cartId - Unique identifier of the cart
 * @param {string} quantityData.action - Type of quantity update ('increase' or 'decrease')
 *
 * @returns {Promise<Object>} The updated cart object
 *
 * @throws {Error} Throws an error if:
 * - The server response is invalid
 * - There's a network or server error during the request
 * - The quantity update fails
 *
 * @example
 * // Usage in a component
 * const { updateCartItemQuantity } = useCratActions(dispatch);
 * try {
 *   const updatedCart = await updateCartItemQuantity({
 *     productId: '123',
 *     color: 'red',
 *     quantity: 2,
 *     cartId: 'user_cart_123',
 *     action: 'increase'
 *   });
 *   // Process the updated cart
 * } catch (error) {
 *   console.error('Failed to update cart item quantity', error);
 *   // Handle quantity update error (e.g., show error message)
 * }
 *
 * @description
 * This function does the following:
 * 1. Dispatches a request action to indicate quantity update is in progress
 * 2. Makes an API call to update the quantity of a specific cart item
 * 3. Finds the updated product in the response
 * 4. Dispatches a success action with the updated product details
 * 5. Returns the updated cart object for further processing
 * 6. Handles and dispatches any errors that occur during the process
 */
export const updateCartItemQuantity = async (dispatch, quantityData) => {
  dispatch({ type: "CART_UPDATE_QUANTITY_REQUEST" });
  try {
    const response = await axios.put("/api/cart/update-quantity", quantityData);

    if (response.data && response.data.status === "success") {
      dispatch({
        type: "CART_UPDATE_QUANTITY_SUCCESS",
        payload: {
          productId: quantityData.productId,
          color: quantityData.color,
          quantity: response.data.cart.products.find(
            (p) =>
              String(p.productId) === String(quantityData.productId) &&
              p.color === quantityData.color,
          )?.quantity,
        },
      });
      return response.data.cart;
    } else {
      throw new Error("Failed to update cart item quantity");
    }
  } catch (error) {
    dispatch({
      type: "CART_UPDATE_QUANTITY_FAILURE",
      payload: error.message || "Error updating cart item quantity",
    });
    throw error;
  }
};
/**
 * Removes a specific item from the cart by making an API request.
 *
 * @async
 * @function deleteCartItem
 * @param {function} dispatch - The Redux dispatch function from useReducer
 * @param {Object} deleteData - The data for deleting a cart item
 * @param {string} deleteData.cartId - Unique identifier of the cart
 * @param {string} deleteData.productId - Unique identifier of the product to be deleted
 * @param {string} deleteData.color - Color variant of the product to be deleted
 *
 * @returns {Promise<Object>} The updated cart object after item deletion
 *
 * @throws {Error} Throws an error if:
 * - The server response is invalid
 * - There's a network or server error during the request
 * - The item deletion fails
 *
 * @example
 * // Usage in a component
 * const { deleteCartItem } = useCratActions(dispatch);
 * try {
 *   const updatedCart = await deleteCartItem({
 *     cartId: 'user_cart_123',
 *     productId: '456',
 *     color: 'blue'
 *   });
 *   // Process the updated cart after item removal
 * } catch (error) {
 *   console.error('Failed to delete cart item', error);
 *   // Handle item deletion error (e.g., show error message)
 * }
 *
 * @description
 * This function does the following:
 * 1. Dispatches a request action to indicate item deletion is in progress
 * 2. Makes an API call to remove a specific item from the cart
 * 3. Dispatches a success action with the deleted item's details
 * 4. Returns the updated cart object for further processing
 * 5. Handles and dispatches any errors that occur during the process
 *
 * @note
 * The deletion is based on both productId and color to handle
 * multiple variants of the same product in the cart
 */
export const deleteCartItem = async (dispatch, deleteData) => {
  dispatch({ type: "CART_DELETE_ITEM_REQUEST" });
  try {
    const response = await axios.delete("/api/cart/delete-product", {
      data: deleteData,
    });

    if (response.data && response.data.success) {
      dispatch({
        type: "CART_DELETE_ITEM_SUCCESS",
        payload: {
          productId: deleteData.productId,
          color: deleteData.color,
        },
      });
      return response.data.cart;
    } else {
      throw new Error("Failed to delete cart item");
    }
  } catch (error) {
    dispatch({
      type: "CART_DELETE_ITEM_FAILURE",
      payload: error.message || "Error deleting cart item",
    });
    throw error;
  }
};

export const useCratActions = (dispatch) => {
  return {
    addToCart: (cartData) => addToCart(dispatch, cartData),
    getCart: (cartData) => getCart(dispatch, cartData),
    updateCartItemQuantity: (quantityData) =>
      updateCartItemQuantity(dispatch, quantityData),
    deleteCartItem: (deletData) => deleteCartItem(dispatch, deletData),
  };
};
