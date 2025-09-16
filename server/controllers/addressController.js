const Address = require("../models/addressModel");
const User = require("../models/userModel")

exports.addAddress = async(req,res)=>{
  try {
    // only login user is add to address
    const userId = req.userId 
    const { address_line, city, state, pincode, country, mobile, status } = req.body;

    const createAddress = new Address({
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
      userId : userId
    })
    const saveAddress = await createAddress.save()

    const addUserAddressId = await User.findByIdAndUpdate(userId,{
      $push : {
        address_details : saveAddress._id
      }
    })

    return res.json({message : "Address created successfully", success : true, data : saveAddress})

  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

exports.getAddress = async(req,res)=> {
  try {
    const userId = req.userId //middleware auth

    const data = await Address.find({userId : userId}).sort({createdAt : -1})

    return res.json({data : data, message : "List of address", success : true})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

exports.updateAddress = async(req,res)=>{
  try {
    const userId = req.userId
    const { _id, address_line, city, state, country, pincode, mobile } = req.body
    const updateAddress = await Address.updateOne({ _id : _id, userId : userId},{
      address_line,
      city,
      state,
      country,
      mobile,
      pincode
    })
    return res.json({message : "Address updated", success : true, data : updateAddress})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

exports.deleteAddress = async(req,res)=>{
  try {
    const userId = req.userId
    const { _id } = req.body

    // only disable not to delete
    const disableAddress = await Address.updateOne({ _id : _id, userId},{
      status : false
    })
    return res.json({message : "Address remove", success : true, data : disableAddress})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}