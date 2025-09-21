import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseDelete, IBaseResponse } from "@/types/base";
import { IBranch, IBranchSearch } from "@/types/branch";

const prefix = `${API_CORE}/branchs`;

export const searchBranches = async (
  data: IBranchSearch,
): Promise<IBaseResponse> => {
  const url = `${prefix}/search`;
  console.log("🔍 [searchBranches] URL:", url, "Payload:", data);
  const res = await apiClient?.post(`${prefix}/search`, data);

  return res?.data;
};

export const getDropdownBranches = async (): Promise<any> => {
  const res = await apiClient.get(`${prefix}/dropdown`);
  return res.data;
};

export const getBranchDetail = async (id: string): Promise<IBranch> => {
  const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

  return res?.data;
};

export const createBranch = async (data: IBranch): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res?.data;
};

export const updateBranch = async (data: IBranch): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res?.data;
};

export const deleteBranch = async (
  data: IBaseDelete,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);

  return res?.data;
};
