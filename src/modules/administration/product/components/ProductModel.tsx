import { Button, Col, Form, Input, Row, Select, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { ModalRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import {
  CACHE_PRODUCT,
  useCreateProduct,
  useUpdateProduct,
} from "@/loader/product.loader";
import { UserState } from "@/store/auth/atom";
import { IProduct } from "@/types/product";
import { useDisclosure } from "@/utils/modal";
import { RULES_FORM } from "@/utils/validator";
import { useDropdownProductTypes } from "@/loader/product-type.loader";
import { ERROR_TIMEOUT } from "@/constant/config";

// const { Text } = Typography;
interface Props {
  isCreate?: boolean;
  product?: IProduct;
}

export const ProductModal = ({ isCreate = true, product }: Props) => {
    const [form] = Form.useForm();
    const { isOpen, close, open } = useDisclosure();
    const { t } = useTranslation();
    const userRecoil = useRecoilValue(UserState);

    const productTypesQuery = useDropdownProductTypes({
        config: {
            onSuccess: (data) => {
                if (data.message === ERROR_TIMEOUT) productTypesQuery.refetch();
            },
        },
    });

    const updateProduct = useUpdateProduct({
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
            queryClient.invalidateQueries(CACHE_PRODUCT.SEARCH);
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

    const createProduct = useCreateProduct({
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
            queryClient.invalidateQueries(CACHE_PRODUCT.SEARCH);
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
        form.setFieldsValue(product);
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
            // dataPost.created_by_user_id = userRecoil.user_id;
                createProduct.mutate(dataPost);
            } else {
            // dataPost.lu_user_id = userRecoil.user_id;
                updateProduct.mutate(dataPost);
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
                {product?.product_name}
                </Typography.Link>
            )}
            <ModalRender
                open={isOpen}
                width={"50vw"}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={updateProduct.isLoading || createProduct.isLoading}
                title={isCreate ? t("branch.title_create") : t("branch.title_update")}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Form.Item name="product_id" hidden />

                        <Col span={12}>
                        <Form.Item
                            label={t("product.fields.product_code")}
                            name="product_code"
                            rules={[...RULES_FORM.required]}
                        >
                            <Input
                            type="text"
                            placeholder={t("product.fields.product_code") || ""}
                            />
                        </Form.Item>
                        </Col>

                        <Col span={12}>
                        <Form.Item
                            label={t("product.fields.product_name")}
                            name="product_name"
                            rules={[...RULES_FORM.required]}
                        >
                            <Input
                            type="text"
                            placeholder={t("product.fields.product_name") || ""}
                            />
                        </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={t("product.fields.product_type")}
                                name="type_id"
                                rules={[...RULES_FORM.required]}
                            >
                                <Select
                                    placeholder={t("product.fields.product_type") || ""}
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {productTypesQuery.data?.map((type: any) => (
                                        <Select.Option key={type.value} value={type.value}>
                                            {type.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                        <Form.Item
                            label={t("product.fields.product_price")}
                            name="price"
                            rules={[...RULES_FORM.required]}
                        >
                            <Input
                            type="number"
                            placeholder={t("product.fields.product_price") || ""}
                            />
                        </Form.Item>
                        </Col>

                        <Col span={12}>
                        <Form.Item
                            label={t("product.fields.product_stock")}
                            name="stock"
                            rules={[...RULES_FORM.required]}
                        >
                            <Input
                            type="number"
                            placeholder={t("product.fields.product_stock") || ""}
                            />
                        </Form.Item>
                        </Col>

                        <Col span={12}>
                        <Form.Item
                            label={t("product.fields.product_unit")}
                            name="unit"
                            rules={[...RULES_FORM.required]}
                        >
                            <Input
                            type="text"
                            placeholder={t("product.fields.product_unit") || ""}
                            />
                        </Form.Item>
                        </Col>

                        <Col span={24}>
                        <Form.Item
                            label={t("product.fields.product_description")}
                            name="description"
                        >
                            <Input.TextArea
                            rows={3}
                            placeholder={t("product.fields.product_description") || ""}
                            />
                        </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </ModalRender>
        </>
    );
};