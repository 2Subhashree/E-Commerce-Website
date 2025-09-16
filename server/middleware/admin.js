const User = require("../models/userModel")
const admin = async(req,res,next) =>{
  try {
    const userId = req.userId

    const user = await User.findById(userId)

    if(user.role !== 'ADMIN'){
      return res.status(400).json({
        message : "Permission denied",
        success : false
      })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      message : "Permission denied",
      success : false
    })
  }
}

module.exports = admin