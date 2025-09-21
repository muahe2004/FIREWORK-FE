import CryptoJS from "crypto-js";
import _ from "lodash";

import { LOCAL_USER } from "@/constant/config";
import { storageService } from "@/utils/storage";

export const ACCESSES = {
  ADD_CUSTOMER: "customer_add",
  CO_CANCEL: "co_cancel",
  CO_EDIT: "co_edit",
  CO_EMPLOYEE_DROPDOWN: "co_employee_dropdown",
};

export const checkAccess = (role: string) => {
  const roles = storageService.getStorage(LOCAL_USER)?.actions || [];
  return !!_.find(roles, { action_code: role });
};

const SECRET_PASSWORD = "left to right! ha!";

export const encrypt = (value: any) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(value),
    SECRET_PASSWORD,
  ).toString();
};

export const decrypt = (encrypted: string) => {
  return CryptoJS.AES.decrypt(encrypted, SECRET_PASSWORD).toString(
    CryptoJS.enc.Utf8,
  );
};
