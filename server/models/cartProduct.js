const mongoose = require('mongoose')

const cartProductSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'user',
    required: true 
  },
  productId: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'product',
    required: true 
  },
  selectedVariant: {
    _id: { type: mongoose.Schema.ObjectId, required: true }, // variant ID from product
    unit: { type: String, required: true },                  // e.g. "1kg", "500g"
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number }
  },
  quantity: { 
    type: Number, 
    default: 1 
  }
}, { timestamps: true })

const CartProduct = mongoose.model('cartProduct', cartProductSchema)
module.exports = CartProduct
