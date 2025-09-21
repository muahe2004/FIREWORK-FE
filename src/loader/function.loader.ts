import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  createFunction,
  deleteFunction,
  getFunctionByRole,
  getFunctionDetail,
  searchFunctions,
  updateFunction,
} from "@/services/function.service";

export const CACHE_FUNCTION = {
  SEARCH: "FUNCTIONS",
  DETAIL: "FUNCTION_DETAIL",
  DETAIL_BY_ROLE: "FUNCTION_DETAIL_BY_ROLE",
};

// Get detail
const useGetFunctionDetail = ({
  id,
  enabled = true,
  config,
}: {
  id: string;
  enabled?: boolean;
  config?: QueryConfig<typeof getFunctionDetail>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getFunctionDetail>>({
    ...config,
    enabled,
    queryKey: [CACHE_FUNCTION.DETAIL, id],
    queryFn: () => getFunctionDetail(id),
  });
};

const useGetFunctionByRole = ({
  id,
  enabled = true,
  config,
}: {
  id: string;
  enabled?: boolean;
  config?: QueryConfig<typeof getFunctionByRole>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getFunctionByRole>>({
    ...config,
    enabled,
    queryKey: [CACHE_FUNCTION.DETAIL_BY_ROLE, id],
    queryFn: () => getFunctionByRole(id),
  });
};

// Search list
const useSearchFunctions = ({
  params,
  config,
}: {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<typeof searchFunctions>;
}) => {
  return useQuery<ExtractFnReturnType<typeof searchFunctions>>({
    ...config,
    queryKey: [CACHE_FUNCTION.SEARCH, params],
    queryFn: () => searchFunctions(params),
  });
};

// Update
const useUpdateFunction = ({
  config,
}: {
  config?: MutationConfig<typeof updateFunction>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateFunction,
  });
};

// Create
const useCreateFunction = ({
  config,
}: {
  config?: MutationConfig<typeof createFunction>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createFunction,
  });
};

// Delete
const useDeleteFunction = ({
  config,
}: {
  config?: MutationConfig<typeof deleteFunction>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteFunction,
  });
};

export {
  useCreateFunction,
  useDeleteFunction,
  useGetFunctionDetail,
  useGetFunctionByRole,
  useSearchFunctions,
  useUpdateFunction,
};
