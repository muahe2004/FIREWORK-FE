import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";

import { LockIcon } from "@/assets/svg";
import { ModalRender } from "@/constant/antd";
import { CACHE_USER, useLockUser } from "@/loader/user.loader";
import { UserState } from "@/store/auth/atom";
import { IUser } from "@/types/user";
import { useDisclosure } from "@/utils/modal";

interface Props {
  user: IUser;
}

export default function UserLockModal({ user }: Props): JSX.Element {
  const { t } = useTranslation();
  const { open, close, isOpen } = useDisclosure();
  const userRecoil = useRecoilValue(UserState);
  const queryClient = useQueryClient();

  const lockUser = useLockUser({
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

  const handleSubmit = () => {
    const dataPost = {
      user_id: user.user_id,
      online_flag: user.online_flag ? 0 : 1,
      lu_user_id: userRecoil.user_id,
    };

    lockUser.mutate(dataPost);
  };

  return (
    <>
      <Tooltip
        title={user.online_flag ? "Mở khóa tài khoản" : t("user.title_lock")}
      >
        <Button
          className="center"
          icon={
            user.online_flag ? (
              <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
            ) : (
              <LockIcon />
            )
          }
          type="text"
          danger={!!user.online_flag}
          onClick={open}
        />
      </Tooltip>

      <ModalRender
        title={user.online_flag ? "Mở khóa tài khoản" : t("user.title_lock")}
        open={isOpen}
        onCancel={close}
        onOk={handleSubmit}
        cancelText={t("all.btn_no")}
        okText={t("all.btn_yes")}
        className="modal modal-center"
        confirmLoading={lockUser.isLoading}
      >
        <Flex justify="center">
          <Typography.Text strong>
            Bạn có muốn {user.online_flag ? "mở khóa" : "khóa"} người dùng{" "}
            <Typography.Text strong type="danger">
              {user.full_name}
            </Typography.Text>{" "}
            ?
          </Typography.Text>
        </Flex>
      </ModalRender>
    </>
  );
}
