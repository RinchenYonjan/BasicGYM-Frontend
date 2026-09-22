import AppConfig from "@/config/app_config";
import { getToken } from "@/helper/tokenStorage";
import axios from "axios";

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;

  product: {
    id: string;
    product_name: string;
    product_category: string;
    product_price: number;
    product_image: string;
  };
}

export interface AddToCartData {
  product_id: string;
  quantity?: number;
}

export interface UpdateCartData {
  product_id: string;
  quantity: number;
}


/* Get Authorization Header */
const getAuthHeaders = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


/* Add Product To Cart */
export const addToCart = async (data: AddToCartData) => {
  const headers = await getAuthHeaders();

  const response = await axios.post(
    `${AppConfig.baseURL}/api/cartItem/add-cartItem`,
    data,
    { headers }
  );

  return response.data;
};


/* Get User Cart */
export const getCart = async () => {
  const headers = await getAuthHeaders();

  const response = await axios.get(
    `${AppConfig.baseURL}/api/cartItem/get-cartItem`,
    { headers }
  );

  return response.data;
};


/* Update Cart Quantity */
export const updateCartItem = async (data: UpdateCartData) => {
  const headers = await getAuthHeaders();

  const response = await axios.patch(
    `${AppConfig.baseURL}/api/cartItem/put-cartItem`,
    data,
    { headers }
  );

  return response.data;
};


/* Remove Product From Cart */
export const removeFromCart = async (productId: string) => {
  const headers = await getAuthHeaders();

  const response = await axios.delete(
    `${AppConfig.baseURL}/api/cartItem/remove/${productId}`,
    { headers }
  );

  return response.data;
};