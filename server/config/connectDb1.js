const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

//mongodb url is not exist
if(!process.env.MONGODB_URL){
  throw new Error(
    "Please provide MONGODB_URL in the .env file"
  )
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Connect DB")
  } catch (err) {
    console.log("Mongodb connect error", err)
    process.exit(1) //stop server
  }
}

module.exports= connectDB