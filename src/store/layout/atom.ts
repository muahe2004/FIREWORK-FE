import { atom } from "recoil";

export const collapsedSidebarState = atom({
  key: "collapsedSidebarState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
