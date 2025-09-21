import { useMutation } from "react-query";

import { MutationConfig } from "@/lib/react-query";
import { getQLND } from "@/services/employee.service";

export const CACHE_EMPLOYEES = {
  QLND_LAZY: "QLND_LAZY",
};

export const useQLNDLazy = ({
  config,
}: {
  config?: MutationConfig<typeof getQLND>;
}) => {
  return useMutation({
    ...config,
    mutationFn: getQLND,
    mutationKey: [CACHE_EMPLOYEES.QLND_LAZY],
  });
};
