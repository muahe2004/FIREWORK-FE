import { lazyLoad } from "@/utils/loadable";

export const ProductPage = lazyLoad(
    () => import("./Product"),
    (module) => module.default,
);