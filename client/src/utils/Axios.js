import axios from "axios";
import AllApi, { baseURL } from "../common/commonApi";

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

//sending access token in the header
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//extend the life span of access token with the help of refresh

Axios.interceptors.request.use((response) => {
  return response;
},
async(error)=>{
  let originalRequest = error.config

  if(error.response.status === 401 && !originalRequest.retry){
    originalRequest.retry = true

    const refreshToken = localStorage.getItem("refreshToken")

    if(refreshToken){
      const newAccessToken = await refreshAccessToken(refreshToken)

      if(newAccessToken){
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return Axios(originalRequest)
      }
    }
  }

  return Promise.reject(error)
}
);

const refreshAccessToken = async(refreshToken)=>{
  try {
    const response = await Axios({
      ...AllApi.refreshToken,
      headers : {
        Authorization : `Bearer ${refreshToken}`
      }
    })
    const accessToken = response.data.data.accesstoken
    localStorage.setItem('accesstoken', accessToken)
    return accessToken
  } catch (error) {
    console.log(error)
  }
}

export default Axios;
