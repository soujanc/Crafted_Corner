import axios from "axios";
axios.defaults.baseURL = "http://localhost:5001";

// Initial state representing the default address
export const initialAddressState = {
  addresses: [],
  defaultAddress: null,
  loading: {
    addresses: false,
    defaultAddress: false,
  },
  error: {
    addresses: null,
    defaultAddress: null,
  },
};
// Address reducer function to manage state updates based on different actions
export const addressreducer = (state, action) => {
  // Handling different action types
  switch (action.type) {
    // Case to add a new address
    case "FETCH_ADDRESSES_REQUEST":
      return {
        ...state,
        loading: {
          ...state.loading,
          addresses: true,
        },
        error: {
          ...state.error,
          addresses: null,
        },
      };

    case "FETCH_ADDRESSES_SUCCESS":
      return {
        ...state,
        addresses: action.payload,
        defaultAddress: action.payload.find((addr) => addr.isDefault) || null, //default addres updates
        loading: {
          ...state.loading,
          addresses: false,
        },
        error: {
          ...state.error,
          addresses: null,
        },
      };

    case "FETCH_ADDRESSES_FAILURE":
      return {
        ...state,
        error: {
          ...state.error,
          addresses: action.payload,
        },
        loading: {
          ...state.loading,
          addresses: false,
        },
      };
    // Case to set a specific address as the default address
    case "ADD_ADDRESS_REQUEST":
      return {
        ...state,
        loading: {
          ...state.loading,
          addresses: true,
        },
        error: {
          ...state.error,
          addresses: null,
        },
      };

    // Case to update an existing address
    case "ADD_ADDRESS_SUCCESS":
      const newAddresses = [...state.addresses, action.payload];
      return {
        ...state,
        addresses: newAddresses,
        defaultAddress: action.payload.isDefault
          ? action.payload
          : state.defaultAddress,
        loading: {
          ...state.loading,
          addresses: false,
        },
      };

    case "ADD_ADDRESS_FAILURE":
      return {
        ...state,
        error: {
          ...state.error,
          addresses: action.payload,
        },
        loading: {
          ...state.loading,
          addresses: false,
        },
      };
    case "SET_DEFAULT_ADDRESS_REQUEST":
      return {
        ...state,
        loading: {
          ...state.loading,
          defaultAddress: true,
        },
        error: {
          ...state.error,
          defaultAddress: null,
        },
      };
    case "SET_DEFAULT_ADDRESS_SUCCESS":
      return {
        ...state,
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === action.payload.id,
        })),
        defaultAddress: action.payload,
        loading: {
          ...state.loading,
          defaultAddress: false,
        },
      };
    case "SET_DEFAULT_ADDRESS_FAILURE":
      return {
        ...state,
        error: {
          ...state.error,
          defaultAddress: action.payload,
        },
        loading: {
          ...state.loading,
          defaultAddress: false,
        },
      };

    // Delete Address
    case "DELETE_ADDRESS_REQUEST":
      return {
        ...state,
        loading: {
          ...state.loading,
          addresses: true,
        },
        error: {
          ...state.error,
          addresses: null,
        },
      };

    case "DELETE_ADDRESS_SUCCESS":
      return {
        ...state,
        addresses: state.addresses.filter(
          (address) => address.id !== action.payload.id,
        ),
        defaultAddress: state.addresses.find((addr) => addr.isDefault) || null,
        loading: {
          ...state.loading,
          addresses: false,
        },
      };

    case "DELETE_ADDRESS_FAILURE":
      return {
        ...state,
        error: {
          ...state.error,
          addresses: action.payload,
        },
        loading: {
          ...state.loading,
          addresses: false,
        },
      };

    // Default case if the action type doesn't match any known action types
    default:
      return state; // Return the current state unchanged
  }
};

// async action creators

export const fetchAddresses = async (dispatch, userId) => {
  dispatch({ type: "FETCH_ADDRESSES_REQUEST" });
  try {
    const response = await axios.get(`/api/address?userId=${userId}`);
    console.log("Response Data for addresses:", response.data);
    dispatch({
      type: "FETCH_ADDRESSES_SUCCESS",
      payload: response.data.addresses,
    });
    return response.data.addresses;
  } catch (error) {
    dispatch({
      type: "FETCH_ADDRESSES_FAILURE",
      payload: error.message,
    });
  }
};

export const addAddress = async (dispatch, addressData) => {
  dispatch({ type: "ADD_ADDRESS_REQUEST" });
  try {
    const response = await axios.post("/api/address", addressData);
    dispatch({
      type: "ADD_ADDRESS_SUCCESS",
      payload: response.data.address,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: "ADD_ADDRESS_FAILURE",
      payload: error.message,
    });
  }
};

export const setDefaultAddress = async (dispatch, addresData) => {
  dispatch({ type: "SET_DEFAULT_ADDRESS_REQUEST" });
  const { addressId, userId } = addresData;
  console.log("Address ID for setDefaultAddress:", addressId);
  console.log("User ID for setDefaultAddress:", userId);
  try {
    const response = await axios.put("/api/address/setdefault", {
      addressId,
      userId,
    });
    console.log("Response Data for setDefaultAddress:", response.data);
    dispatch({
      type: "SET_DEFAULT_ADDRESS_SUCCESS",
      payload: response.data.address,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: "SET_DEFAULT_ADDRESS_FAILURE",
      payload: error.message,
    });
  }
};

export const deleteAddress = async (dispatch, addressId) => {
  dispatch({ type: "DELETE_ADDRESS_REQUEST" });
  try {
    const response = await axios.delete(`/api/address/${addressId}`);
    dispatch({
      type: "DELETE_ADDRESS_SUCCESS",
      payload: { id: addressId },
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: "DELETE_ADDRESS_FAILURE",
      payload: error.message,
    });
  }
};

// Hook for address actions
export const useAddressActions = (dispatch) => {
  return {
    fetchAddresses: (userId) => fetchAddresses(dispatch, userId),
    addAddress: (addressData) => addAddress(dispatch, addressData),
    setDefaultAddress: (addressData) =>
      setDefaultAddress(dispatch, addressData),
    deleteAddress: (addressId) => deleteAddress(dispatch, addressId),
  };
};
