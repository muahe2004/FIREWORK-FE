import { Button, Flex, Tooltip, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { DeleteIcon } from "@/assets/svg";
import { ModalRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import { CACHE_ROLE, useDeleteRole } from "@/loader/role.loader";
import { UserState } from "@/store/auth/atom";
import { useDisclosure } from "@/utils/modal";

interface Props {
  id: string | number;
  label: string;
}

export function DeleteRoleModal({ id, label }: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const userRecoil = useRecoilValue(UserState);
  const { t } = useTranslation();

  const deleteRole = useDeleteRole({
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
        queryClient.invalidateQueries([CACHE_ROLE.SEARCH]);
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
    deleteRole.mutate({
      list_json: [{ role_id: id }],
      lu_user_id: userRecoil.user_id,
    });
  };

  return (
    <>
      <Tooltip title={t("authorization.tooltip.btn_delete")}>
        <Button onClick={handleOpen} icon={<DeleteIcon />} type="text" />
      </Tooltip>
      <ModalRender
        title={t("authorization.roles.modal.title_delete")}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={deleteRole.isLoading}
        cancelText={t("all.btn_no")}
        okText={t("all.btn_yes")}
        className="modal modal-center"
      >
        <Flex justify="center">
          <Typography.Text strong>
            Bạn có muốn xóa nhóm quyền{" "}
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
