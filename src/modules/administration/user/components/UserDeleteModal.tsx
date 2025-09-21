import { Button, Flex, Tooltip, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";

import { DeleteIcon } from "@/assets/svg";
import { ModalRender } from "@/constant/antd";
import { CACHE_USER, useDeleteUser } from "@/loader/user.loader";
import { UserState } from "@/store/auth/atom";
import { IBaseDelete } from "@/types/base";
import { useDisclosure } from "@/utils/modal";

interface Props {
  id: string;
  label: string;
}

export default function UserDeleteModal({ id, label }: Props): JSX.Element {
  const { t } = useTranslation();
  const { open, close, isOpen } = useDisclosure();
  const userRecoil = useRecoilValue(UserState);
  const queryClient = useQueryClient();

  const deleteEmployee = useDeleteUser({
    config: {
      onSuccess: (data: any) => {
        if (!data.success && data.message) {
          notification.error({
            message: data.message,
          });
          return;
        }
        notification.success({
          message: data.message,
        });

        queryClient.invalidateQueries([CACHE_USER.SEARCH]);
        close();
      },
      onError: (err) => {
        notification.error({
          message: t("messages.delete_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleDelete = () => {
    const dataPost: IBaseDelete = {
      list_json: [{ user_id: id }],
      lu_user_id: userRecoil.user_id,
    };

    deleteEmployee.mutate(dataPost);
  };

  return (
    <>
      <Tooltip title={t("user.title_delete")}>
        <Button
          className="center"
          icon={<DeleteIcon />}
          type="text"
          danger
          onClick={open}
        />
      </Tooltip>

      <ModalRender
        title={t("user.title_delete")}
        open={isOpen}
        onCancel={close}
        onOk={handleDelete}
        cancelText={t("all.btn_no")}
        okText={t("all.btn_yes")}
        className="modal modal-center"
        confirmLoading={deleteEmployee.isLoading}
      >
        <Flex justify="center">
          <Typography.Text strong>
            Bạn có muốn xóa người dùng{" "}
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
