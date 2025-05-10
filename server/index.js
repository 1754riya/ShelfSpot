
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Initial product data (can be replaced with a database)
let products = [
  { id: '1', name: 'Ergonomic Office Chair', price: 299.99, description: 'High-back ergonomic chair with lumbar support and adjustable armrests.', imageUrl: 'https://picsum.photos/seed/chair/400/300', "data-ai-hint": "office chair" },
  { id: '2', name: 'Modern Oak Dining Table', price: 450.00, description: 'Solid oak dining table with a minimalist design, seats 6.', imageUrl: 'https://picsum.photos/seed/table/400/300', "data-ai-hint": "dining table" },
  { id: '3', name: 'Gaming Desktop PC - Ryzen 7', price: 1200.00, description: 'Powerful gaming desktop with AMD Ryzen 7, RTX 4070, 32GB RAM.', imageUrl: 'https://picsum.photos/seed/desktop/400/300', "data-ai-hint": "gaming pc" },
  { id: '4', name: 'Latest Smartphone Pro Max', price: 999.00, description: 'Flagship smartphone with a stunning display and pro-grade camera system.', imageUrl: 'https://picsum.photos/seed/phone/400/300', "data-ai-hint": "smartphone" },
  { id: '5', name: 'Adjustable Standing Desk Lamp', price: 79.50, description: 'Modern LED desk lamp with adjustable brightness and color temperature.', imageUrl: 'https://picsum.photos/seed/desklamp/400/300', "data-ai-hint": "desk lamp" },
];

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  if (!name || typeof price !== 'number' || !description) {
    return res.status(400).json({ message: 'Missing required fields: name, price, description' });
  }

  const newProduct = {
    id: crypto.randomUUID(),
    name,
    price,
    description,
    imageUrl: imageUrl || `https://picsum.photos/seed/${crypto.randomUUID()}/400/300`, // Default image if not provided
  };
  products.unshift(newProduct); // Add to the beginning of the array
  res.status(201).json(newProduct);
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
