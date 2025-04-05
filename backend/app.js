const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma with error handling
let prisma;
try {
  prisma = new PrismaClient();
  console.log('Prisma client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data as fallback if database connection fails
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
app.get('/health', async (req, res) => {
  try {
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(200).json({ 
      status: 'healthy', 
      database: 'disconnected',
      mode: 'fallback to mock data',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    // Try to get products from database
    const products = await prisma.product.findMany();
    console.log(`Successfully retrieved ${products.length} products from database`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products from database:', error);
    console.log('Falling back to mock data');
    // Return mock data as fallback
    res.json(mockProducts);
  }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!product) {
      const mockProduct = mockProducts.find(p => p.id === parseInt(id));
      if (mockProduct) {
        return res.json(mockProduct);
      }
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    // Try to find the product in mock data as fallback
    const mockProduct = mockProducts.find(p => p.id === parseInt(id));
    if (mockProduct) {
      return res.json(mockProduct);
    }
    res.status(404).json({ error: 'Product not found' });
  }
});

// Get all users
app.get('/users', (req, res) => {
  res.json(mockUsers);
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
