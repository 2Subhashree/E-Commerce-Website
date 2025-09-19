const { default: mongoose } = require("mongoose");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const CartProduct = require("../models/cartProduct");


exports.cashOnDeliveryOrder = async(req,res)=>{
  try {
    const userId = req.userId

    const { list_items, totalAmt, addressId, subTotalAmt } = req.body

    const payload = list_items.map(el => {
       const productId =
        el.productId?._id || el.productId; // ✅ handle both object & id case
      const productName =
        el.productId?.name || el.product_details?.name || "";
      const productImage =
        el.productId?.image || el.product_details?.image || [];
      return({
        userId : userId,
        orderId : `ORD-${new mongoose.Types.ObjectId()}`,
        productId : productId,
        product_details : {
          name : productName,
          image : productImage
        },
        paymentId : "",
        payment_status : "CASH ON DELIVERY",
        delivery_address : addressId,
        subTotalAmt : subTotalAmt,
        totalAmt : totalAmt,
      })
    })

    const generatedOrder = await Order.insertMany(payload)

    // remove from the cart after order successfully
    const removeCartItems =await CartProduct.deleteMany({userId : userId})
    const updateInUser = await User.updateOne({ _id : userId}, { shopping_cart : []})

    return res.json({message : "Order successfully", success : true, data : generatedOrder})

  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}