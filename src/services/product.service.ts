import { API_CORE } from "@/constant/config";
import { apiClient } from "@/lib/api";
import { IBaseDelete, IBaseResponse } from "@/types/base";
import { IProduct, IProductSearch } from "@/types/product";

const prefix = `${API_CORE}/products`;

export const searchProducts = async (
  data: IProductSearch,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/search`, data);
  return res?.data;
};

// export const getDropdownProducts = async (): Promise<any> => {
//   const res = await apiClient.get(`${prefix}/dropdown`);
//   return res.data;
// };

// export const getProductDetail = async (id: string): Promise<IProduct> => {
//   const res = await apiClient?.get(`${prefix}/getbyid/${id}`);

//   return res?.data;
// };

export const createProduct = async (data: IProduct): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/create`, data);

  return res?.data;
};

export const updateProduct = async (data: IProduct): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/update`, data);

  return res?.data;
};

export const deleteProduct = async (
  data: IBaseDelete,
): Promise<IBaseResponse> => {
  const res = await apiClient?.post(`${prefix}/delete`, data);
  return res?.data;
};