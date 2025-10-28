import React from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

const App = () => {
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <ProductList />
      <Cart />
    </div>
  );
};

export default App;

