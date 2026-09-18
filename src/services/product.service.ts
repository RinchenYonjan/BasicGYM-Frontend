import axios from "axios";
import AppConfig from "../config/app_config";


export const getAllProduct = async(cursor?: string | null) => {

  try{
    const response = await axios.get(
      `${AppConfig.baseURL}/api/product/all-product`,
      {
        params: {
          limit: 10,
          cursor: cursor || undefined,
        },
      }
    );
    
    console.log("getAllProduct API response:", response.data);

    return response.data;
  
  }catch(err:any){

    console.error("Error in getAllProduct service:", err.response?.data || err.message);
    throw err;

  }

};


export const getProductById = async(id: string) => { 

  try{
    console.log("THis is getProductById:",id)
    
    const response = await axios.get( 
      `${AppConfig.baseURL}/api/product/get-product/${id}` 
    ); 

    console.log("getProductById API response:", response.data);
      
    return response.data; 
  
  }catch(err:any){

    console.error("Error in getProductById service:", err.response?.data || err.message);
    throw err;

  }

};