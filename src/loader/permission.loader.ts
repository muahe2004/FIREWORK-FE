import { useMutation } from "react-query";

import { MutationConfig } from "@/lib/react-query";
import { createPermissionForFunction } from "@/services/permission.service";

export const CACHE_PERMISSION = {
  SEARCH: "PERMISSIONS",
  DETAIL: "PERMISSION_DETAIL",
};

const useCreatePermissionForFunction = ({
  config,
}: {
  config?: MutationConfig<typeof createPermissionForFunction>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createPermissionForFunction,
  });
};

export { useCreatePermissionForFunction };
