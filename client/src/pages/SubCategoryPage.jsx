import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import AllApi from "../common/commonApi";
import Axios from "../utils/Axios";
import NoData from "../components/NoData";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import ViewImage from "../components/ViewImage";
import EditSubCategory from "../components/EditSubCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";


const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    _id : ""
  })
  const [deleteSubCategory,setDeleteSubCategory] = useState({
    _id : ""
  })
  const [openDeleteConfirmBox,setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...AllApi.getSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const handleDeleteSubCategory=async()=>{
    try {
      const response= await Axios({
        ...AllApi.deleteSubCategory,
        data : deleteSubCategory
      })

      const { data : responseData } = response

      if(responseData.success){
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({_id : ""})
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section>
      <div className="p-2  bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-amber-300 hover:bg-amber-400 px-3 py-1 rounded "
        >
          Add Sub Category
        </button>
      </div>

      {!data[0] && !loading && <NoData />}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.map((subcategory, index) => {
          return (
            <div
              className="w-36 h-60 rounded-xl bg-white shadow-md flex flex-col items-center justify-between p-2 hover:shadow-lg transition-shadow duration-300 "
              key={subcategory._id}
            >
              <img
                alt={subcategory.name}
                src={subcategory.image}
                className="w-full h-32 object-scale-down"
                onClick={() => {
                  setImageUrl(subcategory.image);
                }}
              />
              <div className="text-center font-medium text-gray-700 mt-2 line-clamp-2">
                {subcategory.name}
              </div>
              <div className=" flex items-center gap-2 w-full mt-2">
                <button onClick={()=>{
                  setOpenEdit(true)
                  setEditData(subcategory)
                }}  className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded cursor-pointer">
                  Edit
                </button>
                <button onClick={()=>{
                  setOpenDeleteConfirmBox(true)
                  setDeleteSubCategory(subcategory)
                }}  className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <Loading />}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          fetchData={fetchSubCategory}
          close={() => setOpenAddSubCategory(false)}
        />
      )}

      {imageUrl && <ViewImage url={imageUrl} close={() => setImageUrl("")} />}

        {
          openEdit &&
          <EditSubCategory data={editData} close={()=>setOpenEdit(false)}
          fetchData={fetchSubCategory}
          />
        }
        {
          openDeleteConfirmBox && (
            <ConfirmBox 
            cancel={()=>setOpenDeleteConfirmBox(false)}
            close={()=>setOpenDeleteConfirmBox(false)}
            confirm={handleDeleteSubCategory}
            />
          )
        }
    </section>
  );
};

export default SubCategoryPage;
