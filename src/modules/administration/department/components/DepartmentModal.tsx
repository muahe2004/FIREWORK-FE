import { Button, Col, Form, Input, Row, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { ModalRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import {
  CACHE_DEPARTMENT,
  useCreateDepartment,
  useUpdateDepartment,
} from "@/loader/department.loader";
import { UserState } from "@/store/auth/atom";
import { IDepartment } from "@/types/department";
import { useDisclosure } from "@/utils/modal";
import { RULES_FORM } from "@/utils/validator";

// const { Text } = Typography;
interface Props {
  isCreate?: boolean;
  department?: IDepartment;
}

export const DepartmentModal = ({ isCreate = true, department }: Props) => {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(UserState);

  const updateDepartment = useUpdateDepartment({
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
        queryClient.invalidateQueries(CACHE_DEPARTMENT.SEARCH);
        handleCancel();
      },
      onError: (err) => {
        notification.error({
          message: t("messages.update_failure"),
          description: err.message,
        });
      },
    },
  });

  const createDepartment = useCreateDepartment({
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
        queryClient.invalidateQueries(CACHE_DEPARTMENT.SEARCH);
        handleCancel();
      },
      onError: (err) => {
        notification.error({
          message: t("messages.create_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleOpen = () => {
    form.setFieldsValue(department);
    open();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        const dataPost = {
          ...values,
        };

        if (isCreate) {
          dataPost.created_by_user_id = userRecoil.user_id;
          createDepartment.mutate(dataPost);
        } else {
          dataPost.lu_user_id = userRecoil.user_id;
          updateDepartment.mutate(dataPost);
        }
      })
      .catch(() => {
        notification.warning({
          message: t("messages.validate_form"),
        });
      });
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  return (
    <>
      {isCreate ? (
        <Button type="primary" className="btn btn-primary" onClick={handleOpen}>
          {t("all.btn_add")}
        </Button>
      ) : (
        <Typography.Link
          style={{ width: "100%", display: "block" }}
          onClick={handleOpen}
        >
          {department?.department_name}
        </Typography.Link>
      )}
      <ModalRender
        open={isOpen}
        width={"70vw"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={
          updateDepartment.isLoading || createDepartment.isLoading
        }
        title={
          isCreate ? t("department.title_create") : t("department.title_update")
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Form.Item name="department_id" hidden></Form.Item>
            <Col span={8}>
              <Form.Item
                label={t("department.fields.department_name")}
                name="department_name"
                rules={[...RULES_FORM.required]}
              >
                <Input
                  type="text"
                  placeholder={t("department.fields.department_name") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t("department.fields.phone")}
                name="phone"
                rules={[...RULES_FORM.phone]}
              >
                <Input
                  type="text"
                  placeholder={t("department.fields.phone") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("department.fields.fax")} name="fax">
                <Input
                  type="text"
                  placeholder={t("department.fields.fax") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={t("department.fields.address")} name="address">
                <Input.TextArea
                  placeholder={t("department.fields.address") || ""}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalRender>
    </>
  );
};
