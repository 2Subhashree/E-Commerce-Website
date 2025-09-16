const uploadImageCloudinary = require("../utils/uploadImageCloudinary")
exports.uploadImageController = async(req, res)=>{
  try {
    const file = req.file

    const uploadImage = await uploadImageCloudinary(file)

    return res.json({message : "Upload done",data : uploadImage, success : true})

  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}