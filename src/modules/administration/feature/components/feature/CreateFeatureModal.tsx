import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Tooltip,
  TreeSelect,
  Typography,
  notification,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { ModalRender } from "@/constant/antd";
import { ERROR_TIMEOUT } from "@/constant/config";
import { queryClient } from "@/lib/react-query";
import {
  CACHE_FUNCTION,
  useCreateFunction,
  useSearchFunctions,
} from "@/loader/function.loader";
import { UserState } from "@/store/auth/atom";
import { functionState } from "@/store/feature/atom";
import { getNodeFromTree } from "@/utils/array";
import { convertToPath } from "@/utils/format-string";
import { useDisclosure } from "@/utils/modal";
import { RULES_FORM } from "@/utils/validator";

export function CreateFunctionModal(): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const function_id = useRecoilValue(functionState);
  const [parentId, setParentId] = useState("");
  const [url, setUrl] = useState("");
  const userRecoil = useRecoilValue(UserState);

  const createFunction = useCreateFunction({
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
        handleCancel();
      },
      onError: () => {
        notification.error({
          message: t("messages.create_failure"),
        });
      },
    },
  });

  const { data, refetch } = useSearchFunctions({
    params: {
      user_id: userRecoil.user_id,
    },
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) {
          refetch();
        }
      },
    },
  });

  const handleOpen = () => {
    form.setFieldValue("parent_id", function_id);
    open();
  };

  const handleCancel = () => {
    setUrl("");
    setParentId("");
    form.resetFields();
    close();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const node = getNodeFromTree(data?.data || [], parentId || function_id);
        const dataPost = {
          ...values,
          parent_id: values.parent_id ? values.parent_id : 0,
          url: (node?.url || "") + "/" + url,
          level: node?.level + 1 || 1,
          created_by_user_id: userRecoil.user_id,
        };
        createFunction.mutate(dataPost);
      })
      .catch(() => {
        notification.warning({
          message: "Cần điền đầy đủ thông tin",
        });
      });
  };

  const handelChangeParentFunction = (newValue: string) => {
    setParentId(newValue);
  };

  const handleInputName = (value: string) => {
    form.setFieldValue("url", convertToPath(value));
    setUrl(convertToPath(value));
  };

  return (
    <>
      <Tooltip title={t("all.btn_add")}>
        <Button type="default" onClick={handleOpen}>
          <PlusCircleOutlined style={{ color: "#1587F1" }} />
        </Button>
      </Tooltip>
      <ModalRender
        open={isOpen}
        width={"40%"}
        title={t("authorization.functions.modal.title_create")}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createFunction.isLoading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={t("authorization.functions.modal.function_group")}
                name={"parent_id"}
                rules={[...(function_id ? RULES_FORM.required : [])]}
                valuePropName="title"
              >
                <TreeSelect
                  showSearch
                  style={{ width: "100%" }}
                  value={parentId || function_id}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  onChange={handelChangeParentFunction}
                  treeNodeFilterProp="title"
                  treeDefaultExpandedKeys={[function_id]}
                  treeData={data?.data}
                  disabled={!function_id}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {function_id ? (
                <></>
              ) : (
                <Form.Item label={" "}>
                  <Typography.Text>Đây là tính năng lớn nhất</Typography.Text>
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("authorization.functions.modal.function_name")}
                name={"function_name"}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  onChange={(e) => handleInputName(e.target.value)}
                  placeholder={
                    t("authorization.functions.modal.function_name") || ""
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sort_order"
                label={t("authorization.functions.modal.sort_order")}
                initialValue={0}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={
                    t("authorization.functions.modal.sort_order") || ""
                  }
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={"URL:"}
                name={"url"}
                rules={[...RULES_FORM.required]}
              >
                <Typography.Text type="secondary">
                  {
                    getNodeFromTree(data?.data || [], parentId || function_id)
                      ?.url
                  }
                  /{url}
                </Typography.Text>
                <Input
                  value={url}
                  onChange={(e) => handleInputName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label={t("authorization.functions.modal.description")}
              >
                <Input.TextArea
                  style={{ width: "100%" }}
                  placeholder={
                    t("authorization.functions.modal.description") || ""
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
