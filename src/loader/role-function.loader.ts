import { useMutation } from "react-query";

import { MutationConfig } from "@/lib/react-query";
import { createPerFuncForRole } from "@/services/role-function.service";

export const CACHE_PERMISSION = {
  SEARCH: "PERMISSIONS",
  DETAIL: "PERMISSION_DETAIL",
};

const useCreatePerFuncForRole = ({
  config,
}: {
  config?: MutationConfig<typeof createPerFuncForRole>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: createPerFuncForRole,
  });
};

export { useCreatePerFuncForRole };
