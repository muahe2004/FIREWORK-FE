import { atom } from "recoil";

export const customerFilterState = atom({
  key: "customerFilterState", // unique ID (with respect to other atoms/selectors)
  default: "",
});

export const employeeFilterState = atom({
  key: "employeeFilterState", // unique ID (with respect to other atoms/selectors)
  default: "",
});

export const totalFilterState = atom({
  key: "totalFilterState",
  default: 0,
});
