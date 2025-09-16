const { AddCategory, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const auth = require('../middleware/authMiddleware')

const router = require('express').Router()

router.post("/add-category",auth,AddCategory)
router.get('/get',getCategory)
router.put('/update',auth, updateCategory)
router.delete("/delete", auth, deleteCategory)

module.exports = router