import { DefaultOptionType } from "antd/es/select";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseDelete, IBaseResponse } from "@/types/base";
import {
  IUser,
  IUserChangePassword,
  IUserResetPassword,
  IUserSearch,
} from "@/types/user";

const prefix = `${API_CORE}/users`;

interface Props {
  user_name: string;
  password: string;
}

export const loginService = async (data: Props): Promise<any> => {
  const res = await apiClient?.post(`login`, data);

  return res?.data;
};

export const authorization = async (): Promise<any> => {
  const res = await apiClient?.get(`${prefix}/me`);

  return res?.data;
};

export const searchUsers = async (
  data: IUserSearch,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/search`, data);

  return res?.data;
};

export const getUserDetail = async (id: string): Promise<IUser> => {
  const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

  return res?.data;
};

export const getFunctionsByUser = async (user_id: string): Promise<any> => {
  const res = await apiClient?.get(`${prefix}/get-features-user/${user_id}`);

  return res?.data;
};

export const getUsersDropdown = async (
  id: string,
): Promise<DefaultOptionType[]> => {
  const res = await apiClient?.get(
    `${API_CORE}/employees/dropdown-employeeid/${id}`,
  );

  return res.data;
};

export const createUser = async (data: IUser): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res?.data;
};

export const updateUser = async (data: IUser): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res?.data;
};

export const deleteUser = async (data: IBaseDelete): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);

  return res?.data;
};

export const lockUser = async (data: {
  user_id: string;
  online_flag: number;
  lu_user_id: string;
}): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/lock-user`, data);

  return res?.data;
};

export const resetPasswordAdminUser = async (data: {
  user_id: string;
  lu_user_id: string;
}): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/reset-password-by-admin`, data);

  return res?.data;
};

export const resetPasswordUser = async (
  data: IUserResetPassword,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`/reset-password`, data);

  return res?.data;
};

export const changePasswordUser = async (
  data: IUserChangePassword,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/change-password`, data);

  return res?.data;
};
