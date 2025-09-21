import { PlusCircleFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Tooltip,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { EditIcon } from "@/assets/svg";
import { ModalRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import {
  CACHE_ROLE,
  useCreateRole,
  useGetRoleDetail,
  useUpdateRole,
} from "@/loader/role.loader";
import { UserState } from "@/store/auth/atom";
import { useDisclosure } from "@/utils/modal";
import { RULES_FORM } from "@/utils/validator";

interface Props {
  isCreate?: boolean;
  id?: string;
}

export function RoleModal({ isCreate = true, id }: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const userRecoil = useRecoilValue(UserState);
  const { t } = useTranslation();

  const { remove: removeGetRole } = useGetRoleDetail({
    id: id!,
    enabled: isOpen && !!id,
    config: {
      onSuccess: (data) => {
        form.setFieldsValue(data);
      },
    },
  });

  const createRole = useCreateRole({
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
        handleCancel();
        queryClient.invalidateQueries([CACHE_ROLE.SEARCH]);
      },
      onError: () => {
        notification.error({
          message: t("messages.create_failure"),
        });
      },
    },
  });

  const updateRole = useUpdateRole({
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
        handleCancel();
        queryClient.invalidateQueries([CACHE_ROLE.SEARCH]);
      },
      onError: () => {
        notification.error({
          message: t("messages.update_failure"),
        });
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    removeGetRole();
    form.resetFields();
    close();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const dataPost = {
          ...values,
          role_id: id,
          lu_user_id: userRecoil.user_id,
          created_by_user_id: userRecoil.user_id,
        };
        isCreate ? createRole.mutate(dataPost) : updateRole.mutate(dataPost);
      })
      .catch(() => {
        notification.warning({
          message: "Cần điền đầy đủ thông tin",
        });
      });
  };

  return (
    <>
      {isCreate ? (
        <Tooltip title={t("all.btn_add")}>
          <Flex justify={"center"} onClick={handleOpen} className="icon-add">
            <PlusCircleFilled />
          </Flex>
        </Tooltip>
      ) : (
        <Tooltip title={t("all.btn_update")}>
          <Button onClick={handleOpen} icon={<EditIcon />} type="text" />
        </Tooltip>
      )}
      <ModalRender
        title={
          isCreate
            ? t("authorization.roles.modal.title_create")
            : t("authorization.roles.modal.title_update")
        }
        width={"60vw"}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createRole.isLoading || updateRole.isLoading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item
                label={t("authorization.roles.table.role_code")}
                name={"role_code"}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  placeholder={t("authorization.roles.table.role_code") || ""}
                  disabled={!isCreate}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("authorization.roles.table.role_name")}
                name={"role_name"}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  placeholder={t("authorization.roles.table.role_name") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label={t("authorization.roles.table.description")}
              >
                <Input
                  placeholder={t("authorization.roles.table.description") || ""}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalRender>
    </>
  );
}
