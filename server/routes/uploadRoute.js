const { uploadImageController } = require('../controllers/uploadImageController')
const auth = require('../middleware/authMiddleware')
const upload = require('../middleware/multer')

const router = require('express').Router()

router.post("/upload",auth,upload.single("image"),uploadImageController)

module.exports = router