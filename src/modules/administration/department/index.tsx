import { lazyLoad } from "@/utils/loadable";

export const DepartmentPage = lazyLoad(
  () => import("./Department"),
  (module) => module.default,
);
