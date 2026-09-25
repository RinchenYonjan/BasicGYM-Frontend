import AppConfig from "@/config/app_config";
import { getToken } from "@/helper/tokenStorage";
import axios, { AxiosError } from "axios";

/* Types */
export interface CartProduct {
  id: string;
  product_name: string;
  product_category: string;
  product_price: number;
  product_image: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
}

export interface AddToCartData {
  product_id: string;
  quantity?: number;
}

export interface UpdateCartData {
  product_id: string;
  quantity: number;
}

/* API Response Types */
export interface CartResponse {
  success: boolean;
  message?: string;
  data: CartItem[];
}

export interface CartMutationResponse {
  success: boolean;
  message?: string;
  data?: CartItem;
}


/* Authorization Header */
const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


/* Add Product To Cart */
export const addToCart = async (
  data: AddToCartData
): Promise<CartMutationResponse> => {
  try {
    const headers = getAuthHeaders();

    const response = await axios.post<CartMutationResponse>(
      `${AppConfig.baseURL}/api/cartItem/add-cartItem`,
      data,
      {
        headers,
      }
    );

    return response.data;
    
  } catch (error) {
    const axiosError = error as AxiosError<{
      success?: boolean;
      message?: string;
    }>;

    console.error(
      "Add to cart error:",
      axiosError.response?.data || axiosError.message
    );

    throw error;
  }
};


/* Get User Cart */
export const getCart = async (): Promise<CartResponse> => {
  try {
    const headers = getAuthHeaders();

    const response = await axios.get<CartResponse>(
      `${AppConfig.baseURL}/api/cartItem/get-cartItem`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      success?: boolean;
      message?: string;
    }>;

    console.error(
      "Get cart error:",
      axiosError.response?.data || axiosError.message
    );

    throw error;
  }
};


/* Update Cart Quantity */
export const updateCartItem = async (
  data: UpdateCartData
): Promise<CartMutationResponse> => {
  try {
    const headers = getAuthHeaders();

    const response = await axios.patch<CartMutationResponse>(
      `${AppConfig.baseURL}/api/cartItem/put-cartItem`,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      success?: boolean;
      message?: string;
    }>;

    console.error(
      "Update cart error:",
      axiosError.response?.data || axiosError.message
    );

    throw error;
  }
};


/* Remove Product From Cart */
export const removeFromCart = async (
  productId: string
): Promise<CartMutationResponse> => {
  try {
    const headers = getAuthHeaders();

    const response = await axios.delete<CartMutationResponse>(
      `${AppConfig.baseURL}/api/cartItem/remove/${productId}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      success?: boolean;
      message?: string;
    }>;

    console.error(
      "Remove cart item error:",
      axiosError.response?.data || axiosError.message
    );

    throw error;
  }
};