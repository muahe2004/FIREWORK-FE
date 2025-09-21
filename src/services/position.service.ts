import { DefaultOptionType } from "antd/es/select";

import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseDelete, IBaseResponse } from "@/types/base";
import { IPosition, IPositionSearch } from "@/types/position";

const prefix = `${API_CORE}/positions`;

export const searchPositions = async (
  data: IPositionSearch,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/search`, data);

  return res?.data;
};

export const getDropdownPositions = async (): Promise<DefaultOptionType[]> => {
  const res = await apiClient.get(`${prefix}/dropdown`);
  return res.data;
};

export const getPositionDetail = async (id: string): Promise<IPosition> => {
  const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

  return res?.data;
};

export const createPosition = async (
  data: IPosition,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res?.data;
};

export const updatePosition = async (
  data: IPosition,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res?.data;
};

export const deletePosition = async (
  data: IBaseDelete,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);

  return res?.data;
};
