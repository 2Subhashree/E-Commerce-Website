const SubCategory = require("../models/subCategoryModel")

exports.AddSubCategory = async(req, res)=>{
  try {
    const {name, image, category} = req.body;

    if(!name && !image && !category[0]){
      return res.status(400).json({message : "Provide name, image, category", success : false})
    }

    const payload = {
      name, image, category
    }

    const createSubCategory = new SubCategory(payload)
    const save = await createSubCategory.save()

    return res.json({message : "Sub Category Created", data : save, success : true})

  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

exports.getSubCategory = async(req,res)=>{
  try {
    const data = await SubCategory.find().sort({createdAt : -1})
    return res.json({message : "Sub category data", data : data, success : true})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

exports.updateSubCategory= async(req,res)=>{
  try {
    const {_id,name,image,category} = req.body;

    const checkSub = await SubCategory.findById(_id)

    if(!checkSub){
      return res.status(400).json({message : "Check your _id", success : false})
    }

    const updateSubCategory = await SubCategory.findByIdAndUpdate(_id, {
      name,
      image,
      category
    })

    return res.json({message : "Updated Successfully", data : updateSubCategory, success : true})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}

exports.deleteSubCategory = async(req,res)=>{
  try {
    const {_id} = req.body

    const deleteSub = await SubCategory.findByIdAndDelete(_id)

    return res.json({message : "Delete Successfully",data : deleteSub, success : true})
  } catch (error) {
    return res.status(500).json({message : error.message || error, success : false})
  }
}