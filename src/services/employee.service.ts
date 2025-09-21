import { AxiosRequestConfig } from "axios";

import { API_CORE } from "@/constant/config";
import { apiClient, filterEmptyString } from "@/lib/api";
import { IBaseListItem } from "@/types/base";
import { IEmployee } from "@/types/employee";

const prefix = `${API_CORE}/employees`;

export const getQLNDs = async ({
  params,
}: {
  params: AxiosRequestConfig["params"];
}): Promise<IBaseListItem<IEmployee>> => {
  const res = await apiClient.post(
    `${prefix}/search`,
    filterEmptyString(params),
  );

  return res.data;
};

export const getQLND = async ({ id }: { id: string }): Promise<IEmployee> => {
  const res = await apiClient.get(`${prefix}/getbyid/${id}`);
  return res.data;
};
