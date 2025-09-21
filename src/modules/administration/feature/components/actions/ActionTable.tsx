import { Col, Flex, Input, Row, TableColumnsType, Typography } from "antd";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { TableRender } from "@/constant/antd";
import { ERROR_TIMEOUT } from "@/constant/config";
import { useSearchActions } from "@/loader/action.loader";
import { UserState } from "@/store/auth/atom";
import { functionState } from "@/store/feature/atom";
import { IAction } from "@/types/action";

import styles from "../../scss/feature.module.scss";
import { ActionModal } from "./ActionModal";
import { DeleteActionModal } from "./DeleteActionModal";

export default function ActionTable(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const function_id = useRecoilValue(functionState);
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(UserState);

  // Set init params
  const pageIndex = Number(searchParams.get("index_action")) || 1;
  const pageSize = Number(searchParams.get("size_action")) || 10;
  const searchContent = searchParams.get("search_action") || "";

  const actionsQuery = useSearchActions({
    params: {
      page_index: pageIndex,
      page_size: pageSize,
      search_content: isEmpty(searchContent) ? null : searchContent,
      function_id,
      user_id: userRecoil.user_id,
    },
    config: {
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) {
          actionsQuery.refetch();
        }
      },
    },
  });

  const handleSearch = (value: string) => {
    searchParams.set("search_action", value.trim());
    searchParams.delete("index_action");
    searchParams.delete("size_action");
    setSearchParams(searchParams);
  };

  const columns: TableColumnsType<IAction> = [
    {
      title: t("authorization.actions.table.stt"),
      width: 70,
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("authorization.actions.table.action_code"),
      dataIndex: "action_code",
      width: 150,
      key: "action_code",
      sorter: (a, b) => {
        const nameA = a.action_code?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.action_code?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.actions.table.action_name"),
      dataIndex: "action_name",
      sorter: (a, b) => {
        const nameA = a.action_name?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.action_name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.actions.table.action_api_url"),
      dataIndex: "action_api_url",
      ellipsis: { showTitle: true },
      width: 300,
      key: "action_api_url",
      sorter: (a, b) => {
        const nameA = a.action_api_url?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.action_api_url?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.actions.table.action"),
      width: 70,
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Flex>
            <ActionModal isCreate={false} id={record?.action_code} />
            <DeleteActionModal
              id={record.action_code}
              label={record.action_name}
            />
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Row
        align={"middle"}
        className={styles.head_manager_wrap}
        style={{ padding: 0, paddingBottom: 16 }}
      >
        <Col>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            {t("authorization.actions.title")}
          </Typography.Title>
        </Col>
        <div style={{ flex: "1 1 0" }}>
          <Col
            span={7}
            style={{ maxWidth: "400px", marginLeft: "auto" }}
            className={styles.padding_none}
          >
            <Input.Search
              onSearch={handleSearch}
              placeholder={
                t("authorization.actions.search_placeholder") || undefined
              }
            />
          </Col>
        </div>
      </Row>
      <TableRender
        columns={columns}
        loading={actionsQuery.isLoading}
        dataSource={actionsQuery?.data?.data}
        scroll={{ x: 1 }}
        footer={() => <ActionModal />}
        pagination={{
          total: actionsQuery?.data?.totalItems,
          current: pageIndex,
          pageSize,
          onChange: (page, pageSize) => {
            searchParams.set("index_action", String(page));
            searchParams.set("size_action", String(pageSize));
            setSearchParams(searchParams);
          },
        }}
        rowKey={(record) => record.action_code}
      />
    </>
  );
}
