import { getToken, setToken } from "@/helper/tokenStorage";
import axios from "axios";
import AppConfig from "../config/app_config";


export const loginUser = async(email:string, password:string)=>{
    try{
        console.log("This is email",email);
        console.log("This is password",password)

        const url = `${AppConfig.baseURL}/api/auth/login-user`;

        console.log("Request URL:", url);

        const response = await axios.post(url,{
            email:email,
            password:password
        })

        console.log("This is response",response.data);
        console.log("This is data only from rseponse",response?.data?.data.token)
        const token = response?.data?.data.token;

        const t= await setToken(token);
        console.log("This is t",t);
        
        return response.data;

    }catch(err:any){

        console.log("this is error",err);
        console.log("error response:", err?.response?.data);
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

        console.log("this is error",err.response.data.message);
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
        console.error("this is error from sendotp",err?.response.data);
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

    console.log("Error in createUserPassword API:", error?.response?.data || error?.message || error);
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

    console.log("Error in getUserProfile API:", error?.response?.data || error?.message || error);
    throw error;
  
  }
};
