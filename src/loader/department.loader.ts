import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

import {
  ExtractFnReturnType,
  MutationConfig,
  QueryConfig,
} from "@/lib/react-query";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentDetail,
  getDropdownDepartments,
  searchDepartments,
  updateDepartment,
} from "@/services/department.service";

const CACHE_DEPARTMENT = {
  SEARCH: "DEPARTMENTS",
  DETAIL: "DEPARTMENT_DETAIL",
  DROPDOWN: "DEPARTMENT_DROPDOWN",
};

const useDropdownDepartments = ({
  config,
}: {
  config?: QueryConfig<typeof getDropdownDepartments>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getDropdownDepartments>>({
    ...config,
    queryKey: [CACHE_DEPARTMENT.DROPDOWN],
    queryFn: () => getDropdownDepartments(),
  });
};
// Get detail
const useGetDepartmentDetail = ({
  id,
  config,
}: {
  id: string;
  config?: QueryConfig<typeof getDepartmentDetail>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getDepartmentDetail>>({
    ...config,
    queryKey: [CACHE_DEPARTMENT.DETAIL, id],
    queryFn: () => getDepartmentDetail(id),
  });
};

// Search list
const useSearchDepartments = ({
  params,
  config,
}: {
  params: AxiosRequestConfig["params"];
  config?: QueryConfig<typeof searchDepartments>;
}) => {
  return useQuery<ExtractFnReturnType<typeof searchDepartments>>({
    ...config,
    queryKey: [CACHE_DEPARTMENT.SEARCH, params],
    queryFn: () => searchDepartments(params),
  });
};

// Update
const useUpdateDepartment = ({
  config,
}: {
  config?: MutationConfig<typeof updateDepartment>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: updateDepartment,
  });
};

// Create
const useCreateDepartment = ({
  config,
}: {
  config?: MutationConfig<typeof createDepartment>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createDepartment,
  });
};

// Delete
const useDeleteDepartment = ({
  config,
}: {
  config?: MutationConfig<typeof deleteDepartment>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: deleteDepartment,
  });
};

export {
  CACHE_DEPARTMENT,
  useDropdownDepartments,
  useSearchDepartments,
  useCreateDepartment,
  useDeleteDepartment,
  useUpdateDepartment,
  useGetDepartmentDetail,
};
