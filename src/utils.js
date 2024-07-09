const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, 'data', 'carts.json');
const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Inicializar el archivo de carritos
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

// Inicializar el archivo de productos
const loadProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
        fs.writeFileSync(productsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
};

const storeProducts = (products) => {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(productsFilePath, data);
};

module.exports = {
    loadCarts,
    storeCarts,
    loadProducts,
    storeProducts
};