import React, { useState } from 'react';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import AllApi from '../common/commonApi';
import toast from 'react-hot-toast';
import ConfirmBox from './ConfirmBox';
import fetchProductData from '../pages/ProductAdmin'
import EditProductAdmin from './EditProductAdmin';

const ProductCardAdmin = ({data, fetchProductData}) => {
  const [openEdit,setOpenEdit] = useState(false)
  //   const [editData,setEditData] = useState({
  //     _id : ""
  //   })
  // const [deleteProduct,setDeleteProduct] = useState({
  //     _id : ""
  //   })
    const [openDeleteConfirmBox,setOpenDeleteConfirmBox] = useState(false)

    const handleDeleteProduct =async () => {
      try {
        const response = await Axios({
          ...AllApi.deleteProduct,
          data : {
            _id : data._id
          }
        })

        const { data : responseData} = response
        if(responseData.success){
                toast.success(responseData.message)
                if(fetchProductData){
                  fetchProductData()
                }
                setOpenDeleteConfirmBox(false)
              }
      } catch (error) {
        AxiosToastError(error)
        console.log(error)
      }
    }
    console.log("Product unit:", data.unit);

  return (
    <div className='w-36 p-4 bg-white rounded '>
      <div>
        <img
        src={data?.image[0]}
        alt={data?.name}
        className='w-full h-full object-scale-down'
        />
      </div>
      <p className='text-ellipsis line-clamp-2 font-medium'>{data.name}</p>
      <p className='text-slate-400'>
        {data.unit}
      </p>
      <div className=" items-center h-9 flex gap-2">
                <button onClick={()=>{
                  setOpenEdit(true)
                  // setEditData(data)
                }}  className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded cursor-pointer">
                  Edit
                </button>
                <button onClick={()=>{
                  setOpenDeleteConfirmBox(true)
                  // fetchProductData()
                  // setDeleteProduct(data)
                }} 
                 className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded cursor-pointer">
                  Delete
                </button>
              </div>
              {
          openEdit && (
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setOpenEdit(false)}
          />
        )
        }
              {
          openDeleteConfirmBox && (
            <ConfirmBox 
            cancel={()=>setOpenDeleteConfirmBox(false)}
            close={()=>setOpenDeleteConfirmBox(false)}
            confirm={handleDeleteProduct}
            />
          )
        }
    </div>
  );
};

export default ProductCardAdmin;