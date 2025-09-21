import { Flex, TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { TableRender } from "@/constant/antd";
import {
  ERROR_TIMEOUT,
  SEARCH_CONTENT,
  SEARCH_PAGE,
  SEARCH_SIZE,
} from "@/constant/config";
import { useSearchProducts } from "@/loader/product.loader";
import { UserState } from "@/store/auth/atom";
import { IProduct } from "@/types/product";

import { ProductDelete } from "./ProductDelete";
import { ProductModal } from "./ProductModel";
import { useDropdownProductTypes } from "@/loader/product-type.loader";

export const BranchTable = (): JSX.Element => {
    const { t } = useTranslation("translation", { keyPrefix: "product" });
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get(SEARCH_PAGE) || "1";
    const pageSize = searchParams.get(SEARCH_SIZE) || "10";
    const searchContent = searchParams.get(SEARCH_CONTENT) || "";

    const userRecoil = useRecoilValue(UserState);

    const productsQuery = useSearchProducts({
        params: {
        search_content: searchContent?.toLowerCase()?.trim(),
        pageIndex: +page,
        pageSize: +pageSize,
        user_id: userRecoil.user_id,
        },
        config: {
            onSuccess: (data) => {
                if (data.message === ERROR_TIMEOUT) productsQuery.refetch();
            },
        },
    });

    const productTypesQuery = useDropdownProductTypes({
        config: {
            onSuccess: (data) => {
                if (data.message === ERROR_TIMEOUT) productTypesQuery.refetch();
            },
        },
    });

    const columns: TableColumnsType<IProduct> = [
        {
            title: t("fields.serial"),
            align: "center",
            width: 50,
            render: (_, __, index) => index + 1 + +pageSize * (+page - 1),
        },
        {
            title: t("fields.product_name"),
            dataIndex: "product_name",
            width: 200,
            render: (_, record) => (
            <ProductModal isCreate={false} product={record} />
            ),
        },
        {
            title: t("fields.product_code"),
            dataIndex: "product_code",
            width: 150,
            align: "center",
        },
        {
            title: t("fields.product_imageURL"),
            dataIndex: "image_url",
            width: 200,
            align: "center",
            // render: (url: string) => (
            //     <img src={url} alt="product" style={{ width: 80, height: "auto" }} />
            // ),
        },
        {
            title: t("fields.product_type"),
            dataIndex: "type_id",
            width: 150,
            align: "center",
            render: (type_id: string) => {
                const type = productTypesQuery.data?.find((item: any) => item.value === type_id);
                return type ? type.label : "-";
            },
        },
        {
            title: t("fields.product_price"),
            dataIndex: "price",
            align: "center",
            render: (value: number | string) =>
            new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(Number(value)),
        },
        {
            title: t("fields.product_stock"),
            dataIndex: "stock",
            align: "center",
        },
        {
            title: t("fields.action"),
            align: "center",
            width: 100,
            render: (_, record) => (
            <Flex align="center" gap={8} justify="center">
                <ProductDelete id={record.product_id} label={record.product_name} />
            </Flex>
            ),
        },
    ];

    return (
        <div className="table-wrap">
        <TableRender
            columns={columns}
            loading={productsQuery.isLoading}
            dataSource={productsQuery.data?.data || []}
            pagination={{
            total: productsQuery.data?.totalItems || 0,
            current: +page,
            pageSize: +pageSize,
            onChange: (page, pageSize) => {
                searchParams.set(SEARCH_PAGE, page + "");
                searchParams.set(SEARCH_SIZE, pageSize + "");
                setSearchParams(searchParams);
            },
            }}
            rowKey={"product_id"}
        />
        </div>
    );
};

// "product_id": "03d78646-9652-11f0-842e-b5e147c0ec61",
// "product_code": "PRD001 test update 2",
// "product_name": "Điện thoại iPhone 17 Pro Max",
// "image_url": "https://example.com/images/iphone16.png",
// "type_id": "16861152-964f-11f0-842e-b5e147c0ec61",
// "price": "32999.99",
// "stock": 150,
// "unit": "cái",
// "description": "iPhone 16 Pro Max bản 256GB, màu Titan Xanh, bảo hành 12 tháng.",
// "active_flag": 1,
// "createdAt": "2025-09-20T18:45:44.000Z",
// "updatedAt": "2025-09-20T18:59:29.000Z",