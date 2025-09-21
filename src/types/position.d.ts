import { IBaseData } from "./base";

export interface IPosition extends IBaseData {
  position_id: string;
  position_name: string;
  description: string;
}

export interface IPositionSearch {
  pageIndex?: number;
  pageSize?: number;
  search_content?: string | null;
}
