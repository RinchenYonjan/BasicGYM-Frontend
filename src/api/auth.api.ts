import axios from "axios";
import AppConfig from "../config/app_config";

import { setToken } from "@/helper/tokenStorage";


export const loginUser = async(email:string, password:string)=>{
    try{
        console.log("this is email",email);
        console.log("This is password",password)

        const url = `${AppConfig.baseURL}/api/auth/login-user`;

        console.log("Request URL:", url);

        const response = await axios.post(url,{
            email:email,
            password:password
        })

        console.log("this is response",response.data);
        console.log("This is data only from rseponse",response?.data?.data.token)
        const token = response?.data?.data.token;

        const t= await setToken(token);
        console.log("This is t",t);
        
        return response.data;

    }catch(err:any){

        console.log("this is error",err);
        console.log("error message:", err?.message);
        console.log("error response:", err?.response?.data);
        throw err;

    }

}


