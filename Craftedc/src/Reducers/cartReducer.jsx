// Initial state with mock data for the cart
export const initialState = {
  cart: [
    {
      id: 1,
      name: "Cita Chair",
      category: "Side Chair",
      price: 199.99,
      quantity: 1,
      color: "Black",
      image: "/Images/product1.jpg",
      dimensions: {
        height: '24"',
        width: '20"',
        depth: '22"',
      },
      weight: "15 lbs",
      material: "Wood & Metal",
      sku: "PROD-1",
      inStock: true,
    },
    {
      id: 2,
      name: "Cita Chair",
      category: "Side Chair",
      price: 199.99,
      quantity: 3,
      color: "Brown",
      image: "/Images/product1.jpg",
      dimensions: {
        height: '24"',
        width: '20"',
        depth: '22"',
      },
      weight: "15 lbs",
      material: "Wood & Metal",
      sku: "PROD-2",
      inStock: true,
    },
    {
      id: 3,
      name: "Cita Chair",
      category: "Side Chair",
      price: 199.99,
      quantity: 2,
      color: "Grey",
      image: "/Images/product1.jpg",
      dimensions: {
        height: '24"',
        width: '20"',
        depth: '22"',
      },
      weight: "15 lbs",
      material: "Wood & Metal",
      sku: "PROD-3",
      inStock: true,
    },

    // Additional mock cart items...
  ],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      // Check if item already exists in cart
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id,
      );

      console.log("Current state:", state);
      console.log("Action payload:", action.payload);
      console.log("Existing item found:", existingItem);

      if (existingItem) {
        const updatedCart = {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: item.quantity + (action.payload.quantity || 1),
                }
              : item,
          ),
        };
        console.log("Updated cart state:", updatedCart);
        return updatedCart;
      }

      const newCart = {
        ...state,
        cart: [
          ...state.cart,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ],
      };
      console.log("New cart state:", newCart);
      return newCart;

    case "REMOVE_FROM_CART":
      // Filter out item with matching id
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      // Update quantity for specific item
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case "CLEAR_CART":
      // Reset cart to empty array
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};
