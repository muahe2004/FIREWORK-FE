import { UserOutlined } from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { ModalRender, SelectRender } from "@/constant/antd";
import { ERROR_TIMEOUT, LOCAL_USER } from "@/constant/config";
import { defaultGenderOptions } from "@/lib/data-fake";
import { useGetDetailUser, useUpdateUser } from "@/loader/user.loader";
// import { uploadFile } from "@/services/upload.service";
import { UserState } from "@/store/auth/atom";
import { formatDateShow, getDateVi } from "@/utils/format-string";
import { useDisclosure } from "@/utils/modal";
import { storageService } from "@/utils/storage";
import { RULES_FORM } from "@/utils/validator";

export default function Profile(): JSX.Element {
  const { t } = useTranslation();
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const userRecoil = useRecoilValue(UserState);
  const setUserProfile = useSetRecoilState(UserState);

  const {
    data: employee,
    refetch: employeeRefetch,
    remove: employeeRemove,
  } = useGetDetailUser({
    id: userRecoil.user_id,
    enabled: isOpen && !!userRecoil.user_id,
    config: {
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) {
          employeeRefetch();
          return;
        }

        if (data) {
          form.setFieldsValue(data);
          const date = dayjs(data.date_of_birth).isValid()
            ? dayjs(data.date_of_birth)
            : null;

          form.setFieldValue("date_of_birth", date);
        }
      },
    },
  });

  const updateEmployee = useUpdateUser({
    config: {
      onSuccess: (_, variables) => {
        message.success(t("messages.update_success"));
        handleCancel();
        employeeRemove();
        resetUser(variables);
      },
      onError: (err) => {
        message.error(err.message);
      },
    },
  });

  const resetUser = (data: any) => {
    const dataPost = {
      ...userRecoil,
      ...data,
    };

    setUserProfile(dataPost);
    storageService.setStorage(LOCAL_USER, JSON.stringify(dataPost));
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let dataFile: any;
        // if (file) dataFile = await uploadFile({ file });

        const dataPost = {
          ...employee,
          ...values,
          date_of_birth: getDateVi(values.date_of_birth),
          verify: values.verify ? 1 : 0,
        };

        if (dataFile?.path) dataPost.avatar = dataFile.path;

        dataPost.lu_user_id = userRecoil.user_id;
        updateEmployee.mutate(dataPost);
      })
      .catch(() => message.warning(t("messages.validate_form")));
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };

  return (
    <>
      <Space onClick={open}>
        <UserOutlined />
        <Typography.Text>{t("avatar.profile.title")}</Typography.Text>
      </Space>
      <ModalRender
        open={isOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        title={t("avatar.profile.title")}
        width={"60vw"}
        confirmLoading={updateEmployee.isLoading}
      >
        <div
          style={{
            // height: "calc(100vh - 174px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Form
            form={form}
            spellCheck={false}
            layout="vertical"
            style={{ marginRight: 5 }}
          >
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Form.Item
                  name={"full_name"}
                  label={t("avatar.profile.fields.full_name")}
                  rules={[...RULES_FORM.required]}
                >
                  <Input placeholder={t("avatar.profile.fields.full_name")} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("avatar.profile.fields.birthday")}
                  required
                  name={"date_of_birth"}
                  rules={[...RULES_FORM.required]}
                >
                  <DatePicker
                    // inputReadOnly
                    format={{ format: formatDateShow, type: "mask" }}
                    style={{ width: "100%" }}
                    placeholder={formatDateShow}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("avatar.profile.fields.username")}
                  name={"user_name"}
                  rules={[...RULES_FORM.required]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Form.Item name={"user_id"} hidden>
                <Input />
              </Form.Item>
              <Col span={6}>
                <Form.Item
                  name={"gender"}
                  label={t("avatar.profile.fields.gender")}
                  initialValue={0}
                  rules={[...RULES_FORM.required]}
                >
                  <SelectRender
                    placeholder={t("user.fields.gender")}
                    options={defaultGenderOptions}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name={"email"}
                  label={t("avatar.profile.fields.email")}
                  rules={[...RULES_FORM.required, ...RULES_FORM.email]}
                >
                  <Input
                    type="email"
                    placeholder={t("avatar.profile.fields.email")}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={"phone_number"}
                  label={t("avatar.profile.fields.phone")}
                  rules={[...RULES_FORM.required, ...RULES_FORM.phone]}
                >
                  <Input placeholder={t("avatar.profile.fields.phone")} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={"description"}
                  label={t("avatar.profile.fields.description")}
                >
                  <Input placeholder={t("avatar.profile.fields.description")} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </ModalRender>
    </>
  );
}
