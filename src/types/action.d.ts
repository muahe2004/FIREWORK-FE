import { IBaseData } from "./base";

export interface IAction extends IBaseData {
  action_code: string;
  function_id: string;
  action_name: string;
  action_api_url: string;
  description: string;
}

export interface IActionSearch {
  pageIndex?: number;
  pageSize?: number;
  search_content?: string | null;
}
