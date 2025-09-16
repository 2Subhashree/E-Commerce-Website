import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi";
import EditCategory from "../components/EditCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";
// import fetchCategory from '../App'

const CategoryPage = () => {
  const [openUploadCategory, setOpenUloadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    name : "",
    image : "",
  })

  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
  const [deleteCategory,setDeleteCategory] = useState({
    _id : ""
  })
  const allCategory = useSelector(state =>state.product.allCategory)

  useEffect(()=>{
      setCategoryData(allCategory)
  },[allCategory])

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...AllApi.getcategory,
       
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setCategoryData(responseData.data);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDeleteCategory = async()=>{
    try {
      const response= await Axios({
        ...AllApi.deleteCategory,
        data : deleteCategory
      })

      const { data : responseData } = response

      if(responseData.success){
        toast.success(responseData.message)
        fetchCategory()
        setOpenConfirmBoxDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <section>
      <div className="p-2  bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setOpenUloadCategory(true)}
          className="text-sm border border-amber-300 hover:bg-amber-400 px-3 py-1 rounded "
        >
          Add Category
        </button>
      </div>

      {!categoryData[0] && !loading && <NoData />}

      <div className="p-2 lg:p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categoryData.map((category, index) => {
          return (
            <div className="w-36 h-60 rounded-xl bg-white shadow-md flex flex-col items-center justify-between p-2 hover:shadow-lg transition-shadow duration-300" key={category._id}>
              <img
                alt={category.name}
                src={category.image}
                className="w-full h-32 object-scale-down"
              />
              <div className="text-center font-medium text-gray-700 mt-2 line-clamp-2">
                {category.name}
              </div>
              <div className=" flex items-center gap-2 w-full mt-2">
                <button onClick={()=>{setOpenEdit(true)
                  setEditData(category)
                }} className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded cursor-pointer">
                  Edit
                </button>
                <button onClick={()=>{setOpenConfirmBoxDelete(true)
                  setDeleteCategory(category)}} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <Loading />}
      {openUploadCategory && (
        <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUloadCategory(false)} />
      )}
      {
        openEdit && (
          <EditCategory key={editData._id}  data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
        )
      }
      {
        openConfirmBoxDelete && (
          <ConfirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
        )
      }
    </section>
  );
};

export default CategoryPage;
