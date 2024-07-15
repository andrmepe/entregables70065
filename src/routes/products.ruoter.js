const express = require("express");
const router = express.Router();
const {  loadProducts, storeProducts } = require('../utils.js');

// Load initial product data from file
loadProducts();

let products = loadProducts();

// Route to get all products
router.get('/', (req, res) => {
    res.status(200).json(products);
});

// Route to get a product by its ID
router.get('/:pid', (req, res) => {
    const prodId = parseInt(req.params.pid);
    const product = products.find((product) => product.id === prodId);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ msg: "Product not found" });
    }
});

router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let maxIdProds = products.reduce((max, product) => product.id > max ? product.id : max, 0 )
    if (!title || !description || !code || price <= 0 || stock <= 0 || !category){
        res.status(400).json({ msg: "Error, please check the required fields" })
    } else {
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

    // Add the new product to the list of products
    products.push(newProduct);
    storeProducts(products); // Save the updated products data to file
    res.status(200).json(newProduct);
    }
});

// Route to update a product by its ID
router.put('/:pid', (req, res) => {
    const prodId = parseInt(req.params.pid);
    const product = products.find((product) => product.id === prodId);

    if (product) {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        // Update the product details
        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.code = code ?? product.code;
        product.price = price ?? product.price;
        product.status = status ?? product.status;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;
        product.thumbnails = thumbnails ?? product.thumbnails;

        storeProducts(products); // Save the updated products data to file
        res.json(product);
    } else {
        res.status(404).json({ msg: `Product not found` });
    }
});

router.delete('/:pid', (req, res) => {
    const prodId = parseInt(req.params.pid);
    products = products.filter((product) => product.id !== prodId);
    res.status(200).json({ msg: ` Product with id: ${prodId}, has been successfully deleted` });
});

module.exports = router;