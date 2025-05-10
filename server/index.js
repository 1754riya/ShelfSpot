
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const { Pool } = require('pg');
require('dotenv').config(); // To load .env variables

// --- Environment Variable Check for PostgreSQL ---
const requiredDbEnvVars = ['PGUSER', 'PGHOST', 'PGDATABASE', 'PGPASSWORD', 'PGPORT'];
const missingDbEnvVars = requiredDbEnvVars.filter(varName => !process.env[varName]);

if (missingDbEnvVars.length > 0) {
  console.error(`\n🔴 FATAL ERROR: Missing required PostgreSQL environment variables: ${missingDbEnvVars.join(', ')}`);
  console.error("👉 Please ensure these are defined in your .env file in the project root.");
  console.error("Example .env content:");
  console.error("PGUSER=your_postgres_user");
  console.error("PGHOST=localhost");
  console.error("PGDATABASE=your_postgres_database");
  console.error("PGPASSWORD=your_postgres_password");
  console.error("PGPORT=5432\n");
  process.exit(1); // Exit if critical DB config is missing
}

console.log("✅ PostgreSQL Configuration (from .env):");
console.log(`  User: ${process.env.PGUSER}`);
console.log(`  Host: ${process.env.PGHOST}`);
console.log(`  Database: ${process.env.PGDATABASE}`);
console.log(`  Port: ${process.env.PGPORT}`);
console.log(`  Password: ${process.env.PGPASSWORD ? '[SET]' : '[NOT SET - CRITICAL!]'}\n`);
// --- End Environment Variable Check ---

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL Client Pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Function to create products table if it doesn't exist
const createProductsTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      description TEXT NOT NULL,
      image_url VARCHAR(255),
      data_ai_hint VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('✅ Products table checked/created successfully.');
  } catch (err) {
    console.error('🔴 Error creating products table:', err.stack);
    // If table creation fails, it's a significant issue, but server might still run for other routes (if any)
    // Consider if process.exit(1) is appropriate here depending on application requirements.
  }
};


// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, description, image_url AS "imageUrl", data_ai_hint AS "dataAiHint", created_at FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('🔴 Error fetching products from database:', err.stack);
    res.status(500).json({ message: 'Error fetching products from database.' });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, price, description, imageUrl, "data-ai-hint": dataAiHintValue } = req.body;

  if (!name || typeof price !== 'number' || !description) {
    return res.status(400).json({ message: 'Missing required fields: name, price, description' });
  }

  const newProductId = crypto.randomUUID();
  const finalImageUrl = imageUrl || `https://picsum.photos/seed/${newProductId}/400/300`;
  const finalDataAiHint = dataAiHintValue || name.toLowerCase().split(" ").slice(0,2).join(" ");

  const queryText = 'INSERT INTO products(id, name, price, description, image_url, data_ai_hint) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, price, description, image_url AS "imageUrl", data_ai_hint AS "dataAiHint", created_at';
  const values = [newProductId, name, price, description, finalImageUrl, finalDataAiHint];

  try {
    const result = await pool.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('🔴 Error adding product to database:', err.stack);
    res.status(500).json({ message: 'Error adding product to database.' });
  }
});

// Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});


// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 Express server listening on port ${PORT}`);
  console.log(`   Frontend should connect to: http://localhost:${PORT}/api`);
  
  // Attempt to connect to DB and create table on startup
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database successfully!');
    await createProductsTable();
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('🔴 Failed to connect to PostgreSQL database initially or create table:', err.stack);
    console.error("👉 Please double-check your PostgreSQL server is running and accessible with the credentials in .env");
    console.error("👉 The server will attempt to run, but API endpoints requiring the database will likely fail.");
    // Optionally, you might want to exit the process if DB connection is critical for startup
    // For now, we let it run so other errors can be seen, but a real app might exit:
    // process.exit(1); 
  }
  console.log("\n✨ Backend server setup complete. Waiting for requests...\n");
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔴 Shutting down server...');
  await pool.end();
  console.log('✅ PostgreSQL pool closed.');
  process.exit(0);
});
