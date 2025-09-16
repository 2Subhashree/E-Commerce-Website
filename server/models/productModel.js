const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
  name: {type: String},
  image: {type: Array, default: []},
  category: [{type: mongoose.Schema.ObjectId, ref: 'category'}],
  subCategory: [
    {type: mongoose.Schema.ObjectId, ref: 'subCategory'}
  ],

  // multiple units with stock and price- variants (color + unit/size) using json object
  variants : {
    type: Map,
    of : new mongoose.Schema(
      {
        colors : {
          type : Map,
          of : new mongoose.Schema(
            {
              price : {type : Number},
              stock : {type : Number},
              discount : {type : Number, default : null},
            },
            {_id : false}
          ),
          default : {},
        },
      },
      {_id : false},
    ),
    default : {},
  },
  // unit: {type : String},
  // price: {type : Number},
  // stock: {type : Number},
  // discount : {type: Number, default: null},
  description : {type : String, default: ""},
  more_details : {type: Object, default: {}},
  publish : {type: Boolean, default: true}
}, {timestamps: true})

// create a text index
productSchema.index({
  name : "text",
  description : "text"
}, {
  name : 10,
  description : 5
})

const Product = mongoose.model('product', productSchema)
module.exports = Product