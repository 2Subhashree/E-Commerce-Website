const CartProduct =require("../models/cartProduct");
const User = require('../models/userModel')
const Product = require("../models/productModel");

exports.addToCartItem = async(req,res)=> {
  try {
    const userId = req.userId
    const { productId, variantId } = req.body

    if (!productId || !variantId) {
      return res.status(400).json({ message: "ProductId and variantId are required", success: false })
    }

    // Find product
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false })
    }

    // Find variant inside product
    const selectedVariant = product.variants.id(variantId)   // <-- must match your product schema field
    if (!selectedVariant) {
      return res.status(404).json({ message: "Variant not found", success: false })
    }

    // Check if already in cart
    const existingCartItem = await CartProduct.findOne({
      userId,
      productId,
      "selectedVariant._id": variantId
    })

    if (existingCartItem) {
      return res.status(400).json({ message: "Item already in cart", success: false })
    }

    // Add new cart item
    const cartItem = new CartProduct({
      userId,
      productId,
      selectedVariant: {
        _id: selectedVariant._id,
        unit: selectedVariant.unit,
        price: selectedVariant.price,
        discount: selectedVariant.discount,
        stock: selectedVariant.stock
      },
      quantity: 1
    })

    const savedItem = await cartItem.save()

    await User.updateOne(
      { _id: userId },
      { $push: { shopping_cart: savedItem._id } }
    )

    return res.json({
      data: savedItem,
      message: "Item added successfully",
      success: true
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || error, success: false })
  }
}

exports.getCartItem = async(req,res) => {
  try {
    const userId = req.userId  //only login user is access

    const cartItem = await CartProduct.find({
      userId : userId     
    }).populate('productId')

    return res.json({
      data : cartItem,
      success : true
    })

  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

// update item- increase & decrease item

exports.updateCartItemQty = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, qty } = req.body;

    // validation
    if (!_id || qty === undefined) {
      return res.status(400).json({
        message: "Provide cart item _id and qty",
        success: false,
      });
    }

    // find the cart item
    const cartItem = await CartProduct.findOne({ _id, userId });
    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
        success: false,
      });
    }

    // if qty <= 0 → remove the item from cart
    if (qty <= 0) {
      await CartProduct.deleteOne({ _id, userId });
      return res.json({
        message: "Item removed from cart",
        success: true,
      });
    }

    // update qty
    cartItem.quantity = qty;
    const updated = await cartItem.save();

    return res.json({
      message: "Cart item updated successfully",
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};


// when the cart product qty is 1 after decreasing it should remove on cart
exports.deleteCartItemQty = async(req,res)=> {
  try {
    const userId = req.userId //coming from middleware
    const {_id} = req.body

    if(!_id){
      return res.status(400).json({message : "Provide _id", success : false})
    }

    const deleteCartItem = await CartProduct.deleteOne({_id : _id, userId : userId})

    return res.json({message : "Item remove", success : true, data : deleteCartItem})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}