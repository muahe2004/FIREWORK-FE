import { useQuery } from "react-query";

import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { getDropdownPositions } from "@/services/position.service";

const CACHE_POSITION = {
  SEARCH: "POSITIONS",
  DETAIL: "POSITION_DETAIL",
  DROPDOWN: "POSITION_DROPDOWN",
};

const useDropdownPositions = ({
  config,
}: {
  config?: QueryConfig<typeof getDropdownPositions>;
}) => {
  return useQuery<ExtractFnReturnType<typeof getDropdownPositions>>({
    ...config,
    queryKey: [CACHE_POSITION.DROPDOWN],
    queryFn: () => getDropdownPositions(),
  });
};

export { useDropdownPositions };
