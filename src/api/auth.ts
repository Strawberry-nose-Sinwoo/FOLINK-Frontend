import { PostType } from "@/types";
import { CommonAPI } from "./common";

export const postWithToken = async (
    accessToken: string | null,
    url: string,
    data: PostType
  ): Promise<any> => {
    try {
      const response = await CommonAPI.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("POST Error: ", error);
      throw error;
    }
};