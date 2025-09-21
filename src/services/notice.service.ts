import { AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api";
import { IBaseListItem } from "@/types/base";

const prefix = `/notify`;

export const getNotify = async (id: string): Promise<any> => {
  const res = await apiClient.get(`${prefix}/get-new-history/` + id, {
    baseURL: import.meta.env.VITE_BASE_URL + "-chat",
  });
  return res.data;
};

export const getNotifies = async (
  params: AxiosRequestConfig["params"],
): Promise<IBaseListItem<any>> => {
  const res = await apiClient.post(`${prefix}/search-notify`, params, {
    baseURL: import.meta.env.VITE_BASE_URL + "-chat",
  });

  return res.data;
};

export const createNotify = async (data: {}): Promise<any> => {
  const res = await apiClient?.post(`${prefix}/send-document-request`, data, {
    baseURL: import.meta.env.VITE_BASE_URL + "-chat",
  });

  return res.data;
};

export const deleteNotifies = async (data: any): Promise<any> => {
  const res = await apiClient.post(`${prefix}/delete-notify`, data, {
    baseURL: import.meta.env.VITE_BASE_URL + "-chat",
  });

  return res.data;
};

export const getManagers = async (user_id: string): Promise<string[]> => {
  const res = await apiClient.get(`${prefix}/get-manager/` + user_id, {
    baseURL: import.meta.env.VITE_BASE_URL + "-chat",
  });

  return res.data;
};

export const updateNotify = async (data: {}): Promise<any> => {
  const res = await apiClient?.post(`${prefix}/update-notify`, data, {
    baseURL: import.meta.env.VITE_BASE_URL + "-chat",
  });

  return res.data;
};
