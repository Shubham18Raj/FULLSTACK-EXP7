import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Product List</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map(product => (
          <li key={product.id} style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "5px",
            width: "250px"
          }}>
            <strong>{product.name}</strong> — ₹{product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

