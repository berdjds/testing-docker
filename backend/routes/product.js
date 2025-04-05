import express from 'express';
const router = express.Router();
import { getProducts, addProduct } from '../controllers/productsController.js';

router.get('', getProducts);
router.post('/add', addProduct);

export default router;
