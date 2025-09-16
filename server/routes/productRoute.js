const { createProduct, getProduct, deleteProduct, getProductByCategory, getProductByCategoryAndSubCategory, getProductDetails, updateProductDetails, searchProduct } = require('../controllers/productController')
const admin = require('../middleware/admin')
const auth = require('../middleware/authMiddleware')

const router = require('express').Router()

router.post('/create',auth,admin, createProduct)
router.post('/get', getProduct)
router.delete('/delete',auth,admin,deleteProduct)
router.post('/get-product-by-category',getProductByCategory)
router.post('/get-product-by-category-and-subcategory', getProductByCategoryAndSubCategory)
router.post("/get-product-details", getProductDetails)
// search product
router.post('/search-product',searchProduct)

router.put("/update-product-details",auth,admin,updateProductDetails)

module.exports = router