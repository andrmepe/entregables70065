const express = require("express");
const router = express.Router();
const { loadCarts, storeCarts } = require('../utils.js');
const path = require ('path')


loadCarts()

let carts = loadCarts();

const cartsFilePath = path.join(__dirname, '../data', 'carts.json');

router.get('/', (req, res) => {
    res.status(200).json(carts);
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find((cart) => cart.id === cartId);
    if (cart) {
        res.status(200).json(cart);
    } else {
        res.status(404).json({ msg: "Carrito no encontrado" });
    }
});

router.post('/', (req, res) => {
    const { products } = req.body;
    let maxIdCarts = 0;
    if (carts.length > 0) {
        maxIdCarts = carts.reduce((max, cart) => cart.id > max ? cart.id : max, 0);
    }
    const newCart = {
        id: maxIdCarts + 1,
        products: products || []
    };

    carts.push(newCart);
    storeCarts(carts);
    res.status(201).json(newCart);
});

router.delete('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
        return res.status(404).json({ msg: `Carrito con id: ${cartId} no encontrado` });
    }
    cart.products = cart.products.filter(product => product.id !== prodId);
    
    res.status(200).json({ msg: `Producto con id: ${prodId} eliminado del carrito con id: ${cartId} correctamente` });
    carts.push(cart.products);
    storeCarts(carts);
    
});


module.exports = router;