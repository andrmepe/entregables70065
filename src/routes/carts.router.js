import { Router } from "express";
import { loadCarts, storeCarts } from '../utils.js'

const router = Router();
let carts = [];

// Initial load of carts asynchronously
const loadCartsData = async () => {
    carts = await loadCarts();
};

loadCartsData().then(() => {
    router.get('/', (req, res) => {
        res.status(200).json(carts);
    });

    router.get('/:cid', (req, res) => {
        const cartId = parseInt(req.params.cid, 10);
        const cart = carts.find(c => c.id === cartId);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ msg: "Cart not found" });
        }
    });

    router.post('/', (req, res) => {
        const { products } = req.body;
        const maxIdCarts = carts.reduce((max, cart) => Math.max(max, cart.id), 0);
        const newCart = {
            id: maxIdCarts + 1,
            products: products || []
        };
        carts.push(newCart);
        storeCarts(carts);
        res.status(201).json(newCart);
    });

    router.post('/:cid/product/:pid', async (req, res) => {
        const cartId = parseInt(req.params.cid, 10);
        const prodId = parseInt(req.params.pid, 10);
        let quantity = parseInt(req.body.quantity, 10) || 1;

        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            return res.status(404).json({ msg: `Cart with id: ${cartId} not found` });
        }

        const productInCart = cart.products.find(product => product.id === prodId);
        if (!productInCart) {
            return res.status(404).json({ msg: `Product with id: ${prodId} not found in the cart` });
        }

        productInCart.quantity += quantity;
        try {
            await storeCarts(carts);
            res.status(200).json({ msg: `Product with id: ${prodId} updated successfully, added quantity: ${quantity}` });
        } catch (error) {
            res.status(500).json({ msg: 'Error saving changes to the cart', error: error.message });
        }
    });

    router.delete('/:cid/product/:pid', (req, res) => {
        const cartId = parseInt(req.params.cid, 10);
        const prodId = parseInt(req.params.pid, 10);
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            return res.status(404).json({ msg: `Cart with id: ${cartId} not found` });
        }
        cart.products = cart.products.filter(product => product.id !== prodId);
        storeCarts(carts);
        res.status(200).json({ msg: `Product with id: ${prodId} removed from the cart with id: ${cartId} successfully` });
    });
});

export default router;