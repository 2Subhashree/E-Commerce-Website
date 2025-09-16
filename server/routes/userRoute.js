const { register, verifyEmail, login, logout, uploadAvatar, updateUserDetails, forgotPassword, verifyForgotPasswordOtp, resetPassword, refreshToken, userDetails } = require('../controllers/userController')
const auth = require('../middleware/authMiddleware')
const upload = require('../middleware/multer')

const router = require('express').Router()

router.post('/register', register)
router.post('/verify-email', verifyEmail)
router.post('/login', login)
router.get('/logout',auth, logout)
router.put('/upload-avatar', auth,upload.single('avatar'), uploadAvatar)
router.put('/update-user', auth, updateUserDetails)
router.put('/forgot-password', forgotPassword)
router.put('/verify-otp', verifyForgotPasswordOtp)
router.put('/reset-password', resetPassword)
router.post('/refresh-token', refreshToken)
router.get('/user-details',auth, userDetails)

module.exports = router