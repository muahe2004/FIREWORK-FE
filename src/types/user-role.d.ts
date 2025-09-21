import { IBaseData } from "./base";

export interface IUserRole extends IBaseData {
  role_id: string;
  role_code: string;
  role_name: string;
  description: string;
}

export interface IUserRoleSearch {
  pageIndex?: number;
  pageSize?: number;
  search_content?: string | null;
  user_id?: string;
}
