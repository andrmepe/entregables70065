const socket = io();

document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

 // Emit form data through the socket
    socket.emit('productData', data);

 // Clear the form after submitting it
    event.target.reset();
});

function addProductToList(product) {
    const productList = document.getElementById('products');
    const productItem = document.createElement('li');
    productItem.id = `product: ${product.id}`;
    productItem.innerHTML = `ID: ${product.id}, Title: ${product.title}, Description: ${product.description}, Code: ${product.code}, Price: ${product.price}, Stock: ${product.stock} 
    <button onclick="DeleteProduct(${product.id})">Delete</button>`;
    productList.appendChild(productItem);
}

function DeleteProduct(id) {
    socket.emit('DeleteProduct', { id });
}

socket.on('productDeleted', (data) => {
    const productItem = document.getElementById(`product: ${data.id}`);
    if (productItem) {
        productItem.remove();
    }
});

socket.on('productData', (data) => {
    addProductToList(data);
});