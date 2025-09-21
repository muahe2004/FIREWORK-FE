import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Spin,
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
  useGetFunctionDetail,
  useSearchFunctions,
  useUpdateFunction,
} from "@/loader/function.loader";
import { UserState } from "@/store/auth/atom";
import { functionState } from "@/store/feature/atom";
import { getNodeFromTree } from "@/utils/array";
import { convertToPath } from "@/utils/format-string";
import { useDisclosure } from "@/utils/modal";
import { RULES_FORM } from "@/utils/validator";

export function UpdateFunctionModal(): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const function_id = useRecoilValue(functionState);
  const userRecoil = useRecoilValue(UserState);
  const [parentId, setParentId] = useState("");
  const [url, setUrl] = useState("");

  const { isLoading: loadingDetail, remove: removeGetFunction } =
    useGetFunctionDetail({
      id: function_id,
      enabled: isOpen,
      config: {
        onSuccess: (data) => {
          if (data.message === ERROR_TIMEOUT) {
            refetch();
          } else {
            setParentId(data.parent_id);
            const urls = data.url?.split("/");
            setUrl(urls?.[urls?.length - 1]);
            form.setFieldsValue(data);
          }
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

  const updateFunction = useUpdateFunction({
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
          message: t("messages.update_failure"),
        });
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    setUrl("");
    setParentId("");
    form.resetFields();
    removeGetFunction();
    close();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const node = getNodeFromTree(data?.data || [], parentId || function_id);
        const dataPost = {
          ...values,
          function_id,
          url: node?.url ? node?.url + "/" + url : "/" + url,
          level: node?.level + 1 || 1,
          lu_user_id: userRecoil.user_id,
        };
        updateFunction.mutate(dataPost);
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
      <Tooltip title={t("authorization.tooltip.btn_update")}>
        <Button type="default" disabled={!function_id} onClick={handleOpen}>
          <EditOutlined style={{ color: "#faad14" }} />
        </Button>
      </Tooltip>

      <ModalRender
        open={isOpen}
        width={"40%"}
        title={t("authorization.functions.modal.title_update")}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={updateFunction.isLoading}
      >
        <Spin spinning={loadingDetail}>
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label={t("authorization.functions.modal.function_group")}
                  name={"parent_id"}
                  rules={[...RULES_FORM.required]}
                  initialValue={function_id}
                  valuePropName="title"
                >
                  <TreeSelect
                    showSearch
                    style={{ width: "100%" }}
                    value={
                      parentId
                        ? parentId === "0"
                          ? function_id
                          : parentId
                        : function_id
                    }
                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    onChange={handelChangeParentFunction}
                    treeNodeFilterProp="title"
                    treeDefaultExpandedKeys={[function_id]}
                    treeData={data?.data}
                  />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label={t("authorization.functions.modal.function_name")}
                  name={"function_name"}
                  rules={[...RULES_FORM.required]}
                >
                  <Input
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
                <Form.Item label={"URL:"}>
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
        </Spin>
      </ModalRender>
    </>
  );
}
