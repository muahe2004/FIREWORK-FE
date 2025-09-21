import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseDelete, IBaseResponse } from "@/types/base";
import { IDepartment, IDepartmentSearch } from "@/types/department";

const prefix = `${API_CORE}/departments`;

export const searchDepartments = async (
  data: IDepartmentSearch,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/search`, data);

  return res?.data;
};

export const getDropdownDepartments = async (): Promise<any> => {
  const res = await apiClient.get(`${prefix}/dropdown`);
  return res.data;
};

export const getDepartmentDetail = async (id: string): Promise<IDepartment> => {
  const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

  return res?.data;
};

export const createDepartment = async (
  data: IDepartment,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res?.data;
};

export const updateDepartment = async (
  data: IDepartment,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res?.data;
};

export const deleteDepartment = async (
  data: IBaseDelete,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);

  return res?.data;
};
