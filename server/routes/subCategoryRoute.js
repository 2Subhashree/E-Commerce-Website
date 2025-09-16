const { AddSubCategory, getSubCategory, updateSubCategory, deleteSubCategory } = require('../controllers/subCategoryController')
const auth = require('../middleware/authMiddleware')

const router = require('express').Router()

router.post("/create",auth,AddSubCategory)
router.post("/get",getSubCategory)
router.put("/update",auth, updateSubCategory)
router.delete("/delete",auth,deleteSubCategory)

module.exports = router