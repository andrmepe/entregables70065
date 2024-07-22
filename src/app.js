import express from "express"
import cartsRouter from "./routes/carts.router.js" 
import productsRouter from "./routes/products.ruoter.js"
import handlebars from 'express-handlebars'
import path from 'path'
import { Server } from 'socket.io';
import http from 'http';
import __dirname from './utils.js'
import viewsRouter from "./routes/views.router.js"


const app = express()
const PORT = 8081

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//configurar handlebars para leer el contenido de los endpoints

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + "/views") //TODO
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname + '/public')))

//Routers
app.use('/', viewsRouter)
app.use("/api/carts", cartsRouter)

const httpServer = http.createServer(app)

const socketServer = new Server(httpServer)

let products = []

socketServer.on('connection', socket=>{ // OPCION CA
    console.log('Nuevo cliente conectado')

    socket.on('info', data => {
        console.log(`the new data is ${data}`);
    });
// to Received product data
    socket.on('productData', data => {
        console.log('Received product data:', data);
        products.push(data); 
        socketServer.emit('productData', data); 
    });
// to Delete product
    socket.on('DeleteProduct', data => {   
        console.log('Delete product:', data);
        products = products.filter(product => product.id !== data.id);
        socketServer.emit('productDeleted', data);
    });
});

app.use("/api/products", productsRouter(socketServer));

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});