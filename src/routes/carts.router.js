const express = require("express");
const router = express.Router();
const { loadCarts, storeCarts } = require('../utils.js');
const path = require ('path')

// Load initial cart data from file
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
        res.status(404).json({ msg: "Sorry, cart not found" });
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

    // Add the new cart to the list of carts
    carts.push(newCart);
    storeCarts(carts); // Save the updated carts data to file
    res.status(201).json(newCart);
});

// Route to delete a product from a cart by cart ID and product ID
router.delete('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
        return res.status(404).json({ msg: `Cart id: ${cartId} not found` });
    }
    cart.products = cart.products.filter(product => product.id !== prodId);
    
    res.status(200).json({ msg: `Product with id: ${prodId} has been successfully removed from cart id: ${cartId} ` });
    carts.push(cart.products);
    storeCarts(carts);
    
});


module.exports = router;