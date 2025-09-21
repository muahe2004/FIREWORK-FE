import {
  DoubleRightOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ProConfigProvider } from "@ant-design/pro-components";
import {
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Typography,
  notification,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import logo from "@/assets/img/logo/logo-2.png";
import { ERROR_TIMEOUT, LOCAL_USER } from "@/constant/config";
import { ACCESSES, checkAccess } from "@/lib/access";
import { useLogin, useResetPassword } from "@/loader/user.loader";
import { HOME_URL, LOGIN_URL } from "@/urls";
import storage, { storageService } from "@/utils/storage";
import { RULES_FORM } from "@/utils/validator";

import styles from "./scss/login.module.scss";

type LoginType = "phone" | "account";

const Page = () => {
  const { t } = useTranslation("translation", { keyPrefix: "messages" });
  const [loginType, setLoginType] = useState<LoginType>("account");
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    storage.clearToken();
  }, []);

  const login = useLogin({
    config: {
      onSuccess: (data, variables) => {
        if (data.message === ERROR_TIMEOUT) {
          login.mutate(variables);
          return;
        }
        if (!data.success && data.message) {
          notification.error({
            message: data.message,
          });
          return navigate(LOGIN_URL);
        }
        storage.setToken(data.token);
        storageService.setStorage(LOCAL_USER, JSON.stringify(data));
        notification.success({
          message: t("login_success"),
          description: (
            <Flex gap={8} align="flex-end" style={{ marginTop: 16 }}>
              Đang chuyển hướng <div className="loader"></div>
            </Flex>
          ),
          duration: 0.6,
        });
        setTimeout(() => {
          navigate(
            checkAccess(ACCESSES.CO_EMPLOYEE_DROPDOWN) ? HOME_URL : HOME_URL,
            {
              replace: true,
              preventScrollReset: true,
            },
          );
        }, 600);
      },
      onError: (data) => {
        if (data.message === ERROR_TIMEOUT) {
          login.mutate(form.getFieldsValue());
          return;
        }
        notification.error({
          message: data.message || t("login_failure"),
        });
      },
    },
  });

  const resetPassword = useResetPassword({
    config: {
      onSuccess: (data) => {
        notification.success({ message: data.message });
      },
      onError(data) {
        notification.error({
          message: data.message || t("error"),
        });
      },
    },
  });

  const handleLogin = async (type: LoginType) => {
    form.validateFields().then((values) => {
      type === "account" ? login.mutate(values) : resetPassword.mutate(values);
    });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <Row className={styles.bgLogin}>
        <Col span={0} md={10} lg={14}></Col>
        <Col span={24} md={14} lg={10} className={styles.loginForm}>
          <Form
            form={form}
            layout="vertical"
            style={{ height: "100%", padding: 16 }}
            onFinish={() => handleLogin(loginType)}
          >
            <Flex
              vertical
              justify="space-between"
              align="center"
              style={{ height: "100%" }}
            >
              <Flex vertical align="center" className={styles.formCard}>
                <Image
                  wrapperClassName={styles.logo}
                  src={logo}
                  alt="logo"
                  preview={false}
                  width={186}
                />

                <Typography.Title level={2} className={styles.title}>
                  {loginType === "account" ? "ĐĂNG NHẬP" : "QUÊN MẬT KHẨU"}
                </Typography.Title>

                <div style={{ width: 328 }}>
                  {loginType === "account" ? (
                    <>
                      <Form.Item
                        name="username"
                        label="Tài khoản"
                        initialValue={
                          window.origin.includes("app.nextco.vn") ? "test" : ""
                        }
                        rules={[...RULES_FORM.required]}
                      >
                        <Input
                          size="large"
                          placeholder={"Tài khoản"}
                          allowClear
                          prefix={
                            <UserOutlined
                              style={{
                                color: token.colorPrimary,
                              }}
                              className={"prefixIcon"}
                            />
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label="Mật khẩu"
                        initialValue={
                          window.origin.includes("app.nextco.vn")
                            ? "123456"
                            : ""
                        }
                        rules={[...RULES_FORM.required]}
                      >
                        <Input.Password
                          size="large"
                          placeholder={"Mật khẩu"}
                          allowClear
                          prefix={
                            <LockOutlined
                              style={{
                                color: token.colorPrimary,
                              }}
                              className={"prefixIcon"}
                            />
                          }
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item
                        name="user_name"
                        label="Tài khoản"
                        rules={[...RULES_FORM.required]}
                      >
                        <Input
                          size="large"
                          placeholder={"Tài khoản"}
                          allowClear
                          prefix={
                            <UserOutlined
                              style={{
                                color: token.colorPrimary,
                              }}
                              className={"prefixIcon"}
                            />
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[...RULES_FORM.required, ...RULES_FORM.email]}
                      >
                        <Input
                          size="large"
                          placeholder={"Nhập email của bạn"}
                          allowClear
                          prefix={
                            <MailOutlined
                              style={{
                                color: token.colorPrimary,
                              }}
                              className={"prefixIcon"}
                            />
                          }
                        />
                      </Form.Item>
                    </>
                  )}

                  {loginType === "account" ? (
                    <Flex align="center" justify="space-between">
                      <Typography.Link
                        onClick={() => setLoginType("phone")}
                        underline
                      >
                        Quên mật khẩu?
                      </Typography.Link>

                      <Button
                        loading={login.isLoading}
                        className={`btn-lg btn-warn ${styles.btnSubmit}`}
                        htmlType="submit"
                        style={{
                          width: "50%",
                          height: "36px",
                          color: "#222",
                        }}
                      >
                        <DoubleRightOutlined /> Đăng nhập
                      </Button>
                    </Flex>
                  ) : (
                    <Flex vertical>
                      <Typography.Link
                        onClick={() => setLoginType("account")}
                        style={{
                          textAlign: "right",
                          marginBottom: 16,
                        }}
                      >
                        Đã nhớ ra mật khẩu? Đăng nhập ngay
                      </Typography.Link>

                      <div style={{ margin: "auto", width: "100%" }}>
                        <Button
                          className="btn btn-warn"
                          style={{
                            gap: 0,
                            width: "100%",
                          }}
                          htmlType="submit"
                        >
                          Gửi
                        </Button>
                      </div>
                    </Flex>
                  )}
                </div>
              </Flex>

              <Flex
                vertical
                justify="center"
                align="center"
                className={styles.copyright}
              >
                <Typography.Text>
                  Xây dựng và phát triển bởi Viện Trí tuệ Nhân tạo.
                </Typography.Text>
                <Typography.Text>
                  © AI Institute. All rights reserved.
                </Typography.Text>
              </Flex>
            </Flex>
          </Form>
        </Col>
      </Row>
      <div className={styles.copyrightWrap}>
        <Flex
          vertical
          justify="center"
          align="center"
          className={styles.copyright}
        >
          <Typography.Title
            level={1}
            style={{ margin: 0, color: "#07527e", fontSize: 48 }}
          >
            NEXTCO
          </Typography.Title>
          <Typography.Title
            level={2}
            style={{ margin: 0, color: "#07527e", textAlign: "center" }}
          >
            Phần mềm quản lý chứng nhận xuất xứ hàng hóa
          </Typography.Title>
        </Flex>
      </div>
    </div>
  );
};

export default function Login() {
  return (
    <ProConfigProvider>
      <Page />
    </ProConfigProvider>
  );
}
