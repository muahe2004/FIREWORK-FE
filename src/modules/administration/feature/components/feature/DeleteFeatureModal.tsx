import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { ModalRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import { CACHE_FUNCTION, useDeleteFunction } from "@/loader/function.loader";
import { UserState } from "@/store/auth/atom";
import { functionState } from "@/store/feature/atom";
import { useDisclosure } from "@/utils/modal";

interface Props {
  label: string;
}

export function DeleteFunctionModal({ label }: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const [function_id, setFunctionId] = useRecoilState(functionState);
  const userRecoil = useRecoilValue(UserState);
  const { t } = useTranslation();

  const deleteFunction = useDeleteFunction({
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
        queryClient.invalidateQueries([CACHE_FUNCTION.SEARCH]);
        setFunctionId("");
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
    deleteFunction.mutate({
      list_json: [{ function_id }],
      updated_by_id: userRecoil.user_id,
    });
  };

  return (
    <>
      <Tooltip title={t("authorization.tooltip.btn_delete")}>
        <Button type="default" disabled={!function_id} onClick={handleOpen}>
          <DeleteOutlined style={{ color: "#ff4d4f" }} />
        </Button>
      </Tooltip>
      <ModalRender
        open={isOpen}
        title={t("authorization.functions.modal.title_delete")}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={deleteFunction.isLoading}
        cancelText={t("all.btn_no")}
        okText={t("all.btn_yes")}
        className="modal modal-center"
      >
        <Flex justify="center">
          <Typography.Text strong>
            Bạn có muốn xóa tính năng{" "}
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
