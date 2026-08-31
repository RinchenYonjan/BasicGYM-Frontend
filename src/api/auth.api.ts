import { setToken } from "@/helper/tokenStorage";
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
