const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());

const products = [
  { id: 1, name: "Laptop", price: 75000 },
  { id: 2, name: "Smartphone", price: 30000 },
  { id: 3, name: "Headphones", price: 2500 },
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

