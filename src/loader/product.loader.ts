import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  checkProductCode,
  createProduct,
  deleteProduct,
  // getBranchDetail,
  // getDropdownBranches,
  searchProducts,
  updateProduct,
} from "@/services/product.service";

const CACHE_PRODUCT = {
  SEARCH: "PRODUCTS",
  // DETAIL: "BRANCH_DETAIL",
  // DROPDOWN: "BRANCH_DROPDOWN",
};

// const useDropdownBranches = ({
//   config,
// }: {
//   config?: QueryConfig<typeof getDropdownBranches>;
// }) => {
//   return useQuery<ExtractFnReturnType<typeof getDropdownBranches>>({
//     ...config,
//     queryKey: [CACHE_BRANCH.DROPDOWN],
//     queryFn: () => getDropdownBranches(),
//   });
// };

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
const useSearchProducts = ({
  params,
  config,
}: {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<typeof searchProducts>;
}) => {
  return useQuery<ExtractFnReturnType<typeof searchProducts>>({
    ...config,
    queryKey: [CACHE_PRODUCT.SEARCH, params],
    queryFn: () => searchProducts(params),
  });
};

// Update
const useUpdateProduct = ({
  config,
}: {
  config?: MutationConfig<typeof updateProduct>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateProduct,
  });
};

// Create
const useCreateProduct = ({
  config,
}: {
  config?: MutationConfig<typeof createProduct>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createProduct,
  });
};

// Delete
const useDeleteProduct = ({
  config,
}: {
  config?: MutationConfig<typeof deleteProduct>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteProduct,
  });
};

export {
  CACHE_PRODUCT,
  // useDropdownBranches,
  useSearchProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  // useGetBranchDetail,
};
