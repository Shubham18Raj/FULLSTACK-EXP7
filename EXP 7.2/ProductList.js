import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cartSlice";

const products = [
  { id: 1, name: "Laptop", price: 75000 },
  { id: 2, name: "Headphones", price: 2500 },
  { id: 3, name: "Smartphone", price: 30000 },
];

const ProductList = () => {
  const dispatch = useDispatch();

  return (
    <div style={{ margin: "20px" }}>
      <h2>Products</h2>
      {products.map((product) => (
        <div key={product.id} style={{
          border: "1px solid #ccc",
          margin: "10px 0",
          padding: "10px",
          borderRadius: "5px",
          width: "300px"
        }}>
          <h3>{product.name}</h3>
          <p>Price: ₹{product.price}</p>
          <button onClick={() => dispatch(addItem(product))}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

