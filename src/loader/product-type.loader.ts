import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  // createProduct,
  // deleteProduct,
  // getBranchDetail,
  getDropdownProductTypes,
  // searchProducts,
  // updateProduct,
} from "@/services/product-type.service";

const CACHE_PRODUCT_TYPE = {
  // SEARCH: "PRODUCTS-TYPES",
  // DETAIL: "BRANCH_DETAIL",
  DROPDOWN: "PRODUCTS_TYPES",
};

const useDropdownProductTypes = ({ config}: {config?: QueryConfig<typeof getDropdownProductTypes>;}) => {
  return useQuery<ExtractFnReturnType<typeof getDropdownProductTypes>>({
    ...config,
    queryKey: [CACHE_PRODUCT_TYPE.DROPDOWN],
    queryFn: () => getDropdownProductTypes(),
  });
};

// Get detail
// const useGetBranchDetail = ({
//   id,
//   config,
// }: {
//   id: string;
//   config?: QueryConfig<typeof getBranchDetail>;
// }) => {
//   return useQuery<ExtractFnReturnType<typeof getBranchDetail>>({
//     ...config,
//     queryKey: [CACHE_BRANCH.DETAIL, id],
//     queryFn: () => getBranchDetail(id),
//   });
// };

// Search list
// const useSearchProducts = ({
//   params,
//   config,
// }: {
//   params: AxiosRequestConfig["params"];
//   config?: QueryConfig<typeof searchProducts>;
// }) => {
//   return useQuery<ExtractFnReturnType<typeof searchProducts>>({
//     ...config,
//     queryKey: [CACHE_PRODUCT.SEARCH, params],
//     queryFn: () => searchProducts(params),
//   });
// };

// Update
// const useUpdateProduct = ({
//   config,
// }: {
//   config?: MutationConfig<typeof updateProduct>;
// }) => {
//   return useMutation({
//     onMutate: () => {},
//     onError: () => {},
//     onSuccess: () => {},
//     ...config,
//     mutationFn: updateProduct,
//   });
// };

// Create
// const useCreateProduct = ({
//   config,
// }: {
//   config?: MutationConfig<typeof createProduct>;
// }) => {
//   return useMutation({
//     onMutate: () => {},
//     onError: () => {},
//     onSuccess: () => {},
//     ...config,
//     mutationFn: createProduct,
//   });
// };

// Delete
// const useDeleteProduct = ({
//   config,
// }: {
//   config?: MutationConfig<typeof deleteProduct>;
// }) => {
//   return useMutation({
//     onMutate: () => {},
//     onError: () => {},
//     onSuccess: () => {},
//     ...config,
//     mutationFn: deleteProduct,
//   });
// };

export {
  CACHE_PRODUCT_TYPE,
  useDropdownProductTypes,
  // useSearchProducts,
  // useCreateProduct,
  // useDeleteProduct,
  // useUpdateProduct,
  // useGetBranchDetail,
};
