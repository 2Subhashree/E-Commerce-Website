import React, { useEffect, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AllApi from "../common/commonApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validValue = Object.values(data).every((el) => el);

  useEffect(() => {
    if (!location?.state?.data?.success) {
      // navigate("/")
    }
    if (location?.state?.email) {
      setData((preve) => {
        return {
          ...preve,
          email: location?.state?.email,
        };
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  console.log("data reset password", data);

  console.log("resetPassword page", location);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(data.newPassword !== data.confirmPassword){
          toast.error(
            "password does not match"
          )
          return
        }

    try {
      const res = await Axios({
        ...AllApi.resetPassword,
        data: data,
      });
      if (res.data.error) {
        toast.error(res.data.message);
      }
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
        setData({
          email: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
      console.log(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div
        className="bg-white my-4 w-full max-w-lg mx-auto rounded-lg p-7
      "
      >
        <p className="font-semibold text-lg mb-2">Enter Your Password</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password :</label>

            <div className="bg-blue-50 p-2 border rounded flex justify-between items-center focus-within:border-green-300">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="w-full outline-none"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
              />
              <div
                onClick={() => setShowPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password :</label>

            <div className="bg-blue-50 p-2 border rounded flex justify-between items-center focus-within:border-green-300">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your confirm password"
              />
              <div
                onClick={() => setShowConfirmPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </div>
            </div>
          </div>

          <button
            disabled={!validValue}
            className={` ${
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } bg-gray-800 text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Change Password
          </button>
        </form>
        <p>
          Already have account ?{" "}
          <Link to={"/login"} className=" text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
