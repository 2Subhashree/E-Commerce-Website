import React, { useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi"
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from 'react-router-dom'
import FetchUserDetails from "../utils/FetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  
  const validValue = Object.values(data).every(el =>el)

  const handleSubmit = async(e) => {
    e.preventDefault()


    try {
      const res = await Axios({
        ...AllApi.login,
         data : data,
         
      })
      if(res.data.error){
        toast.error(res.data.message)
      }
      if(res.data.success){
        toast.success(res.data.message)
        localStorage.setItem('accesstoken',res.data.data.accesstoken)
        localStorage.setItem('refreshtoken',res.data.data.refreshtoken)

        const userDetails = await FetchUserDetails();
        dispatch(setUserDetails(userDetails.data))

        setData({
          email: "",
          password: "",
        })
        navigate('/')
      }

    } catch (error) {
      AxiosToastError(error)
    }

  }

  
  return (
    <section className="w-full container mx-auto px-2 pt-8">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-lg py-7 px-8
      ">
       
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              className="bg-blue-50 p-2 border rounded"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex justify-between items-center focus-within:border-green-300">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full outline-none"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <div onClick={() => setShowPassword(preve => !preve)} className="cursor-pointer">
              {
                showPassword ? (
                  <IoEyeOutline/>
                ) : (
                  <IoEyeOffOutline/>
                )
              }
               
            </div>
            </div>
            <Link to={"/forgot-password"} className="block ml-auto hover:text-blue-500">Forgot password ?</Link>
          </div>

          <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} bg-gray-800 text-white py-2 rounded font-semibold my-3 tracking-wide`}>Login</button>
        </form>
        <p>
         Don't have account ? <Link to={"/register"} className=" text-blue-600">Register</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
