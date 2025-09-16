const { cashOnDeliveryOrder } = require('../controllers/orderController')
const auth = require('../middleware/authMiddleware')

const router = require('express').Router()

router.post("/cash-on-delivery",auth,cashOnDeliveryOrder)

module.exports = router