import { IBaseData } from "./base";

export interface IPermission extends IBaseData {
  role_permission_id: string;
  role_id: string;
  function_id: string;
  action_code: string;
}

export interface IPermissionCreate {
  role_permission_list: IPermission[];
  created_by_user_id: string;
}

export interface IPermissionSearch {
  pageIndex?: number;
  pageSize?: number;
  search_content?: string | null;
}
