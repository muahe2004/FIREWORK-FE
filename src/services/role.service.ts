import { DefaultOptionType } from "antd/es/select";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseDelete, IBaseResponse } from "@/types/base";
import { IRole, IRoleSearch } from "@/types/role";

const prefix = `${API_CORE}/role`;

export const searchRoles = async (
  data: IRoleSearch,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/search`, data);

  return res?.data;
};

export const getDropdownRoles = async (): Promise<DefaultOptionType[]> => {
  const res = await apiClient.get(`${prefix}/dropdown`);
  return res.data;
};

export const getRoleUserDetail = async (id: string): Promise<IRole[]> => {
  const res = await apiClient?.get(`${prefix}/getbyuserid/${id}`);

  return res?.data;
};

export const getRoleDetail = async (id: string): Promise<IRole> => {
  const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

  return res?.data;
};

export const createRole = async (data: IRole): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res?.data;
};

export const updateRole = async (data: IRole): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res?.data;
};

export const deleteRole = async (data: IBaseDelete): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);

  return res?.data;
};
