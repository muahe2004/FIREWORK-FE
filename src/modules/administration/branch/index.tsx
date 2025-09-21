import { lazyLoad } from "@/utils/loadable";

export const BranchPage = lazyLoad(
  () => import("./Branch"),
  (module) => module.default,
);
