import axios from "axios";
import { parse, differenceInDays } from "date-fns";
axios.defaults.baseURL = "http://localhost:5001";

export const initialOrderState = {
  order: null, //to store order from payload
  loading: false,
  filteredOrders: null, //to store filtered orders
  error: null,
};
/**
 * Reducer function for managing order-related state in the application.
 *
 * @param {Object} state - The current state of the order reducer.
 * @param {Object} action - The dispatched action object.
 * @param {string} action.type - The type of action to be performed.
 * @param {*} action.payload - The data payload associated with the action.
 *
 * @returns {Object} The new state after processing the action.
 *
 * Supported action types:
 * - STORE_ORDER_DATA: Stores order data before sending
 * - ORDER_CREATE_REQUEST: Initiates order creation process
 * - ORDER_CREATE_SUCCESS: Handles successful order creation
 * - ORDER_CREATE_FAILURE: Handles order creation failure
 * - ORDER_UPDATE_PAYMENT_REQUEST: Initiates payment update process
 * - ORDER_UPDATE_PAYMENT_SUCCESS: Handles successful payment update
 * - ORDER_UPDATE_PAYMENT_FAILURE: Handles payment update failure
 */
// Order reducer function
export const orderReducer = (state, action) => {
  switch (action.type) {
    case "STORE_ORDER_DATA": // Action to store orderData before sending
      console.group("Order Data Storage");
      console.log(
        "Storing Order Data:",
        JSON.stringify(action.payload, null, 2),
      );
      return {
        ...state,
        orderDataObj: action.payload,
      };

    case "ORDER_CREATE_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "ORDER_CREATE_SUCCESS":
      return {
        ...state,
        order: action.payload,
        loading: false,
        error: null,
      };

    case "ORDER_CREATE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // New actions for updating payment status
    case "ORDER_UPDATE_PAYMENT_REQUEST":
      return { ...state, loading: true, error: null };

    case "ORDER_UPDATE_PAYMENT_SUCCESS":
      return { ...state, order: action.payload, loading: false, error: null };

    case "ORDER_UPDATE_PAYMENT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // Add these action types and actions
    case "FETCH_ORDERS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_ORDERS_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        filteredOrders: action.payload, // Note the plural 'orders'
        loading: false,
        error: null,
      };

    case "FETCH_ORDERS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "SORT_ORDERS": {
      const { filter } = action.payload;

      if (!state.orders || state.orders.length === 0) {
        return state;
      }

      const sortedOrders = [...state.orders].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Most recent first
      });

      if (filter === "all") {
        return {
          ...state,
          filteredOrders: sortedOrders, // ✅ Store in filteredOrders
        };
      }

      const filteredOrders = sortedOrders.filter((order) => {
        const orderDate = new Date(order.date);
        const currentDate = new Date();

        if (!orderDate || isNaN(orderDate)) {
          console.error(`Invalid date format: ${order.date}`);
          return false;
        }

        const daysDifference = differenceInDays(currentDate, orderDate);

        const dateMatch =
          (filter === "last7Days" && daysDifference <= 7) ||
          (filter === "lastMonth" && daysDifference <= 30) ||
          (filter === "last3Months" && daysDifference <= 90) ||
          (filter === "last6Months" && daysDifference <= 180);

        const statusMatch =
          (filter === "delivered" && order.orderStatus === "delivered") ||
          (filter === "shipped" && order.orderStatus === "shipped") ||
          (filter === "out_for_delivery" &&
            order.orderStatus === "out_for_delivery") ||
          (filter === "pending" && order.orderStatus === "pending") ||
          (filter === "confirmed" && order.orderStatus === "confirmed");

        if (
          [
            "delivered",
            "shipped",
            "out_for_delivery",
            "pending",
            "confirmed",
          ].includes(filter)
        ) {
          return statusMatch;
        }
        if (
          ["last7Days", "lastMonth", "last3Months", "last6Months"].includes(
            filter,
          )
        ) {
          return dateMatch;
        }
        return statusMatch && dateMatch;
      });

      return {
        ...state,
        filteredOrders, // ✅ Store filtered list separately
      };
    }

    default:
      return state;
  }
};

/**
 * Creates a new order by sending a POST request to the server.
 * This action triggers the "ORDER_CREATE_REQUEST" action type, which
 * sets the loading state to true. If the request is successful, it
 * triggers the "ORDER_CREATE_SUCCESS" action type, which sets the
 * loading state to false and stores the order data in the state.
 * If the request fails, it triggers the "ORDER_CREATE_FAILURE" action
 * type, which sets the loading state to false and stores the error
 * message in the state.
 * @function createorder
 * @param {function} dispatch - Redux dispatch function
 * @param {Object} orderData - Order data to be sent in the request body
 * @returns {Promise} Resolves with the newly created order data
 */
export const createorder = async (dispatch, orderData) => {
  dispatch({ type: "ORDER_CREATE_REQUEST" });
  try {
    const response = await axios.post("/api/orders", orderData);

    if (response.data && response.data.order) {
      dispatch({ type: "ORDER_CREATE_SUCCESS", payload: response.data.order });
      return response.data.order; //returned order to be used in frontend
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    //if failedcatch and dispatch
    dispatch({
      type: "ORDER_CREATE_FAILURE",
      payload: error.message || "Failed to create order",
    });
  }
};

/**
 * Updates the payment status of an existing order.
 *
 * This asynchronous function sends a PATCH request to update the payment status
 * of a specific order. It manages the entire update process through Redux actions:
 * - Dispatches "ORDER_UPDATE_PAYMENT_REQUEST" when the update begins
 * - Dispatches "ORDER_UPDATE_PAYMENT_SUCCESS" if the update is successful
 * - Dispatches "ORDER_UPDATE_PAYMENT_FAILURE" if the update fails
 *
 * @async
 * @function updateOrderPaymentStatus
 * @param {function} dispatch - The Redux dispatch function to update the state.
 * @param {string} orderId - The unique identifier of the order to update.
 * @param {string} status - The new payment status to be set for the order.
 *
 * @returns {Promise<Object>} A promise that resolves to the updated order data if successful.
 * @throws {Error} Throws an error if the payment status update fails.
 *
 * @example
 * // Example usage in a component
 * updateOrderPaymentStatus(dispatch, 'order123', 'paid')
 *   .then(updatedOrder => console.log(updatedOrder))
 *   .catch(error => console.error(error));
 */
export const updateOrderPaymentStatus = async (dispatch, orderId, status) => {
  dispatch({ type: "ORDER_UPDATE_PAYMENT_REQUEST" });
  try {
    const response = await axios.patch(`/api/orders/update-status`, {
      orderId,
      status,
    });

    if (response.data && response.data.success) {
      dispatch({
        type: "ORDER_UPDATE_PAYMENT_SUCCESS",
        payload: response.data.order,
      });
      return response.data.order;
    } else {
      throw new Error("Failed to update payment status");
    }
  } catch (error) {
    dispatch({
      type: "ORDER_UPDATE_PAYMENT_FAILURE",
      payload: error.message || "Error updating payment status",
    });
  }
};

/**
 * Custom hook that provides a centralized set of order-related actions.
 *
 * This hook encapsulates order-related dispatching functions, making it easier
 * to perform order operations across different components. It abstracts away
 * the direct dispatch calls and provides a clean, consistent interface for
 * order-related actions.
 *
 * @function useOrderActions
 * @param {function} dispatch - The Redux dispatch function used to trigger state updates.
 *
 * @returns {Object} An object containing order-related action methods:
 * @returns {function} return.createorder - Creates a new order with the given order data.
 * @returns {function} return.storeOrderData - Stores order data in the application state.
 * @returns {function} return.updateOrderPaymentStatus - Updates the payment status of an existing order.
 *
 * @example
 * // In a functional component using Redux
 * const MyComponent = () => {
 *   const [state, dispatch] = useReducer(orderReducer, initialState);
 *   const { createorder, storeOrderData, updateOrderPaymentStatus } = useOrderActions(dispatch);
 *
 *   const handleOrderCreation = async () => {
 *     const newOrder = await createorder(orderData);
 *   };
 * }
 */
export const fetchOrders = async (dispatch, userData) => {
  dispatch({ type: "FETCH_ORDERS_REQUEST" });
  try {
    const { userId, guestId } = userData;
    if (!userId && !guestId)
      throw new Error("Either userId or guestId is required");
    const response = await axios.get("/api/orders/get-orders", {
      params: { userId, guestId },
    });
    if (response.data && response.data.orders) {
      dispatch({ type: "FETCH_ORDERS_SUCCESS", payload: response.data.orders });
      return response.data.orders;
    } else {
      throw new Error("Failed to fetch orders");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    dispatch({
      type: "FETCH_ORDERS_FAILURE",
      payload: error.message || "Failed to fetch orders",
    });
  }
};

export const sortOrder = async (dispatch, filter) => {
  dispatch({
    type: "SORT_ORDERS",
    payload: { filter },
  });
};

export const useOrderActions = (dispatch) => {
  return {
    createorder: (orderData) => createorder(dispatch, orderData),
    updateOrderPaymentStatus: (orderId, status) =>
      updateOrderPaymentStatus(dispatch, orderId, status),
    fetchOrders: (userData) => fetchOrders(dispatch, userData),
    sortOrder: (filter) => sortOrder(dispatch, filter),
  };
};
