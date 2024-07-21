import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

// Obtiene la ruta completa del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtiene el directorio donde se encuentra el archivo actual
const __dirname = dirname(__filename);

// Definición de las rutas de archivos
const cartsFilePath = join(__dirname, '../../carts.json');
const productsFilePath = join(__dirname, '../../products.json');

// Función para inicializar el archivo de carritos si no existe
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

// Función para cargar los carritos desde el archivo
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

// Función para guardar los carritos en el archivo
const storeCarts = async (carts) => {
    const data = JSON.stringify(carts, null, 2);
    try {
        await fs.writeFile(cartsFilePath, data);
    } catch (error) {
        console.error('Error saving carts:', error);
        throw new Error('Failed to save carts.');
    }
};

// Función para inicializar el archivo de productos si no existe
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

// Función para cargar los productos desde el archivo
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

// Función para guardar los productos en el archivo
const storeProducts = async (products) => {
    const data = JSON.stringify(products, null, 2);
    try {
        await fs.writeFile(productsFilePath, data);
    } catch (error) {
        console.error('Error saving products:', error);
        throw new Error('Failed to save products.');
    }
};

export { 
    __dirname, 
    loadCarts, 
    storeCarts, 
    loadProducts, 
    storeProducts };