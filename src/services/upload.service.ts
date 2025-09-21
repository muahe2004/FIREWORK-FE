import { API_DOWNLOAD } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseUpload } from "@/types/base";

const uploadFiles = async (data: FormData): Promise<any> => {
  return apiClient
    .post(`${API_DOWNLOAD}/upload-multi`, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data;",
      },
    })
    .then((res) => {
      if (res.data.message && res.data.message !== "") {
        throw new Error(res.data.message);
      } else {
        return res.data;
      }
    });
};

export const uploadFile = async (data: FormData): Promise<IBaseUpload> => {
  return apiClient
    .post(`${API_DOWNLOAD}/upload`, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data;",
      },
    })
    .then((res) => {
      if (res.data.message && res.data.message !== "") {
        throw new Error(res.data.message);
      } else {
        return res.data;
      }
    });
};

export { uploadFiles };
