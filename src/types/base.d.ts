declare type RangeValue<DateType> =
  | [EventValue<DateType>, EventValue<DateType>]
  | null;

export interface IBaseDelete {
  list_json: {}[];
  updated_by_id?: string;
  lu_user_id?: string;
}
export interface IBaseData {
  active_flag?: number;
  created_by_user_id?: string;
  created_user?: string;
  created_date_time?: Date;
  lu_updated?: Date;
  lu_user_id?: string;
  message?: string;
  success?: boolean;
  RowNumber?: number;
  RecordCount?: number;
}

export interface IBaseResponse<T = any> {
  message?: string;
  data?: T;
  pageCount?: number;
  totalItems?: number;
  success?: boolean;
  results?: boolean;
}

export type IBaseDeleteItems<T> = {
  list_json: T[];
  updated_by_id: string;
};

export type IBaseDropdown = {
  label: string;
  value: string;
}[];

export type IBaseListItem<T> = {
  data: (T & {
    RecordCount: string;
    RowNumber: number;
  })[];
  totalItems: number;
  page: number;
  pageSize: number;
};

export type IBaseUpload = {
  result: boolean;
  path: string;
  message: string;
  success: boolean;
};
