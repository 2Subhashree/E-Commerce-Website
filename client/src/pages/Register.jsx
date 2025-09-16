import React, { useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi"
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    if(data.password !== data.confirmPassword){
      toast.error(
        "password does not match"
      )
      return
    }

    try {
      const response = await Axios({
        ...AllApi.register,
         data : data,
         withCredentials : true
      })
      if(response.data.error){
        toast.error(response.data.message)
      }
      if(response.data.success){
        toast.success(response.data.message)
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        navigate('/login')
      }
      console.log('response',response)
    } catch (error) {
      AxiosToastError(error)
    }

  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (data.password !== data.confirmPassword) {
  //     toast.error("Passwords do not match");
  //     return;
  //   }
  
  //   try {
  //     const res = await fetch('http://localhost:8000/api/user/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //       credentials: 'include', // Ensure cookies are sent
  //     });
  
  //     const result = await res.json();
  
  //     if (result.error) {
  //       toast.error(result.message);
  //     }
  
  //     if (result.success) {
  //       toast.success(result.message);
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while registering.");
  //   }
  // };
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-lg p-7
      ">
        <p>Welcome to Subhnum</p>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              className="bg-blue-50 p-2 border rounded"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
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
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex justify-between items-center focus-within:border-green-300">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="w-full outline-none"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="Enter your confirm password"
            />
            <div onClick={() => setShowConfirmPassword(preve => !preve)} className="cursor-pointer">
              {
                showConfirmPassword ? (
                  <IoEyeOutline/>
                ) : (
                  <IoEyeOffOutline/>
                )
              }
               
            </div>
            </div>
          </div>

          <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} bg-gray-800 text-white py-2 rounded font-semibold my-3 tracking-wide`}>Register</button>
        </form>
        <p>
          Already have account ? <Link to={"/login"} className=" text-blue-600">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
