import { getToken, setToken } from "@/helper/tokenStorage";
import axios from "axios";
import AppConfig from "../config/app_config";


export const loginUser = async(email:string, password:string)=>{

  try{
    const url = `${AppConfig.baseURL}/api/auth/login-user`;
    
    console.log("Request URL:", url);
    
    const response = await axios.post(url,{
      email:email,
      password:password
    })
    
    console.log("This is response",response.data);
    console.log("This is email from response",email);
    console.log("This is password from response",password)
    console.log("This is token from response",response?.data?.data.token)
    
    const token = response?.data?.data.token;

    const t= await setToken(token);
    console.log("This is t",t);
        
    return response.data;

  }catch(err:any){

    console.error("Error in loginUser service:", err?.response?.data);
    throw err;

  }

}


export const verifyOtp = async(email:string,otp:string)=>{

  try{
    const url = `${AppConfig.baseURL}/api/auth/verify-otp`;

    const response = await axios.post(url,{
      email,
      otp
    })

    console.log("this is response",response?.data?.message);
    return response?.data?.message;
    
  }catch(err:any){

    console.error("Error in verifyOTP service:",err.response.data.message);
    throw err;

  }

}


export const sendOtp =async(email:string)=>{

  const url = `${AppConfig.baseURL}/api/auth/send-otp`;

  try{
    const response = await axios.post(url,{
      email
    })
    
    console.log("this is repsonse from sendotp",response.data);
    return response?.data?.message;

  }catch(err:any){

    console.error("Error in sendOTP service:",err?.response.data);
    throw err;
  
  }

}


export const createUserPassword = async(newPassword: string) => {

  try {
    const token = await getToken();

    const response = await axios.put(
      `${AppConfig.baseURL}/api/user/create-password`,
      {
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error: any) {

    console.error("Error in createUserPassword service:", error?.response?.data || error?.message || error);
    throw error;

  }

};


export const getUserProfile = async() => {

  try {
    const token = await getToken();

    if(!token){
      throw new Error("Token not found");
    }

    const url = `${AppConfig.baseURL}/api/user/get-user`;

    console.log("Profile API URL:", url);
    console.log("Token exists:", !!token);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Profile response:", response.data);
    return response.data;

  }catch(error: any){

    console.error("Error in getUserProfile service:", error?.response?.data || error?.message || error);
    throw error;
  
  }
  
};
