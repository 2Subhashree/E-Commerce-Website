const sendEmail = require('../config/sendEmail');
const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const verifyEmailTemplate = require('../utils/verifyEmailTemplate');
const generateAccessToken = require('../utils/generateAccessToken');
const generatedRefreshToken = require('../utils/generatedRefreshToken');
const uploadImageCloudinary = require('../utils/uploadImageCloudinary');
const generateOtp = require('../utils/generateOtp');
const forgotPasswordTemplate = require('../utils/forgotPasswordTemplate');
const jwt = require('jsonwebtoken')

//user register
exports.register = async(req, res) => {
  try {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({message: "All Feilds are required", error: true, success: false})
    }

    const user = await User.findOne({email})

    if(user){
      return res.status(409).json({message: "Already registerd", success: false})
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name, email, password: hashPassword
    })
    await newUser.save();


    // const verfyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser?._id}`

    // const verifyEmail = await sendEmail({
    //   sendTo: email,
    //   subject: "Verify email from ecommerce",
    //   html: verifyEmailTemplate({
    //     name, url : verfyEmailUrl
    //   })
    // })
    // if (!verifyEmail) {
    //   return res.status(500).json({
    //     message: "Failed to send verification email",
    //     success: false,
        
    //   });
    // }

    return res.json({message: "User registerd successfully", success: true, newUser})
  } catch (error) {
    return res.status(500).json({message: error.message || error,
      error: true,
      success: false
    })
  }
}

//verify email
exports.verifyEmail = async(req, res) => {
  try {
    const {code} = req.body;

    const user = await User.findOne({_id: code})

    if(!user){
      return res.status(400).json({message: "Invalid code", success: false})
    }
    const updateUser = await User.updateOne({_id : code}, {verify_email: true})

    return res.json({message: "Verification Completed", success: true})
  } catch (error) {
    return res.status(500).json({message: error.message || error, success: false})
  }
}

//login user
exports.login = async(req, res) =>{
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({message: "Provide email and password", success: false})
    }

    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message: "User not registered", success: false})
    }

    if(user.status !== "Active"){
      return res.status(400).json({message: "Contact to Admin", success: false})
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
      return res.status(400).json({message: "Invalid Password", success: false})
    }

    const accesstoken = await generateAccessToken(user._id)
    const refreshtoken = await generatedRefreshToken(user._id)

    const updateUser = await User.findByIdAndUpdate(user?._id,{
      last_login_date : new Date()
    })

    const cookiesOption = {
      httpOnly: true,
      secure : true,
      sameSite : "None"
    }
    res.cookie('accessToken', accesstoken, cookiesOption)
    res.cookie('refreshToken', refreshtoken, cookiesOption)

    return res.json({message: "Login successfully", success: true, data : {
      accesstoken, refreshtoken
    }})

  } catch (error) {
    return res.status(500).json({message: error.message || error, success:false})
  }
}

//logout
exports.logout = async(req, res) => {
  try {
    const userid = req.userId //middleware
    const cookiesOption = {
      httpOnly : true,
      secure : true,
      sameSite : "None"
    }

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    const removeRefreshToken = await User.findByIdAndUpdate(userid, {refresh_token: ""})

    return res.json({message: "Logout Successfully", success: true})
  } catch (error) {
    return res.status(500).json({message: error.message || error, success:false})
  }
}

//upload user avatar
exports.uploadAvatar = async(req, res) => {
  try {
    const userId = req.userId //coming from auth middleware
    const image = req.file //coming from multer middleware

    const upload = await uploadImageCloudinary(image)

    const updateUser = await User.findByIdAndUpdate(userId, {avatar : upload.url})
    return res.json({message: "Upload profile",
      success : true, data: {
      _id : userId,
      avatar : upload.url
    }})
  } catch (error) {
    return res.status(500).json({message: error.message || error, success: false})
  }
}

//update user details
exports.updateUserDetails = async(req, res)=>{
  try {
    const userId = req.userId
    const { name, email, mobile, password } = req.body;

    if (mobile && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits.", success: false });
    }

    let hashPassword = ""

    if(password){
      const salt = await bcrypt.genSalt(10)
    hashPassword = await bcrypt.hash(password, salt)
    }
    

    const updateUser = await User.updateOne({_id : userId}, {
      ...(name && {name : name}),
      ...(email && {email : email}),
      ...(mobile && {mobile : mobile}),
      ...(password && {password : hashPassword}),
    })

    return res.json({message: "Updated successfully", success: true, data : updateUser})

  } catch (error) {
    return res.status(500).json({message: error.message || error, success: false})
  }
}

//forgot password
exports.forgotPassword = async(req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message: "Email not exist", success: false})
    }

    const otp = generateOtp()
    const expireTime = new Date(Date.now() + 60 * 60 * 1000)  //1hr

    const update = await User.findByIdAndUpdate(user._id, {
      forgot_password_otp : otp,
      forgot_password_expiry : expireTime
    })

    await sendEmail({
      sendTo : email,
      subject : "Forgot password from ecommerce",
      html : forgotPasswordTemplate({name : user.name,
        otp : otp
      })
    })


    

    return res.json({message: "Chek your email", success : true})

  } catch (error) {
    return res.status(500).json({message: error.message || error, success: false})
  }
}

//verify forgor password otp
exports.verifyForgotPasswordOtp = async(req, res) => {
  try {
    const { email , otp} = req.body;
    if(!email || !otp){
      return res.status(400).json({message: "Provide email and otp", success: false})
    }

    const user = await User.findOne({email})

    if(!user){
      return res.status(400).json({message: "Email not exist", success: false})
    }

    const currentTime = new Date().toISOString()
    if(user.forgot_password_expiry > currentTime){
      return res.status(400).json({message: "Otp Expired", success: false})
    }

    if(otp !== user.forgot_password_otp){
      return res.status(400).json({message: "Invalid otp", success: false})
    }

    //if otp is not expire or otp === user.forgot_password_otp

    const updateUser = await User.findByIdAndUpdate(user?._id, {
      forgot_password_otp : "",
      forgot_password_expiry : ""
    })

   return res.json({message: "Verify otp successfully", success: true})

  } catch (error) {
    return res.status(500).json({message: error.message || error, success : false})
  }
}

//reset password
exports.resetPassword = async(req, res) => {
  try {
    const {email, newPassword, confirmPassword} = req.body;

    if(!email || !newPassword || !confirmPassword){
      return res.status(400).json({message: 'All feilds are required', success: false})
    }

    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message: "Email is not exist", success: false})
    }

    if(newPassword !== confirmPassword){
      return res.status(400).json({message: "password does not match", success: false})
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)

    const update = await User.findOneAndUpdate(user._id, {
      password : hashPassword
    })

    return res.json({message : "password updated successfully", success : true})

  } catch (error) {
    return res.status(500).json({message: error.message || error, success: false})
  }
}

//refresh token
exports.refreshToken = async(req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

    if(!refreshToken){
      return res.status(401).json({message: "Unauthorized access", success: false})
    }

    const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)
    if(!verifyToken){
      return res.status(401).json({message: "Token is expired", success: false})
    }

    console.log("verifyToken", verifyToken)
    const userId = verifyToken?._id

    const newAccessToken = await generateAccessToken(userId)

    const cookiesOption = {
      httpOnly : true,
      secure : true,
      sameSite : "None"
    }

    res.cookie('accessToken', newAccessToken,cookiesOption)

    return res.json({message: "New Access token generated", success: true, data: {
      accesstoken : newAccessToken 
    }})

  } catch (error) {
    return res.status(500).json({message: error.message || error, success: false})
  }
}

//get login user details
exports.userDetails = async(req, res) => {
  try {
    const userId = req.userId

    const user = await User.findById(userId).select('-password -refresh_token')

    return res.json({message: "user details", data: user,success: true})
  } catch (error) {
    return res.status(500).json({message : "Something is wrong", success: false})
  }
}