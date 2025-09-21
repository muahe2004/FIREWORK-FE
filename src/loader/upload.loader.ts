import { useMutation } from "react-query";

import { MutationConfig } from "@/lib/react-query";
import { uploadFile, uploadFiles } from "@/services/upload.service";

export const useUploadFiles = ({
  config,
}: {
  config?: MutationConfig<typeof uploadFiles>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: uploadFiles,
  });
};

export const useUploadFile = ({
  config,
}: {
  config?: MutationConfig<typeof uploadFile>;
}) => {
  return useMutation({
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {},
    ...config,
    mutationFn: uploadFile,
  });
};
