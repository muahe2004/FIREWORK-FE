import { Button, Col, Form, Input, Row, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { ModalRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import {
  CACHE_BRANCH,
  useCreateBranch,
  useUpdateBranch,
} from "@/loader/branch.loader";
import { UserState } from "@/store/auth/atom";
import { IBranch } from "@/types/branch";
import { useDisclosure } from "@/utils/modal";
import { RULES_FORM } from "@/utils/validator";

// const { Text } = Typography;
interface Props {
  isCreate?: boolean;
  branch?: IBranch;
}

export const BranchModal = ({ isCreate = true, branch }: Props) => {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(UserState);

  const updateBranch = useUpdateBranch({
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
        queryClient.invalidateQueries(CACHE_BRANCH.SEARCH);
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

  const createBranch = useCreateBranch({
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
        queryClient.invalidateQueries(CACHE_BRANCH.SEARCH);
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
    form.setFieldsValue(branch);
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
          createBranch.mutate(dataPost);
        } else {
          dataPost.lu_user_id = userRecoil.user_id;
          updateBranch.mutate(dataPost);
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
          {branch?.branch_name}
        </Typography.Link>
      )}
      <ModalRender
        open={isOpen}
        width={"70vw"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={updateBranch.isLoading || createBranch.isLoading}
        title={isCreate ? t("branch.title_create") : t("branch.title_update")}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Form.Item name="branch_id" hidden></Form.Item>
            <Col span={8}>
              <Form.Item
                label={t("branch.fields.branch_name")}
                name="branch_name"
                rules={[...RULES_FORM.required]}
              >
                <Input
                  type="text"
                  placeholder={t("branch.fields.branch_name") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t("branch.fields.phone")}
                name="phone"
                rules={[...RULES_FORM.phone]}
              >
                <Input
                  type="text"
                  placeholder={t("branch.fields.phone") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("branch.fields.fax")} name="fax">
                <Input type="text" placeholder={t("branch.fields.fax") || ""} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={t("branch.fields.address")} name="address">
                <Input.TextArea
                  placeholder={t("branch.fields.address") || ""}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalRender>
    </>
  );
};
