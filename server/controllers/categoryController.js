const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const SubCategory = require("../models/subCategoryModel");

exports.AddCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        message: "Enter required fields",
        success: false,
      });
    }

    const addCategory = Category({
      name,
      image,
    });

    const saveCategory = await addCategory.save();

    if (!saveCategory) {
      return res.status(500).json({ message: "Not Created", success: false });
    }
    return res.json({
      message: "Add Category",
      data: saveCategory,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const data = await Category.find().sort({ createdAt: 1 });

    return res.json({ data: data, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { _id, name, image } = req.body;

    const update = await Category.findByIdAndUpdate(
        _id,
      {
        name,
        image,
      }, {new : true}
    );

    // if (update.modifiedCount === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "No changes detected", success: false });
    // }

    return res.json({
      message: "Updated Category",
      success: true,
      data: update,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { _id } = req.body;

    const checkSubCategory = await SubCategory.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    const checkProduct = await Product.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    if (checkSubCategory > 0 || checkProduct > 0) {
      return res
        .status(400)
        .json({
          message: " Category is already use can't delete",
          success: false,
        });
    }

    const deleteCategory = await Category.deleteOne({ _id: _id });

    return res.json({
      message: "Delete category successfully",
      data: deleteCategory,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};
