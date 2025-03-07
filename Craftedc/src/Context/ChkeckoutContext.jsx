import React, { createContext, useState, useContext } from "react";

// Create the context
const CheckoutContext = createContext();

// Provider component
export const CheckoutProvider = ({ children }) => {
  const [checkoutProductwo, setCheckoutProductwo] = useState(null);

  return (
    <CheckoutContext.Provider
      value={{ checkoutProductwo, setCheckoutProductwo }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom hook to use the checkout context
export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error(
      "useCheckoutContext must be used within a CheckoutProvider",
    );
  }
  return context;
};
