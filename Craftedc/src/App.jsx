import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Homepage from "./Pages/Homepage";
import ProductDet from "./Pages/ProductDet";
import CartPage from "./Pages/CartPage";
import Profile from "./Pages/Profile";
import CheckoutPage from "./Pages/CheckoutPage";
import ExampleCompnent from "./Pages/ExampleCompnent";
import LoginPage from "./Pages/LoginPage";
import Futer from "./components/footer/Futer";
//tester files
import Karttest from "./Tester_files/Karttest";
import OrderTester from "./Tester_files/OrderTester";
import AuthTest from "./Tester_files/AuthTest";
//tester files
import OrderCodSucces from "./Pages/OrderCodSucces";
import { CartProvider } from "./Context/CartContext";
import { CheckoutProvider } from "./Context/ChkeckoutContext";
import { UserAuthProvider } from "./Context/AuthContext";
import UseStripeStore from "./Store/UseStripeStore";
import OrdrSuccess from "./Pages/OrdrSuccess";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <UserAuthProvider>
    <CheckoutProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/productdetails/:id" element={<ProductDet />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout/:productId?" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/futer" element={<Futer />} />
            <Route path="/karttest" element={<Karttest />} />
            <Route path="/ordertest" element={<OrderTester />} />
            <Route path="/authtest" element={<AuthTest />} />
            <Route path="/success" element={<SuccessWithStripe />} />
            <Route path="/example" element={<ExampleCompnent />} />
            <Route
              path="/ordercodsuccess/:orderId"
              element={<OrderCodSucces />}
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </CheckoutProvider>
    </UserAuthProvider>
  );
}

const SuccessWithStripe = () => {
  const { clientSecret } = UseStripeStore();

  const stripePromise = loadStripe(
    "pk_test_51QlthVHjzz3ZRfG0n0KXWztCyV1ex5Hbrc6ZQEPTaOZjiOMamm5CsHxqSqhsNGswozqKgS9ENIo9MZQGRoufr4yz00h5i8b9ai",
  );

  useEffect(() => {
    console.log("The client secret is:", clientSecret);
  }, [clientSecret]);

  return (
    <>
      {!clientSecret ? (
        <div>Loading...</div>
      ) : (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <OrdrSuccess />
        </Elements>
      )}
    </>
  );
};

export default App;
