import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  createUserRole,
  deleteUserRole,
  getUserRoleDetail,
  searchUserRoles,
  updateUserRole,
} from "@/services/user-role.service";
import { IUserRoleSearch } from "@/types/user-role";

const CACHE_USER_ROLE = {
  SEARCH: "USER_ROLES",
  DETAIL: "USER_ROLE_DETAIL",
};

const useSearchUserRoles = ({
  params,
  config,
}: {
  params: IUserRoleSearch;
  config?: QueryConfig<typeof searchUserRoles>;
}) => {
  return useQuery<ExtractFnReturnType<typeof searchUserRoles>>({
    ...config,
    queryKey: [CACHE_USER_ROLE.SEARCH, params],
    queryFn: () => searchUserRoles(params),
  });
};

const useGetDetailUserRole = ({
  id,
  enabled,
  config,
}: {
  enabled?: boolean;
  id: string;
  config?: QueryConfig<typeof getUserRoleDetail>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getUserRoleDetail>>({
    ...config,
    enabled,
    queryKey: [CACHE_USER_ROLE.DETAIL, id],
    queryFn: () => getUserRoleDetail(id),
  });
};

const useCreateUserRole = ({
  config,
}: {
  config?: MutationConfig<typeof createUserRole>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createUserRole,
  });
};

const useUpdateUserRole = ({
  config,
}: {
  config?: MutationConfig<typeof updateUserRole>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateUserRole,
  });
};

const useDeleteUserRole = ({
  config,
}: {
  config?: MutationConfig<typeof deleteUserRole>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteUserRole,
  });
};

export {
  CACHE_USER_ROLE,
  useSearchUserRoles,
  useGetDetailUserRole,
  useCreateUserRole,
  useUpdateUserRole,
  useDeleteUserRole,
};
