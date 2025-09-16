import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import AllApi from '../common/commonApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import FetchUserDetails from '../utils/FetchUserDetails';

const Profile = () => {
  const user = useSelector(state => state.user)
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
  const [userData,setUserData] = useState({
    name : user.name,
    email : user.email,
    mobile : user.mobile
  })
  const [loading,setLoading] =useState(false)
  const dispatch = useDispatch()

  useEffect(()=>{
    setUserData({
      name : user.name,
    email : user.email,
    mobile : user.mobile
    })
  },[user])

  const handleOnChange = (e) =>{
    const {name, value} = e.target
    setUserData((preve)=>{
      return{
          ...preve,
          [name] : value
      }
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()

    try {
      setLoading(true)
      const response = await Axios({
        ...AllApi.updateUserDetails,
        data : userData
      })
      const {data : responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        const userData = await FetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  return (
    <div className='flex flex-col items-center justify-center w-full'>
      {/**profile upload and display image */}
      <div className='w-20 h-20 bg-red-400 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
        {
          user.avatar ? (
            <img
              alt={user.name}
              src={user.avatar}
              className='w-full h-full'
            />
          ) : (
            <FaRegUserCircle size={65}/>
          )
        }
        
      </div>
      <button onClick={() =>setProfileAvatarEdit(true)} className='text-xs   min-w-20 border border-amber-200 rounded-full hover:bg-amber-400 py-1 px-2 mt-3'>Change Profile</button>
      {
        openProfileAvatarEdit && (
          <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)}/>
        )
      }

      {/* display user details like name, mobile, email */}
      <form className='my-4 grid gap-4 w-[60%]' onSubmit={handleSubmit}>
        <div className='grid
        '>
          <label>Name</label>
          <input 
            type='text' 
            placeholder='Enter your name'
            className='p-2 bg-blue-50 outline-none border focus-within:border-amber-200 rounded'
            value={userData.name}
            name='name'
            onChange={handleOnChange}
            required
            />
            
        </div>
        <div className='grid
        '>
          <label htmlFor='email'>Email</label>
          <input 
            type='email' 
            id='email'
            placeholder='Enter your email'
            className='p-2 bg-blue-50 outline-none border focus-within:border-amber-200 rounded'
            value={userData.email}
            name='email'
            onChange={handleOnChange}
            required
            />
        </div>
        <div className='grid
        '>
          <label htmlFor='mobile'>Mobile</label>
          <input 
            type='number'
            id='mobile' 
            placeholder='Enter your mobile number'
            className='p-2 bg-blue-50 outline-none border focus-within:border-amber-200 rounded'
            value={userData.mobile}
            name='mobile'
            onChange={handleOnChange}
            required
            />
        </div>
        <button className='border px-4 py-2 font-semibold hover:bg-amber-300 rounded border-amber-200 text-amber-300 hover:text-neutral-800'>
          {
            loading ? "Loading": "Submit"
          }
          </button>
      </form>
    </div>
  );
};

export default Profile;