import { IBaseData } from "./base";

export interface IProduct extends IBaseData {
  product_id: string;
  product_code: string;
  product_name: string;
  image_url: string;
  type_id: string;
  price: string;
  stock: string;
  unit: string;
  description: string;
}

export interface IProductSearch {
  pageIndex?: number;
  pageSize?: number;
  search_content?: string | null;
}