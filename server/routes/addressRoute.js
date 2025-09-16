const { addAddress, getAddress, updateAddress, deleteAddress } = require('../controllers/addressController')
const auth = require('../middleware/authMiddleware')

const router = require('express').Router()

router.post('/create',auth,addAddress)
router.get('/get',auth,getAddress)
router.put('/update',auth,updateAddress)
router.delete('/disable',auth,deleteAddress)

module.exports = router