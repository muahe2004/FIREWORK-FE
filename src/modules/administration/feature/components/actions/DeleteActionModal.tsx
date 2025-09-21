import { Button, Flex, Tooltip, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { DeleteIcon } from "@/assets/svg";
import { ModalRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import { CACHE_ACTION, useDeleteAction } from "@/loader/action.loader";
import { UserState } from "@/store/auth/atom";
import { useDisclosure } from "@/utils/modal";

interface Props {
  id: string;
  label: string;
}

export function DeleteActionModal({ id, label }: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const userRecoil = useRecoilValue(UserState);
  const { t } = useTranslation();

  const deleteAction = useDeleteAction({
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
        queryClient.invalidateQueries([CACHE_ACTION.SEARCH]);
        close();
      },
      onError: () => {
        notification.error({ message: t("messages.delete_failure") });
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const handleOk = () => {
    deleteAction.mutate({
      list_json: [{ action_code: id }],
      updated_by_id: userRecoil.user_id,
    });
  };

  return (
    <>
      <Tooltip title={t("authorization.actions.modal.title_delete")}>
        <Button
          onClick={handleOpen}
          icon={<DeleteIcon />}
          type="text"
          className="center"
        />
      </Tooltip>

      <ModalRender
        title={t("authorization.actions.modal.title_delete")}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={t("all.btn_no")}
        okText={t("all.btn_yes")}
        className="modal modal-center"
        confirmLoading={deleteAction.isLoading}
      >
        <Flex justify="center">
          <Typography.Text strong>
            Bạn có muốn xóa thao tác{" "}
            <Typography.Text strong type="danger">
              {label}
            </Typography.Text>{" "}
            ?
          </Typography.Text>
        </Flex>
      </ModalRender>
    </>
  );
}
