import { lazyLoad } from "@/utils/loadable";

export const FeaturePage = lazyLoad(
  () => import("./Feature"),
  (module) => module.default,
);
