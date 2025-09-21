import { AxiosRequestConfig } from "axios";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseDelete, IBaseResponse } from "@/types/base";
import { IFunction } from "@/types/function";

const prefix = `${API_CORE}/function`;

export const getFunctionsDropdown = async (): Promise<any> => {
  const res = await apiClient?.get(`${prefix}/get-dropdown`);

  return res.data;
};

export const searchFunctions = async (
  params: AxiosRequestConfig["params"],
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/search`, params);

  return res.data;
};

export const getFunctionDetail = async (
  id: string | number,
): Promise<IFunction> => {
  const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

  return res.data;
};

export const getFunctionByRole = async (id: string): Promise<IFunction> => {
  const res = await apiClient.get(`${prefix}/getbyrole/` + id);
  return res.data;
};

export const createFunction = async (
  data: IFunction,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res.data;
};

export const updateFunction = async (
  data: IFunction,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res.data;
};

export const deleteFunction = async (
  data: IBaseDelete,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);

  return res.data;
};
