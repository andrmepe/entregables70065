const fs = require('fs');
const path = require('path');

// Define file paths for cart and product data
const cartsFilePath = path.join(__dirname, 'data', 'carts.json');
const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Cart file operations

// Load carts data from file, create the file if it doesn't exist
const loadCarts = () => {
    if (!fs.existsSync(cartsFilePath)) {
        fs.writeFileSync(cartsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    return JSON.parse(data);
};

const storeCarts = (carts) => {
    const data = JSON.stringify(carts, null, 2);
    fs.writeFileSync(cartsFilePath, data);
};

// Product file operations

// Load products data from file, create the file if it doesn't exist
const loadProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
        fs.writeFileSync(productsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
};

// Store products data to file
const storeProducts = (products) => {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(productsFilePath, data);
};

// Export functions for external use
module.exports = {
    loadCarts,
    storeCarts,
    loadProducts,
    storeProducts
};