const User = require("../models/userModel")
const jwt = require('jsonwebtoken')

const generatedRefreshToken = async(userId) => {
  const token = await jwt.sign({id: userId}, process.env.SECRET_KEY_REFRESH_TOKEN, {expiresIn: '7d'})

  const updateRefreshToken = await User.updateOne(
    {_id:userId }, {refresh_token : token}
  )
  
  return token
}

module.exports = generatedRefreshToken