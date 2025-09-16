import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi";
import AxiosToastError from "../utils/AxiosToastError";
import SuccessAlert from "../utils/SuccessAlert";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    description: "",
    more_details: {},
  });

  // ✅ Variants state
  const [variants, setVariants] = useState([
    { color: "", size: "", price: "", stock: "", discount: "" },
  ]);

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);

  // --- Input handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    setVariants((prev) => {
      const copy = [...prev];
      copy[index][name] = value;
      return copy;
    });
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      { color: "", size: "", price: "", stock: "", discount: "" },
    ]);

  const removeVariant = (index) =>
    setVariants(variants.filter((_, i) => i !== index));

  // --- Image handlers ---
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setImageLoading(true);
      const response = await uploadImage(file);
      const imageUrl =
        response?.data?.data?.url ||
        response?.data?.url ||
        response?.url;
      if (!imageUrl) throw new Error("Image upload failed");
      setData((prev) => ({ ...prev, image: [...prev.image, imageUrl] }));
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) =>
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));

  // --- Category & SubCategory ---
  const handleSelectCategory = (e) => {
    const id = e.target.value;
    if (!id || data.category.includes(id)) return;
    setData((prev) => ({ ...prev, category: [...prev.category, id] }));
    setSelectCategory("");
  };

  const handleRemoveCategory = (index) =>
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));

  const handleSelectSubCategory = (e) => {
    const id = e.target.value;
    if (!id || data.subCategory.includes(id)) return;
    setData((prev) => ({ ...prev, subCategory: [...prev.subCategory, id] }));
    setSelectSubCategory("");
  };

  const handleRemoveSubCategory = (index) =>
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, i) => i !== index),
    }));

  // --- Custom fields ---
  const handleAddField = () => {
    if (!fieldName.trim()) return;
    setData((prev) => ({
      ...prev,
      more_details: { ...prev.more_details, [fieldName]: "" },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  // --- Submit ---
// --- Submit ---
const handleSubmit = async (e) => {
  e.preventDefault();

  // Transform array → nested object
  const formattedVariants = {};
  variants.forEach((v) => {
    if (!v.unit || !v.color) return;
    if (!formattedVariants[v.unit]) formattedVariants[v.unit] = { colors: {} };
    formattedVariants[v.unit].colors[v.color] = {
      price: Number(v.price),
      stock: Number(v.stock),
      discount: Number(v.discount) || 0,
    };
  });

  const payload = { ...data, variants: formattedVariants };

  try {
    const res = await Axios({ ...AllApi.createProduct, data: payload });
    if (res.data.success) {
      SuccessAlert(res.data.message);
    } else {
      AxiosToastError({ message: res.data.message || "Product creation failed" });
    }
  } catch (err) {
    AxiosToastError(err);
  }
};


  return (
    <section className="p-4">
      <div className="bg-white p-3 shadow-md mb-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Upload Product</h2>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {/* Name & Description */}
        <div className="grid gap-1">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="p-2 border rounded bg-blue-50"
            required
          />
        </div>
        <div className="grid gap-1">
          <label>Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="p-2 border rounded bg-blue-50 resize-none"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label>Images</label>
          <label
            htmlFor="productImage"
            className="border p-4 flex flex-col items-center justify-center cursor-pointer bg-blue-50 rounded h-24"
          >
            {imageLoading ? (
              <Loading />
            ) : (
              <>
                <FaCloudUploadAlt size={35} />
                <p>Upload Image</p>
              </>
            )}
            <input
              type="file"
              id="productImage"
              className="hidden"
              accept="image/*"
              onChange={handleUploadImage}
            />
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.image.map((img, index) => (
              <div key={img + index} className="relative h-20 w-20 border">
                <img
                  src={img}
                  alt="uploaded"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setViewImageURL(img)}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label>Category</label>
          <select
            value={selectCategory}
            onChange={handleSelectCategory}
            className="p-2 border rounded bg-blue-50 w-full"
          >
            <option value="">Select Category</option>
            {allCategory.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.category.map((id, i) => {
              const cat = allCategory.find((c) => c._id === id);
              return (
                <span
                  key={id}
                  className="bg-blue-100 px-2 py-1 rounded flex items-center"
                >
                  {cat?.name || id}
                  <IoClose
                    className="ml-1 cursor-pointer"
                    onClick={() => handleRemoveCategory(i)}
                  />
                </span>
              );
            })}
          </div>
        </div>

        {/* SubCategories */}
        <div>
          <label>Sub Category</label>
          <select
            value={selectSubCategory}
            onChange={handleSelectSubCategory}
            className="p-2 border rounded bg-blue-50 w-full"
          >
            <option value="">Select Sub Category</option>
            {allSubCategory.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.subCategory.map((id, i) => {
              const sc = allSubCategory.find((s) => s._id === id);
              return (
                <span
                  key={id}
                  className="bg-blue-100 px-2 py-1 rounded flex items-center"
                >
                  {sc?.name || id}
                  <IoClose
                    className="ml-1 cursor-pointer"
                    onClick={() => handleRemoveSubCategory(i)}
                  />
                </span>
              );
            })}
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-2">
          <h3 className="font-semibold">Variants</h3>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 items-center">
              <input
                name="color"
                value={v.color}
                onChange={(e) => handleVariantChange(i, e)}
                placeholder="Color"
                className="p-2 border rounded"
              />
              <input
                name="size"
                value={v.size}
                onChange={(e) => handleVariantChange(i, e)}
                placeholder="Size"
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                value={v.price}
                onChange={(e) => handleVariantChange(i, e)}
                placeholder="Price"
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="stock"
                value={v.stock}
                onChange={(e) => handleVariantChange(i, e)}
                placeholder="Stock"
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="discount"
                value={v.discount}
                onChange={(e) => handleVariantChange(i, e)}
                placeholder="Discount %"
                className="p-2 border rounded"
              />
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            + Add Variant
          </button>
        </div>

        {/* More Details */}
        {Object.keys(data.more_details).map((key) => (
          <div key={key} className="grid gap-1">
            <label>{key}</label>
            <input
              value={data.more_details[key]}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  more_details: { ...prev.more_details, [key]: e.target.value },
                }))
              }
              className="p-2 border rounded bg-blue-50"
            />
          </div>
        ))}
        <div
          onClick={() => setOpenAddField(true)}
          className="bg-white border border-amber-300 py-1 px-3 w-32 text-center font-semibold hover:bg-amber-200 cursor-pointer rounded"
        >
          Add Fields
        </div>

        <button
          type="submit"
          className="bg-amber-300 hover:bg-amber-200 py-2 rounded font-semibold mt-3"
        >
          Submit
        </button>
      </form>

      {viewImageURL && (
        <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
      )}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
