import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError"
import Axios from '../utils/Axios'
import AllApi from '../common/commonApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { validURLConvert } from '../utils/validURLConvert';

const CategoryWiseProductDisplay = ({id,name}) => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const loadingCardNumber = new Array(6).fill(null)
  const containerRef = useRef()
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const [showScrollButtons, setShowScrollButtons] = useState(false);


  const fetchCategoryWiseProduct = async()=> {
    try {
      setLoading(true)
      const response = await Axios({
        ...AllApi.getProductbyCategory,
        data : {
           id : id
        }
      })
      const { data : responseData} = response
      if(responseData.success){
        setData(responseData.data)
      }
      // console.log(responseData)
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    // console.log("Category ID:", id)
      fetchCategoryWiseProduct()
  },[])

  const handleScrollRight = ()=> {
    containerRef.current.scrollLeft += 200
  }
  const handleScrollLeft = ()=> {
    containerRef.current.scrollLeft -= 200
  }

  const handleRedirectProductListPage = ()=>{
    const subcategory = subCategoryData.find(sub => 
      sub.category.includes(id) // ✅ Here is the main correction
    );
  
    if (subcategory) {
      const url = `/${validURLConvert(name)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`;
      return url
      
    } 
    // else {
    //   console.log("No matching subcategory found!");
    // }
    
  }

  useEffect(() => {
  const checkScroll = () => {
    const el = containerRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setShowScrollButtons(true);
    } else {
      setShowScrollButtons(false);
    }
  };

  // Run once after data is fetched
  if (!loading && data.length > 0) {
    checkScroll();
  }
}, [data, loading]);

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <Link to={handleRedirectProductListPage()} className="text-green-600 hover:text-green-400">See All</Link>
      </div>
      <div className='relative flex items-center'>
        <div className='flex gap-4 md:gap-6 lg:gap-8 container mx-auto p-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef}>
        { loading &&
          loadingCardNumber.map((_,index)=> {
            return(
              <div className="min-w-[200px] max-w-[200px] flex-shrink-0">
                <CardLoading key={"CategorywiseProductDisplay123"+index}/>
              </div>
            )
          })
        }

        { !loading &&
          data.map((p,index)=>{
            return(
              <div className="min-w-[200px] max-w-[200px] flex-shrink-0">
              <CardProduct data={p} key={p._id+"CategorywiseProductDisplay"+index}/>
              </div>
            )
          })
        }   
      </div>

      {/* <div className='w-full left-0 right-0 container mx-auto absolute hidden lg:flex justify-between px-2'>
          <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg'>
              <FaAngleLeft/>
          </button>
          <button onClick={handleScrollRight} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg'>
            <FaAngleRight/>
          </button>
        </div> */}

        {showScrollButtons && (
  <div className='w-full left-0 right-0 container mx-auto absolute hidden lg:flex justify-between px-2'>
    <button
      onClick={handleScrollLeft}
      className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg'
    >
      <FaAngleLeft />
    </button>
    <button
      onClick={handleScrollRight}
      className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg'
    >
      <FaAngleRight />
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;