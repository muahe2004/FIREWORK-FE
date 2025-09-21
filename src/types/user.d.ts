import { IBaseData } from "./base";

export interface IUser extends IBaseData {
  email: string;
  user_name: string;
  user_id: string;
  date_of_birth: string;
  full_name: string;
  description: string;
  gender: number;
  online_flag: number;
  phone_number: string;
  password: string;
  position_id: number;
  department_id: number;
  branch_id: number;
  employee_customer_for_detail: ICustomerList[];
  list_json_employee_customer: ICustomerList[];
}

export interface IUserSearch {
  pageIndex?: number;
  pageSize?: number;
  search_content?: string | null;
  user_id?: string;
  branch_id?: string | null;
  department_id?: string | null;
  customer_id?: string | null;
}

interface ICustomerList {
  customer_id: string;
  customer_name: string;
  tax_code: string;
}

export interface IAdminResetPassword {
  user_id: string;
  lu_user_id: string;
}

export interface IUserResetPassword {
  user_name: string;
  email: string;
}

export interface IUserChangePassword {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
  user_id: string;
  lu_user_id: string;
}
