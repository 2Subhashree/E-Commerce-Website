
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import  { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import FetchUserDetails from './utils/FetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import AllApi from './common/commonApi';
import Axios from './utils/Axios';
import { setAllCategory,setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { handleAddItemCart } from './store/cartProduct';
import GlobalProvider from './provider/GlobalProvider'
import { FaCartShopping } from "react-icons/fa6";
import CartMobile from './components/CartMobile';
import ScrollToTop from './components/ScrollToTop';

function App() {

  const dispatch = useDispatch()
  const location = useLocation()
  

  //get data if user already exist
  const fetchUser = async()=>{
    const userData = await FetchUserDetails()
    if (userData?.data) {
      dispatch(setUserDetails(userData.data));
    }
    //  else {
    //   console.log("User data fetch failed");
    // }
  }

    const fetchCategory = async () => {
      try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
          ...AllApi.getcategory,
         
        });
        const { data: responseData } = response;
  
        if (responseData.success) {
          dispatch(setAllCategory(responseData.data))
          
        }
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(setLoadingCategory(false))
      }
    };
    const fetchSubCategory = async () => {
      try {
        const response = await Axios({
          ...AllApi.getSubCategory,
         
        });
        const { data: responseData } = response;
  
        if (responseData.success) {
          dispatch(setAllSubCategory(responseData.data))
          
        }
      } catch (error) {
        console.log(error)
      } finally {
        
      }
    };
  
   

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  },[])

  return (
    <GlobalProvider>
    <Header/>
    <ScrollToTop/>
      <main className='min-h-[78vh]'>
       <Outlet/>
      </main>
      <Footer/>
      <Toaster/>
      {
        location.pathname !== '/checkout' && (
           <CartMobile/>
        )
      }
    </GlobalProvider>
  )
}

export default App
