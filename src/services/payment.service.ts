// services/PaymentService.ts
import axios from "axios";
import AppConfig from "../config/app_config";

export const initiateEsewaPayment = async (
  productId: string,
  quantity: number
) => {
  const response = await axios.post(
    `${AppConfig.baseURL}/api/payment/esewa/initiate`,
    {
      productId,
      quantity,
    }
  );

  return response.data;
};