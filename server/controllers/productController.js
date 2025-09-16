const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      variants,
      description,
      more_details,
    } = req.body;

    // ✅ Basic validations
    if (!name || !Array.isArray(image) || image.length === 0 || !category || !subCategory || !description) {
      return res.status(400).json({
        success: false,
        message: "Enter all required fields (name, image, category, subCategory, description)",
      });
    }

    // ✅ Validate variants
    if (!variants || Object.keys(variants).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one variant is required",
      });
    }

    for (const [unit, unitData] of Object.entries(variants)) {
      if (!unitData.colors || Object.keys(unitData.colors).length === 0) {
        return res.status(400).json({
          success: false,
          message: `Variant '${unit}' must contain at least one color`,
        });
      }

      for (const [color, details] of Object.entries(unitData.colors)) {
        if (details.price == null || details.stock == null) {
          return res.status(400).json({
            success: false,
            message: `Color '${color}' in size '${unit}' must have price and stock`,
          });
        }
      }
    }

    // ✅ Create product document
    const product = new Product({
      name,
      image,
      category,
      subCategory,
      variants,
      description,
      more_details,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.getProduct = async (req, res) => {
   try {
    let { page, limit, search } = req.body;

    // Defaults
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // ✅ Search support (name + description)
    if (search && search.trim() !== "") {
      const normalizedSearch = search
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      query = {
        $or: [
          { name: { $regex: normalizedSearch, $options: "i" } },
          { description: { $regex: normalizedSearch, $options: "i" } }
        ]
      };
    }

    // ✅ Fetch products + count simultaneously
    const [data, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product Data",
      success: true,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Provide _id",
        success: false,
      });
    }

    const deleteProduct = await Product.deleteOne({ _id: _id });

    return res.json({
      message: "Delete Successfully",
      data: deleteProduct,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "provide category id", success: false });
    }

    const product = await Product.find({
      category: { $in: id },
    }).limit(15);

    return res
      .status(200)
      .json({ message: "Category product list", data: product, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.body;
    let { page, limit } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Provide categoryId and subCategoryId",
        success: false,
      });
    }

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const query = {
      category: { $in: [categoryId] },
      subCategory: { $in: [subCategoryId] },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product list",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

exports.getProductDetails = async (req, res) => {
 try {
    const { productId } = req.body;

    const product = await Product.findById(productId)
      .populate("category subCategory");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Extract variants but exclude stock
    const variantsByColor = {};

    if (product.variants && product.variants.size > 0) {
      for (const [size, sizeData] of product.variants.entries()) {
        if (sizeData.colors && sizeData.colors.size > 0) {
          for (const [color, details] of sizeData.colors.entries()) {
            if (!variantsByColor[color]) {
              variantsByColor[color] = [];
            }

            // ✅ Push only price & discount (skip stock)
            variantsByColor[color].push({
              size,
              price: details.price,
              discount: details.discount,
            });
          }
        }
      }
    }

    return res.json({
      success: true,
      message: "Product details",
      data: {
        _id: product._id,
        name: product.name,
        description: product.description,
        image: product.image || [],
        category: product.category,
        subCategory: product.subCategory,
        more_details: product.more_details || {},
        variantsByColor, // ✅ frontend gets only color, size, price, discount
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// update product
exports.updateProductDetails = async (req, res) => {
  try {
    const { _id, name, description, image, category, subCategory, more_details, variants } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Provide product _id",
      });
    }

    // ✅ Build update object step by step (avoid overwriting entire document)
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    if (category) updateData.category = category;
    if (subCategory) updateData.subCategory = subCategory;
    if (more_details) updateData.more_details = more_details;

    // ✅ Handle variants update carefully
    if (variants) {
      // Example: req.body.variants = { "M": { colors: { "Red": { price: 500, discount: 10 } } } }
      for (const [size, sizeData] of Object.entries(variants)) {
        if (sizeData.colors) {
          for (const [color, details] of Object.entries(sizeData.colors)) {
            // Update nested path
            for (const [field, value] of Object.entries(details)) {
              updateData[`variants.${size}.colors.${color}.${field}`] = value;
            }
          }
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("category subCategory");

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// search product
exports.searchProduct = async (req, res) => {
  try {
    let { search, page, limit } = req.body;

    // if user not provide page , it by default 1 and limit, by default 10
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
   
    
    const skip = (page - 1) * limit;

    // const query = search
    //   ? {
    //       $text: {
    //         $search: search,
    //       },
    //     }
    //   : {};
    let query = {};
    if (search && search.trim() !== "") {
      

      query = { name: { $regex: search.trim(), $options: "i" } }; // Partial match
    }
console.log("Search term:", search, "Page:", page, "Limit:", limit);
console.log("Query being used:", query);

    const [data, dataCount] = await Promise.all([
      Product.find(query)
      .collation({ locale: "en", strength: 2 })
        .sort({ name : 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product data",
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage : Math.ceil(dataCount/limit),
      page: page,
      limit: limit,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};
