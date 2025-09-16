const jwt = require('jsonwebtoken')
const auth = async(req, res, next) => {
  try {
    const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1] //bearer token
    if(!token){
      return res.status(401).json({message: "provide token"})
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

    if(!decode){
      return res.status(401).json({message: "unauthorized access", success: false})
    }

    req.userId = decode.id
    console.log('decode', decode)
    next();
  } catch (error) {
    return res.status(500).json({message : "You have not login", success: false})
  }
}

module.exports = auth