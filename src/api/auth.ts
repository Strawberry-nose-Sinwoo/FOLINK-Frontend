import { PostType, signInType, signUpType } from "@/types";
import { CommonAPI } from "./common";
import { AxiosRequestConfig } from "axios"; 

export const postWithToken = async (
  accessToken: string | null,
  url: string,
  data: PostType | signInType | signUpType | FormData,
  config: AxiosRequestConfig = {} 
): Promise<any> => {
  try {
    const response = await CommonAPI.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...config.headers, 
      },
      ...config, 
    });
    return response.data;
  } catch (error) {
    console.error('POST Error: ', error);
    throw error;
  }
};

export const getWithToken = async (
  accessToken: string | null,
  url: string
): Promise<any> => {
  try {
    const response = await CommonAPI.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('GET Error: ', error);
    throw error;
  }
};