import { createContext, useContext, useReducer } from 'react';
import { cartReducer, initialState } from '../Reducers/cartReducer';

// Create the context
const CartContext = createContext();

// Create the provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Values to be provided to consumers
  const value = {
    cart: state.cart,
    dispatch,
    // Helper functions (optional but recommended)
    addToCart: (product, quantity = 1) => 
      dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } }),
    removeFromCart: (productId) => 
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId }),
    updateQuantity: (productId, quantity) => 
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } }),
    clearCart: () => 
      dispatch({ type: 'CLEAR_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook for using the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}