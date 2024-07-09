const express = require("express");
const router = express.Router();
const {  loadProducts, storeProducts } = require('../utils.js');

loadProducts();

let products = loadProducts();

router.get('/', (req, res) => {
    res.status(200).json(products);
});

router.get('/:pid', (req, res) => {
    const prodId = parseInt(req.params.pid);
    const product = products.find((product) => product.id === prodId);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ msg: "Producto buscado no se encontro" });
    }
});

router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let maxIdProds = products.reduce((max, product) => product.id > max ? product.id : max, 0 )
    if (!title || !description || !code || price <= 0 || stock <= 0 || !category){
        res.status(400).json({ msg: "error, verificar la info solicitada" })
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

    products.push(newProduct);
    storeProducts(products);
    res.status(200).json(newProduct);
    }
});

router.put('/:pid', (req, res) => {
    const prodId = parseInt(req.params.pid);
    const product = products.find((product) => product.id === prodId);

    if (product) {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.code = code ?? product.code;
        product.price = price ?? product.price;
        product.status = status ?? product.status;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;
        product.thumbnails = thumbnails ?? product.thumbnails;

        storeProducts(products);
        res.json(product);
    } else {
        res.status(404).json({ msg: `Producto buscado no se encontro` });
    }
});

router.delete('/:pid', (req, res) => {
    const prodId = parseInt(req.params.pid);
    products = products.filter((product) => product.id !== prodId);
    res.status(200).json({ msg: `El Producto con id: ${prodId}, ha sido eliminado exitodsamente` });
});

module.exports = router;