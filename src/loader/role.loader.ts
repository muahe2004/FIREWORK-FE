import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  createRole,
  deleteRole,
  getRoleDetail,
  getRoleUserDetail,
  searchRoles,
  updateRole,
} from "@/services/role.service";
import { IRoleSearch } from "@/types/role";

const CACHE_ROLE = {
  SEARCH: "ROLES",
  DETAIL: "ROLE_DETAIL",
};

const useSearchRoles = ({
  params,
  config,
}: {
  params: IRoleSearch;
  config?: QueryConfig<typeof searchRoles>;
}) => {
  return useQuery<ExtractFnReturnType<typeof searchRoles>>({
    ...config,
    queryKey: [CACHE_ROLE.SEARCH, params],
    queryFn: () => searchRoles(params),
  });
};

const useGetRoleDetail = ({
  id,
  enabled,
  config,
}: {
  id: string;
  enabled: boolean;
  config?: QueryConfig<typeof getRoleDetail>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getRoleDetail>>({
    ...config,
    enabled,
    queryKey: [CACHE_ROLE.DETAIL, id],
    queryFn: () => getRoleDetail(id),
  });
};

const useGetRoleUserDetail = ({
  id,
  config,
}: {
  id: string;
  config?: QueryConfig<typeof getRoleUserDetail>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getRoleUserDetail>>({
    ...config,
    queryKey: [CACHE_ROLE.DETAIL, id],
    queryFn: () => getRoleUserDetail(id),
  });
};

const useGetDetailRole = ({
  id,
  enabled,
  config,
}: {
  enabled?: boolean;
  id: string;
  config?: QueryConfig<typeof getRoleDetail>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getRoleDetail>>({
    ...config,
    enabled,
    queryKey: [CACHE_ROLE.DETAIL, id],
    queryFn: () => getRoleDetail(id),
  });
};

const useCreateRole = ({
  config,
}: {
  config?: MutationConfig<typeof createRole>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createRole,
  });
};

const useUpdateRole = ({
  config,
}: {
  config?: MutationConfig<typeof updateRole>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateRole,
  });
};

const useDeleteRole = ({
  config,
}: {
  config?: MutationConfig<typeof deleteRole>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteRole,
  });
};

export {
  CACHE_ROLE,
  useSearchRoles,
  useGetRoleDetail,
  useGetRoleUserDetail,
  useGetDetailRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
};
