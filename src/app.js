const express = require("express")
const cartsRouter = require("./routes/carts.router.js")
const productsRouter = require("./routes/products.ruoter.js")

const app = express()
const PORT = 8080


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})