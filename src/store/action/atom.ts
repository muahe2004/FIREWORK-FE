import { atom } from "recoil";

export const dataLackedMaterialState = atom<number>({
  key: "dataLackedMaterialState",
  default: 0,
});
