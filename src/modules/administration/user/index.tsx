import { lazyLoad } from "@/utils/loadable";

export const UserPage = lazyLoad(
  () => import("./User"),
  (module) => module.default,
);
