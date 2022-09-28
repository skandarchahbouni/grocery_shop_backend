require('dotenv').config()
const express = require("express")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const productsRouter = require('./routes/products')
const authRouter = require('./routes/auth')
const wishlistRouter = require('./routes/wishlist')
const cartRouter = require('./routes/cart')
const ordersRouter = require('./routes/orders')
const addressesRouter = require('./routes/addresses')
const accountRouter = require('./routes/account')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleWare = require('./middlewares/not-found')
const authenticationMiddleware = require('./middlewares/auth')
const uploadRouter = require('./routes/upload')

const app = express()

const corsConfig = {
    credentials: true,
    origin: true,
}


app.use('/static/images',express.static(__dirname + '/static/images'));
app.use(cors(corsConfig))

app.use(express.json())
app.use(cookieParser())


// routes 
app.use("/api/products", productsRouter)
app.use("/api/auth", authRouter)
app.use("/api/wishlist", authenticationMiddleware, wishlistRouter)
app.use("/api/cart", authenticationMiddleware, cartRouter)
app.use("/api/orders", authenticationMiddleware, ordersRouter)
app.use("/api/addresses", authenticationMiddleware, addressesRouter)
app.use("/api/account", authenticationMiddleware, accountRouter)
app.get("/api/authorization", authenticationMiddleware, (req, res) => {return res.status(204).json()}) // used to authorize routes
app.use("/api/upload", uploadRouter) // => just for help for data entry or add admin middleware  
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleWare)


// luanching the server 
const port = process.env.PORT || 8080
const start = () => {
    try {
        app.listen(port)
        console.log(`Server is running on port ${port}`)
    } catch (error) {
        console.log("Server is not listening")
    }
}

start()