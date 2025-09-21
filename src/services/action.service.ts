import { DefaultOptionType } from "antd/es/select";
import { AxiosRequestConfig } from "axios";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IAction } from "@/types/action";
import { IBaseDelete, IBaseResponse } from "@/types/base";

const prefix = `${API_CORE}/action`;

export const getActionsDropdown = async (): Promise<DefaultOptionType[]> => {
  const res = await apiClient?.get(`${prefix}/get-dropdown`);

  return res.data;
};

export const searchActions = async (
  params: AxiosRequestConfig["params"],
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/search`, params);

  return res.data;
};

export const getActionDetail = async (
  id: string | number,
): Promise<IAction> => {
  const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

  return res.data;
};

export const createAction = async (data: IAction): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res.data;
};

export const updateAction = async (data: IAction): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res.data;
};

export const deleteAction = async (
  data: IBaseDelete,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);

  return res.data;
};
