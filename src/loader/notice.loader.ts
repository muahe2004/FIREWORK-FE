import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  createNotify,
  deleteNotifies,
  getNotifies,
  getNotify,
  updateNotify,
} from "@/services/notice.service";

export const CACHE_NOTICE = {
  SEARCH: "NOTICES",
  DETAIL: "NOTICE_DETAIL",
  MANAGER: "NOTICE_MANAGERS",
};

// Get detail
const useGetNotifyDetail = ({
  id,
  config,
}: {
  id: string;
  config?: QueryConfig<typeof getNotify>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getNotify>>({
    ...config,
    queryKey: [CACHE_NOTICE.DETAIL, id],
    queryFn: () => getNotify(id),
  });
};

// Search list
const useSearchNotifies = ({
  params,
  config,
}: {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<typeof getNotifies>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getNotifies>>({
    ...config,
    queryKey: [CACHE_NOTICE.SEARCH, params],
    queryFn: () => getNotifies(params),
  });
};

// Update
const useUpdateNotify = ({
  config,
}: {
  config?: MutationConfig<typeof updateNotify>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateNotify,
  });
};

// Create
const useCreateNotify = ({
  config,
}: {
  config?: MutationConfig<typeof createNotify>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createNotify,
  });
};

// Delete
const useDeleteNotify = ({
  config,
}: {
  config?: MutationConfig<typeof deleteNotifies>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteNotifies,
  });
};

export {
  useCreateNotify,
  useDeleteNotify,
  useGetNotifyDetail,
  useSearchNotifies,
  useUpdateNotify,
};
