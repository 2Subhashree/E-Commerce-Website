import React from "react";
import { useState } from "react";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useEffect } from "react";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setToatlPageCount] = useState(1);
  const [search,setSearch] = useState("")

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...AllApi.getProduct,
        data: {
          page: page,
          // limit : 12,
          search : search
        },
      });

      const { data: responseData } = response;
      console.log("product page", responseData);

      if (responseData.success) {
        setProductData(responseData.data);
        setToatlPageCount(responseData.totalNoPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((preve) => preve + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((preve) => preve - 1);
    }
  };

  const handleOnChange = (e) => {
    const {value} = e.target 
    setSearch(value)
    setPage(1)
  }
  useEffect(()=>{
    let flag  = true

    const interval = setTimeout(()=> {
      if(flag){
        fetchProductData()
        flag = false
      }
    },300)
    return ()=>{
      clearTimeout(interval)
    }
  }, [search])

  return (
    <section>
      <div className="p-2  bg-white shadow-md lg:flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>
        <div className="h-full min-w-24 bg-blue-50 px-4 flex gap-3 items-center rounded py-2 border   focus-within:border-amber-400">
          <IoSearchOutline size={25}/>
          <input type="text" placeholder="Search product here...." 
          className="h-full outline-none bg-transparent"
          value={search}
          onChange={handleOnChange}/>
        </div>
      </div>
      {loading && <Loading />}
      <div className="p-4 bg-blue-50">
        <div className="min-h-[55vh]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {productData.map((p, index) => {
              return <ProductCardAdmin key={p._id || index} data={p} 
              fetchProductData={fetchProductData}/>;
            })}
          </div>
        </div>

        <div className="flex justify-between my-4">
          <button
            onClick={handlePrevious}
            className="border border-amber-300 px-4 py-1 hover:bg-amber-300"
          >
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/{totalPageCount}
          </button>
          <button
            onClick={handleNext}
            className="border border-amber-300 px-4 py-1 hover:bg-amber-300"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
