const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected', 
      error: error.message,
      serviceStatus: 'API is running but database connection failed'
    });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to fetch products',
      mockData: [
        { id: 1, name: 'Sample Product 1', description: 'This is a sample product', price: 19.99, stock: 100 },
        { id: 2, name: 'Sample Product 2', description: 'This is another sample product', price: 29.99, stock: 50 }
      ]
    });
  }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
  try {
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to fetch users',
      mockData: [
        { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'ADMIN' },
        { id: 2, email: 'user@example.com', name: 'Regular User', role: 'USER' }
      ]
    });
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
