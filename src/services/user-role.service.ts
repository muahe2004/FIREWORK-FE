import { DefaultOptionType } from "antd/es/select";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseDelete, IBaseResponse } from "@/types/base";
import { IUserRole, IUserRoleSearch } from "@/types/user-role";

const prefix = `${API_CORE}/user-role`;

export const searchUserRoles = async (
  data: IUserRoleSearch,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/search`, data);

  return res?.data;
};

export const getDropdownUserRoles = async (): Promise<DefaultOptionType[]> => {
  const res = await apiClient.get(`${prefix}/dropdown`);
  return res.data;
};

export const getUserRoleDetail = async (id: string): Promise<IUserRole> => {
  const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

  return res?.data;
};

export const createUserRole = async (data: any): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res?.data;
};

export const updateUserRole = async (
  data: IUserRole,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res?.data;
};

export const deleteUserRole = async (
  data: IBaseDelete,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);

  return res?.data;
};
