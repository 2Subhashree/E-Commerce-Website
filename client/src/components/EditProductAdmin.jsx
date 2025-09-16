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

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  // ✅ Convert nested variants → flat array
  const flattenVariants = (variants) => {
    const arr = [];
    if (!variants) return arr;
    Object.entries(variants).forEach(([size, sizeData]) => {
      Object.entries(sizeData.colors || {}).forEach(([color, details]) => {
        arr.push({
          size,
          color,
          price: details.price || "",
          stock: details.stock || "",
          discount: details.discount || "",
        });
      });
    });
    return arr;
  };

  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name || "",
    description: propsData.description || "",
    image: propsData.image || [],
    category: propsData.category || [],
    subCategory: propsData.subCategory || [],
    more_details: propsData.more_details || {},
  });

  const [variants, setVariants] = useState(flattenVariants(propsData.variants));
  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");

  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);

  // --- Input handler ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Variants ---
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    setVariants((prev) => {
      const copy = [...prev];
      copy[index][name] = value;
      return copy;
    });
  };

  const addVariant = () =>
    setVariants([...variants, { color: "", size: "", price: "", stock: "", discount: "" }]);

  const removeVariant = (index) =>
    setVariants(variants.filter((_, i) => i !== index));

  // --- Image upload ---
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setImageLoading(true);
      const response = await uploadImage(file);
      const imageUrl = response?.data?.data?.url || response?.data?.url || response?.url;
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

  // --- Category/SubCategory handlers ---


  const handleRemoveCategory = (index) =>
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));


  const handleRemoveSubCategory = (index) =>
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, i) => i !== index),
    }));

  // --- More details ---
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Convert flat array → nested object
    const formattedVariants = {};
    variants.forEach((v) => {
      if (!v.size || !v.color) return;
      if (!formattedVariants[v.size]) formattedVariants[v.size] = { colors: {} };
      formattedVariants[v.size].colors[v.color] = {
        price: Number(v.price),
        stock: Number(v.stock),
        discount: Number(v.discount) || 0,
      };
    });

    const payload = { ...data, variants: formattedVariants };

    try {
      const response = await Axios({ ...AllApi.updateProductDetails, data: payload });
      if (response.data.success) {
        SuccessAlert(response.data.message);
        close && close();
        fetchProductData();
      }
    } catch (err) {
      AxiosToastError(err);
    }
  };

  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 overflow-y-auto h-full max-h-[95vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl text-gray-800">Edit Product</h2>
          <button onClick={close} className="p-2 rounded-full hover:bg-gray-100">
            <IoClose size={22} />
          </button>
        </div>

        {/* Form */}
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {/* Name & Description */}
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="p-3 border rounded-lg bg-gray-50"
            required
          />
          </div>
         <div className="grid gap-1">
           <label htmlFor="description">Decsription</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="p-3 border rounded-lg bg-gray-50 resize-none"
            required
          />
         </div>

          {/* Images */}
          <div>
            <p>Image</p>
            <div>
            <label
              htmlFor="productImage"
              className="border border-dashed p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 rounded-lg h-28"
            >
              {imageLoading ? <Loading /> : <><FaCloudUploadAlt size={40} /><p>Upload Image</p></>}
              <input type="file" id="productImage" className="hidden" accept="image/*" onChange={handleUploadImage} />
            </label>
            <div className="flex flex-wrap gap-3 mt-3">
              {data.image.map((img, i) => (
                <div key={i} className="relative h-24 w-24 border rounded-lg overflow-hidden">
                  <img src={img} alt="product" className="w-full h-full object-cover cursor-pointer" onClick={() => setViewImageURL(img)} />
                  <button type="button" onClick={() => handleDeleteImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full">
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>
          </div>
          

          {/* Categories */}
          <div className="grid gap-1">
                  <label>Category</label>
                  <div>
                    <select
                      className="bg-blue-50 border w-full p-2 rounded "
                      value={selectCategory}
                      onChange={(e) => {
                        const value = e.target.value;
                        const category = allCategory.find(
                          (el) => el._id === value
                        );
                        console.log(category);

                        setData((preve) => {
                          return {
                            ...preve,
                            category: [...preve.category, category],
                          };
                        });
                        setSelectCategory("");
                      }}
                    >
                      <option value={""}>Select Category</option>
                      {allCategory.map((c, index) => {
                        return (
                          <option key={c._id} value={c?._id}>
                            {c.name}
                          </option>
                        );
                      })}
                    </select>
                    <div className="flex flex-wrap gap-3">
                      {data.category.map((c, index) => {
                        return (
                          <div
                            key={c._id + index + "productsection"}
                            className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                          >
                            <p>{c.name}</p>
                            <div
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => handleRemoveCategory(index)}
                            >
                              <IoClose size={20} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="grid gap-1">
                  <label>Sub Category</label>
                  <div>
                    <select
                      className="bg-blue-50 border w-full p-2 rounded "
                      value={selectSubCategory}
                      onChange={(e) => {
                        const value = e.target.value;
                        const subCategory = allSubCategory.find(
                          (el) => el._id === value
                        );
                        console.log(subCategory);

                        setData((preve) => {
                          return {
                            ...preve,
                            subCategory: [...preve.subCategory, subCategory],
                          };
                        });
                        setSelectSubCategory("");
                      }}
                    >
                      <option value={""} className="text-neutral-600">
                        Select Sub Category
                      </option>
                      {allSubCategory.map((c, index) => {
                        return (
                          <option key={c._id} value={c?._id}>
                            {c.name}
                          </option>
                        );
                      })}
                    </select>
                    <div className="flex flex-wrap gap-3">
                      {data.subCategory.map((c, index) => {
                        return (
                          <div
                            key={c._id + index + "productsection"}
                            className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                          >
                            <p>{c.name}</p>
                            <div
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => handleRemoveSubCategory(index)}
                            >
                              <IoClose size={20} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

          {/* Same as UploadProduct … */}

          {/* Variants */}
          <div>
            <h3 className="gap-1">Variants</h3>
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 items-center m-1">
                <input name="color" value={v.color} onChange={(e) => handleVariantChange(i, e)} placeholder="Color" className="p-2 border rounded" />
                <input name="size" value={v.size} onChange={(e) => handleVariantChange(i, e)} placeholder="Size" className="p-2 border rounded" />
                <input type="number" name="price" value={v.price} onChange={(e) => handleVariantChange(i, e)} placeholder="Price" className="p-2 border rounded" />
                <input type="number" name="stock" value={v.stock} onChange={(e) => handleVariantChange(i, e)} placeholder="Stock" className="p-2 border rounded" />
                <input type="number" name="discount" value={v.discount} onChange={(e) => handleVariantChange(i, e)} placeholder="Discount %" className="p-2 border rounded" />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="text-red-500">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addVariant} className="px-3 py-1 bg-blue-500 text-white rounded mt-2">+ Add Variant</button>
          </div>

          {/* More details */}
          {/* add more field */}

                {Object?.keys(data?.more_details)?.map((k, index) => {
                  return (
                    <div key={k} className="grid gap-1">
                      <label htmlFor={k}>{k}</label>
                      <input
                        id={k}
                        type="text"
                        value={data?.more_details[k]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setData((preve) => {
                            return {
                              ...preve,
                              more_details: {
                                ...preve.more_details,
                                [k]: value,
                              },
                            };
                          });
                        }}
                        required
                        className="bg-blue-50 p-2 outline-none border focus-within:border-amber-300 rounded "
                      />
                    </div>
                  );
                })}

                <div
                  onClick={() => setOpenAddField(true)}
                  className="hover:bg-amber-500 bg-white py-1 px-3 w-32 text-center font-semibold border border-amber-300 hover:text-neutral-900 cursor-pointer rounded"
                >
                  Add Fields
                </div>
          {/* Same as UploadProduct … */}

          <button type="submit" className="bg-amber-400 hover:bg-amber-300 py-3 rounded-lg font-semibold mt-3 w-full">
            Update Product
          </button>
        </form>

        {/* Modals */}
        {viewImageURL && <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />}
        {openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )}
      </div>
    </section>
  );
};

export default EditProductAdmin;
