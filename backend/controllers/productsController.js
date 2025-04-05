import { ProductDTO } from '../DTOs/productDTO.js';
import { getAllProducts, createProduct } from '../repositories/product-repo.js';

export const getProducts = async (req, res) => {
    const products = await getAllProducts();
    res.json(products);
};

export const addProduct = async (req, res) => {
    try {
        const dto = new ProductDTO(req.body);
        const product = await createProduct(dto.name);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
