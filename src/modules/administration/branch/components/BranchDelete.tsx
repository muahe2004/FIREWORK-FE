import { Button, Flex, Tooltip, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { DeleteIcon } from "@/assets/svg";
import { ModalRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import { CACHE_BRANCH, useDeleteBranch } from "@/loader/branch.loader";
import { UserState } from "@/store/auth/atom";
import { useDisclosure } from "@/utils/modal";

interface Props {
  id: string;
  label: string;
}

export const BranchDelete = ({ id, label }: Props): JSX.Element => {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(UserState);

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const deleteBranch = useDeleteBranch({
    config: {
      onSuccess: (data) => {
        if (!data.success && data.message) {
          notification.error({
            message: data.message,
          });
          return;
        }
        notification.success({
          message: data.message,
        });
        queryClient.invalidateQueries(CACHE_BRANCH.SEARCH);
        handleCancel();
      },
      onError: (err) => {
        notification.error({
          message: t("messages.delete_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleOk = () => {
    deleteBranch.mutate({
      list_json: [{ branch_id: id }],
      updated_by_id: userRecoil.user_id,
    });
  };

  return (
    <>
      <Tooltip title={t("branch.title_delete")}>
        <Button
          className="center"
          icon={<DeleteIcon />}
          type="text"
          danger
          onClick={handleOpen}
        />
      </Tooltip>

      <ModalRender
        title={t("branch.title_delete")}
        open={isOpen}
        okText={t("all.btn_yes")}
        cancelText={t("all.btn_no")}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={deleteBranch.isLoading}
        className={"modal modal-center"}
      >
        <Flex justify="center">
          <Typography.Text strong>
            Bạn có muốn xóa chi nhánh{" "}
            <Typography.Text strong type="danger">
              {label}
            </Typography.Text>{" "}
            ?
          </Typography.Text>
        </Flex>
      </ModalRender>
    </>
  );
};
