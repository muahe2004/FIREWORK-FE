import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseResponse } from "@/types/base";
import { IPermissionCreate } from "@/types/permission";

const prefix = `${API_CORE}/permission`;

export const createPermissionForFunction = async (
  data: IPermissionCreate,
): Promise<IBaseResponse> => {
  const res = await apiClient.post(`${prefix}/create`, data);

  return res.data;
};

export const getPermissionsByFunction = async (params: any): Promise<any> => {
  const res = await apiClient.get(
    `${prefix}/get/${params.role_id}/${params.function_id}`,
  );
  return res.data;
};
