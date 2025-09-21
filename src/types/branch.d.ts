import { IBaseData } from "./base";

export interface IBranch extends IBaseData {
  branch_id: string;
  branch_name: string;
  phone?: string;
  fax?: string;
  address?: string;
}

export interface IBranchSearch {
  pageIndex?: number;
  pageSize?: number;
  search_content?: string | null;
}
