import React from "react";
import axios from "axios";

function Checkout() {
  const handleCheckout = async () => {
    try {
      const response = await axios.post("/api/create-checkout-session");
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("Checkout URL not provided");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <>
      <h1>Checkout</h1>
      <button onClick={handleCheckout}>Checkout</button>
    </>
  );
}

export default Checkout;
