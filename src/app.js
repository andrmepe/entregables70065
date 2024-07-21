const express = require("express")
const cartsRouter = require("./routes/carts.router.js")
const productsRouter = require("./routes/products.ruoter.js")
import handlebars from 'express-handlebars'
import path from 'path'
import { Server } from 'socket.io';
// import http from 'http';
import __dirname from './utils.js'
import viewsRouter from "./routes/views.router.js"


const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//configurar handlebars para leer el contenido de los endpoints

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + "/views") //TODO
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname + '/public')))

// Routers
app.use('/', viewsRouter)
app.use("/api/carts", cartsRouter)

const httpServer = app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`)) // OPCION CA

const socketServer = new Server(httpServer)

let products = []

socketServer.on('connection', socketServer=>{ // OPCION CA
    console.log('Nuevo cliente conectado')

    socket.on('info', data => {
        console.log(`the new data is ${data}`);
    });

    socket.on('productData', data => {
        console.log('Product information acquired:', data);
        products.push(data); 
        socketServer.emit('productData', data); 
    });

    socket.on('removeProduct', data => {   //OPCION CA
        console.log('Delete product:', data);
        products = products.filter(product => product.id !== data.id);
        socketServer.emit('productRemoved', data);
    });
});

app.use("/api/products", productsRouter(socketServer));