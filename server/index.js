
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
  { id: '6', name: 'Wireless Noise-Cancelling Headphones', price: 199.99, description: 'Immersive sound experience with active noise cancellation and long battery life.', imageUrl: 'https://picsum.photos/seed/headphones/400/300', "data-ai-hint": "headphones audio" },
  { id: '7', name: 'Smart Coffee Maker', price: 89.00, description: 'Wi-Fi enabled coffee maker, schedule your brews from your phone.', imageUrl: 'https://picsum.photos/seed/coffeemaker/400/300', "data-ai-hint": "coffee maker" },
  { id: '8', name: 'Leather Messenger Bag', price: 120.00, description: 'Stylish and durable leather bag for laptops and daily essentials.', imageUrl: 'https://picsum.photos/seed/messengerbag/400/300', "data-ai-hint": "leather bag" },
  { id: '9', name: 'Premium Yoga Mat', price: 45.00, description: 'Eco-friendly, non-slip yoga mat for all types of practice.', imageUrl: 'https://picsum.photos/seed/yogamat/400/300', "data-ai-hint": "yoga mat" },
  { id: '10', name: 'Portable Bluetooth Speaker', price: 65.00, description: 'Compact and waterproof Bluetooth speaker with rich sound.', imageUrl: 'https://picsum.photos/seed/btspeaker/400/300', "data-ai-hint": "bluetooth speaker" },
  { id: '11', name: 'Mechanical Keyboard', price: 150.00, description: 'RGB backlit mechanical keyboard with customizable switches.', imageUrl: 'https://picsum.photos/seed/keyboard/400/300', "data-ai-hint": "mechanical keyboard" },
  { id: '12', name: '4K Ultra HD Monitor', price: 350.00, description: '27-inch 4K UHD monitor with HDR support for crisp visuals.', imageUrl: 'https://picsum.photos/seed/monitor/400/300', "data-ai-hint": "4k monitor" },
  { id: '13', name: 'Smartwatch Series X', price: 249.00, description: 'Feature-rich smartwatch with fitness tracking and notifications.', imageUrl: 'https://picsum.photos/seed/smartwatch/400/300', "data-ai-hint": "smartwatch wearable" },
  { id: '14', name: 'Bookshelf, 5-Tier', price: 90.00, description: 'Modern and sturdy 5-tier bookshelf for home or office.', imageUrl: 'https://picsum.photos/seed/bookshelf/400/300', "data-ai-hint": "bookshelf furniture" },
  { id: '15', name: 'Electric Kettle', price: 35.00, description: 'Fast-boiling electric kettle with auto shut-off feature.', imageUrl: 'https://picsum.photos/seed/kettle/400/300', "data-ai-hint": "electric kettle" }
];

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name, price, description, imageUrl, "data-ai-hint": dataAiHint } = req.body;

  if (!name || typeof price !== 'number' || !description) {
    return res.status(400).json({ message: 'Missing required fields: name, price, description' });
  }

  const newProduct = {
    id: crypto.randomUUID(),
    name,
    price,
    description,
    imageUrl: imageUrl || `https://picsum.photos/seed/${crypto.randomUUID()}/400/300`, // Default image if not provided
    "data-ai-hint": dataAiHint || name.toLowerCase().split(" ").slice(0,2).join(" ") // Default AI hint from name
  };
  products.unshift(newProduct); // Add to the beginning of the array
  res.status(201).json(newProduct);
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

