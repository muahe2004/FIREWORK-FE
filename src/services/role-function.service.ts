import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseResponse } from "@/types/base";

const prefix = `${API_CORE}/role-function`;

export const createPerFuncForRole = async (
  data: any,
): Promise<IBaseResponse> => {
  const res = await apiClient.post(`${prefix}/create`, data);

  return res.data;
};
