const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data
const mockProducts = [
  { 
    id: 1, 
    name: 'Product 1', 
    description: 'This is the first product description. It features high quality materials and craftsmanship.', 
    price: 19.99, 
    stock: 100 
  },
  { 
    id: 2, 
    name: 'Product 2', 
    description: 'This is the second product description. Perfect for everyday use and very durable.', 
    price: 29.99, 
    stock: 50 
  },
  { 
    id: 3, 
    name: 'Product 3', 
    description: 'This is the third product description. Our premium offering with additional features.', 
    price: 39.99, 
    stock: 25 
  }
];

const mockUsers = [
  { 
    id: 1, 
    email: 'admin@example.com', 
    name: 'Admin User', 
    role: 'ADMIN', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: 2, 
    email: 'user@example.com', 
    name: 'Regular User', 
    role: 'USER', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    version: '1.0.0',
    mode: 'mock data',
    timestamp: new Date().toISOString()
  });
});

// Get all products
app.get('/products', (req, res) => {
  res.json(mockProducts);
});

// Get a single product by ID
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Get all users
app.get('/users', (req, res) => {
  res.json(mockUsers);
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
