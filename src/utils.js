import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

// Gets the full path of the current file
const __filename = fileURLToPath(import.meta.url);

// Gets the directory where the current file is located
const __dirname = dirname(__filename);

// Definición de las rutas de archivos
const cartsFilePath = join(__dirname, '../../carts.json');
const productsFilePath = join(__dirname, '../../products.json');

// Function to initialize the carts file if it does not exist
const setupCartsFile = async () => {
    try {
        try {
            await fs.access(cartsFilePath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(cartsFilePath, JSON.stringify([]));
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Failed to initialize carts file:', error);
        throw new Error('Failed to initialize carts file.');
    }
};

// Function to load carts from the file
const loadCarts = async () => {
    try {
        await setupCartsFile();
        const data = await fs.readFile(cartsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading carts:', error);
        throw new Error('Failed to load carts.');
    }
};

// Function to save carts to the file
const storeCarts = async (carts) => {
    const data = JSON.stringify(carts, null, 2);
    try {
        await fs.writeFile(cartsFilePath, data);
    } catch (error) {
        console.error('Error saving carts:', error);
        throw new Error('Failed to save carts.');
    }
};

// Function to initialize the products file if it does not exist
const initializeProductsFile = async () => {
    try {
        try {
            await fs.access(productsFilePath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(productsFilePath, JSON.stringify([]));
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error initializing the products file:', error);
        throw new Error('Failed to initialize products file.');
    }
};

// Function to load products from the file
const loadProducts = async () => {
    try {
        await initializeProductsFile();
        const data = await fs.readFile(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading products:', error);
        throw new Error('Failed to load products.');
    }
};

// Function to save products to the file
const storeProducts = async (products) => {
    const data = JSON.stringify(products, null, 2);
    try {
        await fs.writeFile(productsFilePath, data);
    } catch (error) {
        console.error('Error saving products:', error);
        throw new Error('Failed to save products.');
    }
};

export default __dirname;
export { loadCarts, storeCarts, loadProducts, storeProducts };