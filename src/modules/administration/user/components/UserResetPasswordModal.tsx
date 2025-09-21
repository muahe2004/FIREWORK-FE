import { Button, Flex, Tooltip, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";

import { LoadIcon } from "@/assets/svg";
import { ModalRender } from "@/constant/antd";
import { CACHE_USER, useResetPasswordAdminUser } from "@/loader/user.loader";
import { UserState } from "@/store/auth/atom";
import { IAdminResetPassword, IUser } from "@/types/user";
import { extractLastWord } from "@/utils/format-string";
import { useDisclosure } from "@/utils/modal";

interface Props {
  user: IUser;
}

export default function UserResetPasswordModal({ user }: Props): JSX.Element {
  const { t } = useTranslation();
  const { open, close, isOpen } = useDisclosure();
  const userRecoil = useRecoilValue(UserState);
  const queryClient = useQueryClient();

  const resetUser = useResetPasswordAdminUser({
    config: {
      onSuccess: (data: any) => {
        if (!data.success && data.message) {
          notification.error({
            message: data.message,
          });
          return;
        }
        const { lastWord, stringWithoutLastWord } = extractLastWord(
          data.message,
        );

        notification.success({
          message: (
            <Typography.Text>
              {stringWithoutLastWord}{" "}
              <Typography.Text strong underline>
                {lastWord}
              </Typography.Text>
            </Typography.Text>
          ),
          duration: 5000,
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
    const dataPost: IAdminResetPassword = {
      user_id: user.user_id,
      lu_user_id: userRecoil.user_id,
    };

    resetUser.mutate(dataPost);
  };

  return (
    <>
      <Tooltip title={t("user.title_reset")}>
        <Button
          className="center"
          icon={<LoadIcon />}
          type="text"
          onClick={open}
        />
      </Tooltip>

      <ModalRender
        title={t("user.title_reset")}
        open={isOpen}
        onCancel={close}
        onOk={handleSubmit}
        cancelText={t("all.btn_no")}
        okText={t("all.btn_yes")}
        className="modal modal-center"
        confirmLoading={resetUser.isLoading}
      >
        <Flex justify="center">
          <Typography.Text strong>
            Bạn có muốn reset mật khẩu của{" "}
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
