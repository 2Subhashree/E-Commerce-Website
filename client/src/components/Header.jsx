import React, { useEffect, useState } from 'react';
import logo from '../assets/sub.png'
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { GiShoppingCart } from "react-icons/gi";
import { useSelector } from 'react-redux';
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()
  const isSearchPage = location.pathname === '/search'
  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  // const [totalPrice,setTotalPrice] = useState(0)
  // const [totalQty,setTotalQty] = useState(0)
  const {totalPrice,totalQty} = useGlobalContext()
  const [openCartSection,setOpenCartSection] = useState(false)

  // console.log("cartItem", cartItem)



  // console.log('user from store', user)

  const redirectToLoginPage = () => {
      navigate("/login")
  }

  const handleCloseUserMenu = () =>{
    setOpenUserMenu(false)
  }

  const handleMobileuser = () =>{
    if(!user._id){
      navigate("/login")
      return
    }
    navigate("/user")
  }

  // total item and total price
  // useEffect(()=>{
  //   const qty = cartItem.reduce((preve,curr)=>{
  //     return preve + curr.quantity
  //   },0)
  //   setTotalQty(qty)
    
  //   const tPrice = cartItem.reduce((preve,curr)=>{
  //     return preve + curr.productId.price * curr.quantity
  //   },0)
  //   setTotalPrice(tPrice)
  // },[cartItem])

  return (
   <header className='h-28  lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-[#37474F]'>
    {
      !(isSearchPage && isMobile) && (
        <div className='container mx-auto flex justify-between items-center px-2'>
      {/* logo */}
    <div className='h-full'>
      <Link to={"/"} className='h-full flex justify-center items-center'>
        <img src={logo} width={90} height={40} alt='logo' className='hidden lg:block'/>
        <img src={logo} width={70} height={40} alt='logo' className='lg:hidden'/>
      </Link>
    </div>

    {/* search */}
    <div className='hidden lg:block'>
      <Search/>
    </div>

    {/* login and my cart */}
    <div>
      {/* user icons display in only mobile version */}
      <button className='text-neutral-800 lg:hidden' onClick={handleMobileuser}>
        <FaUserCircle color='white' size={33}/>
      </button>
      {/* Desktop */}
      <div className='hidden lg:flex items-center gap-10 text-neutral-200'>
        {
          user?._id? (
            <div className='relative'>
              <div onClick={() =>setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer'>
                <p>Account</p>
                {
                  openUserMenu ? (
                    <GoTriangleUp size={22}/>
                  ) : (
                    <GoTriangleDown size={22}/>
                  )
                }
                    
              </div>
              {
                openUserMenu && (
                  <div className='absolute right-0 top-12'>
                  <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                      <UserMenu close={handleCloseUserMenu}/>
                  </div>
              </div>
                )
              }
            </div>
          ) : (
            <button onClick={redirectToLoginPage} className='text-lg px-2 text-neutral-200'>Login</button>
       
          )
        }
        
        <button onClick={()=>setOpenCartSection(true)} className=' flex items-center gap-2 px-3 py-3 bg-green-800 hover:bg-green-700 rounded  text-white '>
          {/* add to cart icons */}
          <div className='animate-bounce'>
              <GiShoppingCart size={30}/>
          </div>
          <div className='font-semibold text-sm'>
            {
              cartItem[0] ? (
                <div>
                  <p>{totalQty} Items</p>
                  <p>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              ) : (
                <p>My Cart</p>
              )
            }           
          </div>
        </button>
      </div>
    </div>
    </div>
      )
    }
    
    <div className='container mx-auto px-2 lg:hidden'>
      <Search/>
    </div>

    {
      openCartSection && (
        <DisplayCartItem close={()=>setOpenCartSection(false)}/>
      )
    }
   </header>
  );
}

export default Header;