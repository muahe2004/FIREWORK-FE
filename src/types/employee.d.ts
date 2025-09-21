export interface IEmployee {
  employee_id: string;
  fullname: string;
  phone_number: string;
  email: string;
  position_id: number;
  position_name: string;
  role_id: string;
  department_id: number;
  department_name: string;
  password: string;
  active_flag: number;
  created_by_user_id: string;
  created_date_time: Date;
  lu_updated: Date;
  lu_user_id: string;
  branch_name: string;
  branch_id: number;
  customer_id: string;
  customer_name: string;
  tax_code: string;
}

export type IEmployeeDropdown = {
  label: string;
  value: string;
}[];
