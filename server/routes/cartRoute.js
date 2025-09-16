const auth = require('../middleware/authMiddleware')
const {addToCartItem, getCartItem, updateCartItemQty, deleteCartItemQty} = require('../controllers/cartController')

const router = require('express').Router()

router.post('/create',auth,addToCartItem)
router.get('/get',auth,getCartItem)
router.put('/update-qty',auth,updateCartItemQty)
router.delete('/delete-cart-item',auth,deleteCartItemQty)

module.exports = router