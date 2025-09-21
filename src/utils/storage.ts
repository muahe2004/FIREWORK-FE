import { LOCAL_CUSTOMER, LOCAL_EMPLOYEE, LOCAL_USER } from "@/constant/config";
import { decrypt, encrypt } from "@/lib/access";
import { LOGIN_URL } from "@/urls";

const storagePrefix = "CO_";

const storage = {
  getToken: () => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}token`) as string,
    );
  },
  setToken: (token: string) => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },
};

export default storage;

export const storageService = {
  getStorage: (key: string, isParse: boolean = true) => {
    const data = window.localStorage.getItem(`${storagePrefix}${key}`);
    if (!data) return null;
    try {
      const decrypted = JSON.parse(decrypt(data));
      return isParse ? JSON.parse(decrypted || "{}") : decrypted;
    } catch (e) {
      localStorage.clear();
      open(LOGIN_URL);
    }
  },
  setStorage: (key: string, value: string) => {
    window.localStorage.setItem(`${storagePrefix}${key}`, encrypt(value));
  },
  clearStorage: (key: string) => {
    window.localStorage.removeItem(`${storagePrefix}${key}`);
  },
  resetStorage: () => {
    window.localStorage.clear();
  },
};

export const sessionService = {
  getStorage: (key: string) => {
    return JSON.parse(
      window.sessionStorage.getItem(`${storagePrefix}${key}`) || "{}",
    );
  },
  setStorage: (key: string, value: any) => {
    window.sessionStorage.setItem(
      `${storagePrefix}${key}`,
      JSON.stringify(value),
    );
  },
  clearStorage: (key: string) => {
    window.sessionStorage.removeItem(`${storagePrefix}${key}`);
  },
};

export const clearLogout = () => {
  storageService.clearStorage(LOCAL_USER);
  storageService.clearStorage(LOCAL_EMPLOYEE);
  storageService.clearStorage(LOCAL_CUSTOMER);
  storage.clearToken();
};
