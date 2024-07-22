import { Router } from "express";
import { loadProducts, storeProducts } from "../utils.js";

const router = Router();
let products = [];

// Initial load of products asynchronously
const loadProductsData = async () => {
    products = await loadProducts();
};

loadProductsData().then(() => {
    router.get('/', (req, res) => {
        const limit = parseInt(req.query.limit, 10);
        if (Number.isInteger(limit) && limit > 0) {
            res.status(200).json(products.slice(0, limit));
        } else {
            res.status(200).json(products);
        }
    });
});

router.get('/:pid', (req, res) => {
    const prodId = parseInt(req.params.pid, 10);
    const product = products.find(product => product.id === prodId);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ msg: "Product not found" });
    }
});

const setupRouter = (io) => {
    router.post('/', async (req, res) => {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || price <= 0 || stock < 0 || !category) {
            return res.status(400).json({ msg: "Please check the product information" });
        }
        const maxIdProds = products.reduce((max, product) => Math.max(max, product.id), 0);
        const newProduct = {
            id: maxIdProds + 1,
            title,
            description,
            code,
            price,
            status: status ?? true,
            stock,
            category,
            thumbnails
        };
        products.push(newProduct);
        try {
            await storeProducts(products);
            res.status(201).json(newProduct);

            // Emit the new product event through Socket.IO
            io.emit('productData', newProduct);
        } catch (error) {
            res.status(500).json({ msg: 'Error saving the product', error: error.message });
        }
    });

    router.put('/:pid', async (req, res) => {
        const prodId = parseInt(req.params.pid, 10);
        const productIndex = products.findIndex(product => product.id === prodId);

        if (productIndex !== -1) {
            const product = products[productIndex];
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;
            product.title = title ?? product.title;
            product.description = description ?? product.description;
            product.code = code ?? product.code;
            product.price = price ?? product.price;
            product.status = status ?? product.status;
            product.stock = stock ?? product.stock;
            product.category = category ?? product.category;
            product.thumbnails = thumbnails ?? product.thumbnails;

            try {
                await storeProducts(products);
                res.json(product);

                // Emit the product update event through Socket.IO
                io.emit('productData', product);
            } catch (error) {
                res.status(500).json({ msg: 'Error updating the product', error: error.message });
            }
        } else {
            res.status(404).json({ msg: 'Product not found' });
        }
    });

    router.delete('/:pid', async (req, res) => {
        const prodId = parseInt(req.params.pid, 10);
        const productIndex = products.findIndex(product => product.id === prodId);
        if (productIndex !== -1) {
            const removedProduct = products.splice(productIndex, 1);

            try {
                await storeProducts(products);
                res.status(200).json({ msg: `Product with id: ${prodId} removed successfully` });

                // Emit the product removal event through Socket.IO
                io.emit('productRemoved', { id: prodId });
            } catch (error) {
                res.status(500).json({ msg: 'Error removing the product', error: error.message });
            }
        } else {
            res.status(404).json({ msg: 'Product not found' });
        }
    });

    return router;
};

export default setupRouter;