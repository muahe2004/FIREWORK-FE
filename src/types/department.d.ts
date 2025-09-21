import { IBaseData } from "./base";

export interface IDepartment extends IBaseData {
  department_id: string;
  department_name: string;
  phone: string;
  fax: string;
  address: string;
}

export interface IDepartmentSearch {
  pageIndex?: number;
  pageSize?: number;
  search_content?: string | null;
}
