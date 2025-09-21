import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  changePasswordUser,
  createUser,
  deleteUser,
  getUserDetail,
  getUsersDropdown,
  lockUser,
  loginService,
  resetPasswordAdminUser,
  resetPasswordUser,
  searchUsers,
  updateUser,
} from "@/services/user.service";
import { IUserSearch } from "@/types/user";

const CACHE_USER = {
  SEARCH: "USERS",
  DETAIL: "USER_DETAIL",
  DROPDOWN: "USER_DROPDOWN",
};

const useLogin = ({
  config,
}: {
  config?: MutationConfig<typeof loginService>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: loginService,
  });
};

const useSearchUsers = ({
  params,
  config,
}: {
  params: IUserSearch;
  config?: QueryConfig<typeof searchUsers>;
}) => {
  return useQuery<ExtractFnReturnType<typeof searchUsers>>({
    ...config,
    queryKey: [CACHE_USER.SEARCH, params],
    queryFn: () => searchUsers(params),
  });
};

const useDropdownUsers = ({
  user_id,
  config,
}: {
  user_id: string;
  config?: QueryConfig<typeof getUsersDropdown>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getUsersDropdown>>({
    ...config,
    queryKey: [CACHE_USER.DROPDOWN, user_id],
    queryFn: () => getUsersDropdown(user_id),
  });
};

const useGetDetailUser = ({
  id,
  enabled,
  config,
}: {
  enabled?: boolean;
  id: string;
  config?: QueryConfig<typeof getUserDetail>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getUserDetail>>({
    ...config,
    enabled,
    queryKey: [CACHE_USER.DETAIL, id],
    queryFn: () => getUserDetail(id),
  });
};

const useCreateUser = ({
  config,
}: {
  config?: MutationConfig<typeof createUser>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createUser,
  });
};

const useUpdateUser = ({
  config,
}: {
  config?: MutationConfig<typeof updateUser>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateUser,
  });
};

const useDeleteUser = ({
  config,
}: {
  config?: MutationConfig<typeof deleteUser>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteUser,
  });
};

const useLockUser = ({
  config,
}: {
  config?: MutationConfig<typeof lockUser>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: lockUser,
  });
};

const useChangePasswordUser = ({
  config,
}: {
  config?: MutationConfig<typeof changePasswordUser>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: changePasswordUser,
  });
};

const useResetPasswordAdminUser = ({
  config,
}: {
  config?: MutationConfig<typeof resetPasswordAdminUser>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: resetPasswordAdminUser,
  });
};

const useResetPassword = ({
  config,
}: {
  config?: MutationConfig<typeof resetPasswordUser>;
}) => {
  return useMutation({
    onMutate: () => {},
    ...config,
    mutationFn: resetPasswordUser,
  });
};

export {
  CACHE_USER,
  useLogin,
  useSearchUsers,
  useGetDetailUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useLockUser,
  useResetPasswordAdminUser,
  useChangePasswordUser,
  useResetPassword,
  useDropdownUsers,
};
