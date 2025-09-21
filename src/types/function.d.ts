import { IBaseData } from "./base";

export interface IFunction extends IBaseData {
  function_id: string;
  key: string;
  parent_id: string;
  function_name: string;
  url: string;
  description?: string;
  level: number;
  sort_order?: number;
}
