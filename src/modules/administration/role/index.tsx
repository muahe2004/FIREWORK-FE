import { lazyLoad } from "@/utils/loadable";

export const RolePage = lazyLoad(
  () => import("./Role"),
  (module) => module.default,
);
