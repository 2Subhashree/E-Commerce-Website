const CartProduct =require("../models/cartProduct");
const User = require('../models/userModel')
const Product = require("../models/productModel");

exports.addToCartItem = async(req,res)=> {
  try {
    const userId = req.userId
    const { productId, size, color } = req.body

    if (!productId || !size || !color) {
      return res.status(400).json({ message: "ProductId, size and color are required", success: false })
    }

    // Find product
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false })
    }

    // Find variant inside product
    const sizeVariant = product.variants.get(size)
    if(!sizeVariant){
      return res.status(404).json({message : `Size ${size} not fount`, success : false})
    }

    const colorVariant = sizeVariant.colors.get(color)
    if(!colorVariant){
      return res.status(404).json({message : `Color ${color} not fount`, success : false})
    }

    // Check if already in cart
    const existingCartItem = await CartProduct.findOne({
      userId,
      productId,
      "selectedVariant.size": size,
      "selectedVariant.color": color
    })

    if (existingCartItem) {
      return res.status(400).json({ message: "Item already in cart", success: false })
    }

    // Add new cart item
    const cartItem = new CartProduct({
      userId,
      productId,
      selectedVariant: {
        size,
        color,
        price: colorVariant.price,
        discount: colorVariant.discount,
        stock: colorVariant.stock
      },
      quantity: 1
    })

    const savedItem = await cartItem.save()

    // update user shoping cart references
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
    const userId = req.userId; // only logged-in user can access

    const cartItems = await CartProduct.find({ userId })
      .populate({
        path: "productId",
        select: "_id name image category subCategory"
      })
      .lean();

    // Filter out items with deleted/missing products
    const formattedCart = cartItems
      .filter(item => item.productId) // keep only valid products
      .map(item => {
        const product = item.productId;

        return {
          _id: item._id,
          quantity: item.quantity,
          product: {
            _id: product._id,
            name: product.name,
            image: product.image?.[0] || "",
            category: product.category || [],
            subCategory: product.subCategory || []
          },
          variant: {
            size: item.selectedVariant?.size || "",
            color: item.selectedVariant?.color || "",
            price: item.selectedVariant?.price || 0,
            discount: item.selectedVariant?.discount || 0
          }
        };
      });

    return res.json({
      success: true,
      data: formattedCart
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false
    });
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
    const cartItem = await CartProduct.findOne({ _id, userId }).populate('productId');
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

      // ✅ Check stock availability before updating
    const availableStock = cartItem.selectedVariant?.stock || 0;
    if (qty > availableStock) {
      return res.status(400).json({
        message: `Only ${availableStock} items available in stock`,
        success: false,
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