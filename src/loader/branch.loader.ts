import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  createBranch,
  deleteBranch,
  getBranchDetail,
  getDropdownBranches,
  searchBranches,
  updateBranch,
} from "@/services/branch.service";

const CACHE_BRANCH = {
  SEARCH: "BRANCHES",
  DETAIL: "BRANCH_DETAIL",
  DROPDOWN: "BRANCH_DROPDOWN",
};

const useDropdownBranches = ({
  config,
}: {
  config?: QueryConfig<typeof getDropdownBranches>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getDropdownBranches>>({
    ...config,
    queryKey: [CACHE_BRANCH.DROPDOWN],
    queryFn: () => getDropdownBranches(),
  });
};

// Get detail
const useGetBranchDetail = ({
  id,
  config,
}: {
  id: string;
  config?: QueryConfig<typeof getBranchDetail>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getBranchDetail>>({
    ...config,
    queryKey: [CACHE_BRANCH.DETAIL, id],
    queryFn: () => getBranchDetail(id),
  });
};

// Search list
const useSearchBranches = ({
  params,
  config,
}: {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<typeof searchBranches>;
}) => {
  return useQuery<ExtractFnReturnType<typeof searchBranches>>({
    ...config,
    queryKey: [CACHE_BRANCH.SEARCH, params],
    queryFn: () => searchBranches(params),
  });
};

// Update
const useUpdateBranch = ({
  config,
}: {
  config?: MutationConfig<typeof updateBranch>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateBranch,
  });
};

// Create
const useCreateBranch = ({
  config,
}: {
  config?: MutationConfig<typeof createBranch>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createBranch,
  });
};

// Delete
const useDeleteBranch = ({
  config,
}: {
  config?: MutationConfig<typeof deleteBranch>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteBranch,
  });
};

export {
  CACHE_BRANCH,
  useDropdownBranches,
  useSearchBranches,
  useCreateBranch,
  useDeleteBranch,
  useUpdateBranch,
  useGetBranchDetail,
};
