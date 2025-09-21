import { KeyOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  message,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { ModalRender } from "@/constant/antd";
import { useChangePasswordUser } from "@/loader/user.loader";
import { UserState } from "@/store/auth/atom";
import { LOGIN_URL } from "@/urls";
import { useDisclosure } from "@/utils/modal";
import { clearLogout } from "@/utils/storage";
import { RULES_FORM } from "@/utils/validator";

export default function ChangePassword(): JSX.Element {
  const { t } = useTranslation();
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const userRecoil = useRecoilValue(UserState);
  const password = Form.useWatch([], form);
  const navigate = useNavigate();

  const logOut = async () => {
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get("redirect");
    if (window.location.pathname !== LOGIN_URL && !redirect) {
      clearLogout();
      navigate(LOGIN_URL, {
        preventScrollReset: true,
        replace: true,
      });
    }
  };

  const changePassword = useChangePasswordUser({
    config: {
      onSuccess: (data) => {
        if (data.success) {
          notification.success({ message: data.message });
          handleCancel();
          logOut();
        } else notification.error({ message: data.message });
      },
      onError: (err) => {
        notification.error({ message: err.message });
      },
    },
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const dataPost = {
          ...values,
          user_id: userRecoil.user_id,
        };
        dataPost.lu_user_id = userRecoil.user_id;
        changePassword.mutate(dataPost);
        // console.log(dataPost);
      })
      .catch(() => message.warning(t("messages.validate_form")));
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  return (
    <>
      <Space onClick={open}>
        <KeyOutlined />
        <Typography.Text>{t("avatar.change_password.title")}</Typography.Text>
      </Space>

      <ModalRender
        title={t("avatar.change_password.title")}
        width={380}
        open={isOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={changePassword.isLoading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name={"old_password"}
                label={t("avatar.change_password.fields.old_password")}
                rules={[...RULES_FORM.required]}
              >
                <Input.Password
                  placeholder={
                    t("avatar.change_password.fields.old_password") || ""
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"new_password"}
                label={t("avatar.change_password.fields.new_password")}
                rules={[...RULES_FORM.required, ...RULES_FORM.password_weak]}
              >
                <Input.Password
                  placeholder={
                    t("avatar.change_password.fields.new_password") || ""
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"confirm_password"}
                label={t("avatar.change_password.fields.confirm_password")}
                rules={[
                  // @ts-ignore
                  ...RULES_FORM.confirm_password(
                    password?.new_password,
                    password?.confirm_password,
                  ),
                  ...RULES_FORM.required,
                ]}
              >
                <Input.Password
                  placeholder={
                    t("avatar.change_password.fields.confirm_password") || ""
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalRender>
    </>
  );
}
