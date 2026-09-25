import axios from "axios";
import AppConfig from "../config/app_config";


type PaymentItem = {
  productId: string;
  quantity: number;
};

export interface CODOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateCODOrderData {
  items: CODOrderItem[];
}


export const initiateEsewaPayment = async(items: PaymentItem[], token: string) => {

  const response = await axios.post(
    `${AppConfig.baseURL}/api/payment/esewa/initiate`,
    {
      items,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


export async function createCODOrder(data: CreateCODOrderData, token: string) {
  
  const response = await axios.post(
    `${AppConfig.baseURL}/api/order/cod`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}


