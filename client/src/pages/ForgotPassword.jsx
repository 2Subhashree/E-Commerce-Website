import React, { useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi"
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });


  const navigate = useNavigate()

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
        ...AllApi.forgot_password,
         data : data,
         
      })
      if(res.data.error){
        toast.error(res.data.message)
      }
      if(res.data.success){
        toast.success(res.data.message)
        navigate('/verification-otp',{
          state : data
        })
        setData({
          email: "",
        })
       
      }

    } catch (error) {
      AxiosToastError(error)
      console.log(error)
    }

  }

  
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-lg p-7
      ">
       <p className="font-semibold text-lg mb-2">Frogot Password</p>
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
         

          <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} bg-gray-800 text-white py-2 rounded font-semibold my-3 tracking-wide`}>Send OTP</button>
        </form>
        <p>
         Already have account ? <Link to={"/login"} className=" text-blue-600">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
