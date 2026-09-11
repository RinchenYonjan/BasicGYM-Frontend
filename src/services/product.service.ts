import axios from "axios";
import AppConfig from "../config/app_config";

export const getAllProducts = async(cursor?: string | null) => {

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
    
    console.log("Product API response:", response.data);

    return response.data;
  
  }catch(err:any){

    console.log("Product API error:", err.response?.data || err.message);
    throw err;

  }

};