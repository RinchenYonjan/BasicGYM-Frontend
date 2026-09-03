import AppConfig from "@/config/app_config";
import { getToken } from "@/helper/tokenStorage";
import axios from "axios";

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


export const editUserProfile = async (username: string, phonenumber: string, address: string) => {
  
  try {
    const token = await getToken();

    if(!token){
      throw new Error("Token not found");
    }

    const url = `${AppConfig.baseURL}/api/user/edit-user`;

    console.log("Edit profile URL:", url);

    const response = await axios.put(url,
      {
        username,
        phonenumber,
        address,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Edit profile response:",response.data);
    return response.data;

  }catch(error:any){

    console.log("Error in editUserProfile API:",error?.response?.data || error?.message || error);
    throw error;
  
  }
};

export const changeUserPassword = async(currentPassword: string, newPassword: string) => {
  try {
    const token = await getToken();

    const response = await axios.put(
      `${AppConfig.baseURL}/api/user/change-password`,
      {
        currentPassword,
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

    console.log("Error in changeUserPassword API:", error?.response?.data || error?.message || error);
    throw error;

  }
};

// html

//ui code + ts code --> tsx()

// ts code --> ts
