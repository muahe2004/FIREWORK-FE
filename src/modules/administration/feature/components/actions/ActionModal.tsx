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
import { ERROR_TIMEOUT } from "@/constant/config";
import { queryClient } from "@/lib/react-query";
import {
  CACHE_ACTION,
  useCreateAction,
  useGetActionDetail,
  useUpdateAction,
} from "@/loader/action.loader";
import { UserState } from "@/store/auth/atom";
import { functionState } from "@/store/feature/atom";
import { useDisclosure } from "@/utils/modal";
import { RULES_FORM } from "@/utils/validator";

interface Props {
  isCreate?: boolean;
  id?: string;
}

export function ActionModal({ isCreate = true, id }: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const function_id = useRecoilValue(functionState);
  const userRecoil = useRecoilValue(UserState);
  const { t } = useTranslation();

  const { remove: removeAction, refetch } = useGetActionDetail({
    id: id!,
    enabled: isOpen && !!id,
    config: {
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) {
          refetch();
        } else {
          form.setFieldsValue(data);
        }
      },
    },
  });

  const createAction = useCreateAction({
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
        queryClient.invalidateQueries([CACHE_ACTION.SEARCH]);
      },
      onError: () => {
        notification.error({
          message: t("messages.create_failure"),
        });
      },
    },
  });

  const updateAction = useUpdateAction({
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
        queryClient.invalidateQueries([CACHE_ACTION.SEARCH]);
      },
      onError: () => {
        notification.error({
          message: t("messages.update_failure"),
        });
      },
    },
  });

  const handleOpen = () => {
    if (function_id) {
      open();
    }
  };

  const handleCancel = () => {
    close();
    removeAction();
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const dataPost = {
          ...values,
          function_id,
          lu_user_id: userRecoil.user_id,
          created_by_user_id: userRecoil.user_id,
        };
        isCreate
          ? createAction.mutate(dataPost)
          : updateAction.mutate(dataPost);
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
        <Tooltip title={!function_id ? "Hãy chọn tính năng" : "Thêm mới"}>
          <Flex justify={"center"} onClick={handleOpen} className="icon-add">
            <PlusCircleFilled disabled={!function_id} />
          </Flex>
        </Tooltip>
      ) : (
        <Tooltip title={t("authorization.actions.modal.title_update")}>
          <Button
            onClick={handleOpen}
            icon={<EditIcon />}
            type="text"
            className="center"
          />
        </Tooltip>
      )}
      <ModalRender
        open={isOpen}
        width={"40vw"}
        title={
          isCreate
            ? t("authorization.actions.modal.title_create")
            : t("authorization.actions.modal.title_update")
        }
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={
          isCreate ? createAction.isLoading : updateAction.isLoading
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={t("authorization.actions.table.action_code")}
                name={"action_code"}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  placeholder={
                    t("authorization.actions.table.action_code") || ""
                  }
                  disabled={!isCreate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="action_name"
                label={t("authorization.actions.table.action_name")}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  placeholder={
                    t("authorization.actions.table.action_name") || ""
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="action_api_url"
                label={t("authorization.actions.table.action_api_url")}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  placeholder={
                    t("authorization.actions.table.action_api_url") || ""
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label={t("authorization.actions.table.description")}
              >
                <Input.TextArea
                  placeholder={
                    t("authorization.actions.table.description") || ""
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
