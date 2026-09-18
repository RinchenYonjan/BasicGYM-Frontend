// services/PaymentService.ts
import axios from "axios";
import AppConfig from "../config/app_config";

type PaymentItem = {
  productId: string;
  quantity: number;
};

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