import React, { useEffect, useRef, useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi"
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from 'react-router-dom'

const OtpVerification = () => {
  const [data, setData] = useState(["","","","","",""]);

  const navigate = useNavigate()
  // bydefault move cursor
  const inputRef = useRef([])
  const location = useLocation()

  console.log('location', location)

  useEffect(()=>{
    if(!location?.state?.email){
      navigate("/forgot-password")
    }
  },[])

  
  const validValue = data.every(el =>el)

  const handleSubmit = async(e) => {
    e.preventDefault()


    try {
      const res = await Axios({
        ...AllApi.forgot_password_otp_verification,
         data : {
          otp : data.join(""),
          email : location?.state?.email
         }
         
      })
      if(res.data.error){
        toast.error(res.data.message)
      }
      if(res.data.success){
        toast.success(res.data.message)
        setData(["","","","","",""])
        navigate('/reset-password',{
          state : {
            data : res.data,
            email : location?.state?.email
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
      console.log("error",error)
    }

  }

  
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-lg p-7
      ">
       <p className="font-semibold text-lg mb-2">Enter OTP</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          
          <div className="grid gap-1">
            <label htmlFor="otp">Enter Your OTP :</label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {
                data.map((element, index) =>{
                  return(
                    <input
                    key={"otp"+index}
              type="text"
              id="otp"
              ref={(ref)=>{
                inputRef.current[index] = ref
                return ref
              }}
              value={data[index]}
              onChange={(e)=>{
                const value= e.target.value;
                console.log('value', value)

                const newData = [...data]
                newData[index] = value
                setData(newData)

                if(value && index < 5){
                  inputRef.current[index+1].focus()
                }
              }}
              maxLength={1}
              className="bg-blue-50 w-full max-w-16 p-2 border outline-none rounded text-center font-semibold"
             
            />
                  )
                })
              }
            </div>
            
          </div>
         

          <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} bg-gray-800 text-white py-2 rounded font-semibold my-3 tracking-wide`}>Verify OTP</button>
        </form>
        <p>
         Already have account ? <Link to={"/login"} className=" text-blue-600">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;
