import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../features/cartSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleQuantityChange = (id, qty) => {
    if (qty >= 1) {
      dispatch(updateQuantity({ id, quantity: Number(qty) }));
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "5px",
            width: "350px"
          }}>
            <h3>{item.name}</h3>
            <p>Price: ₹{item.price}</p>
            <p>
              Quantity:{" "}
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              />
            </p>
            <button onClick={() => dispatch(removeItem(item.id))}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;

