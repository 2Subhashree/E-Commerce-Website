const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const connectDB  = require('./config/connectDb1.js')
const userRoute = require('./routes/userRoute.js')
const categoryRoute = require("./routes/categoryRoute.js")
const uploadRouter = require("./routes/uploadRoute.js")
const subCategoryRouter = require("./routes/subCategoryRoute.js")
const productRouter = require('./routes/productRoute.js')
const cartRoute = require('./routes/cartRoute.js')
const addressRoute = require('./routes/addressRoute.js')
const orderRoute = require('./routes/orderRoute.js')


const app = express()
// const allowedOrigins = [
//   process.env.FRONTEND_URL,
//   'http://192.168.185.131:5173' // <-- Replace this with your actual IP
// ];

//cors middleware
app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  origin: process.env.FRONTEND_URL || 'http://192.168.185.131:5173/',
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  // origin: (origin, callback) => {
  //   if (!origin || allowedOrigins.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('CORS not allowed'));
  //   }
  // },
  // credentials: true
  
}));
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
  crossOriginResourcePolicy : false //when we use front and backend in different domain it will show the error that's why i use
}))

const PORT = 8000 || process.env.PORT

app.get('/', (req, res) => {
  res.send("Server Started")
})

app.use('/api/user', userRoute)
app.use('/api/category',categoryRoute)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use('/api/product', productRouter)
app.use("/api/cart", cartRoute)
app.use('/api/address', addressRoute)
app.use('/api/order', orderRoute)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

