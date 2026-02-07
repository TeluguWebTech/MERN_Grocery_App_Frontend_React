import React, { useEffect, useState } from "react";
import axios from "axios";
import { cartUrl, imageUrl } from "../repo/api_path";

const Invoice = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("userToken");

    try {
      const res = await axios.get(`${cartUrl}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data.cart);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <h3>Loading invoice...</h3>;
  if (!cart || cart.items.length === 0)
    return <h3>No items for checkout</h3>;

  // 🧮 Calculations
  const subTotal = cart.items.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + item.product.price * item.quantity;
  }, 0);

  const tax = Math.round(subTotal * 0.05); // 5% GST
  const deliveryCharge = subTotal > 500 ? 0 : 40;
  const finalAmount = subTotal + tax + deliveryCharge;

  return (
    <div className="invoiceContainer">
      <h2>🧾 Invoice</h2>

      {cart.items.map((item) => {
        if (!item.product) return null;

        return (
          <div className="invoiceItem" key={item._id}>
            <img
              src={`${imageUrl}${item.product.image}`}
              alt={item.product.name}
              width="70"
            />

            <div className="invoiceDetails">
              <h4>{item.product.name}</h4>
              <p>
                Rs {item.product.price} × {item.quantity}
              </p>
              <strong>
                Rs {item.product.price * item.quantity}
              </strong>
            </div>
          </div>
        );
      })}

      <hr />

      <div className="invoiceSummary">
        <p>Subtotal: <span>Rs {subTotal}</span></p>
        <p>GST (5%): <span>Rs {tax}</span></p>
        <p>Delivery: <span>Rs {deliveryCharge}</span></p>
        <h3>Total Payable: Rs {finalAmount}</h3>
      </div>

      <button className="checkoutBtn">
        Place Order
      </button>
    </div>
  );
};

export default Invoice;
