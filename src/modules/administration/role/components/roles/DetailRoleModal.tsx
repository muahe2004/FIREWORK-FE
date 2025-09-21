import {
  Button,
  Col,
  Flex,
  Row,
  TableColumnsType,
  Tooltip,
  Typography,
} from "antd";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { ModalRender, TableRender } from "@/constant/antd";
import { ERROR_TIMEOUT } from "@/constant/config";
import { useSearchRoles } from "@/loader/role.loader";
import { UserState } from "@/store/auth/atom";
import { IRole } from "@/types/role";
import { useDisclosure } from "@/utils/modal";

import styles from "../../scss/role.module.scss";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { RoleModal } from "./RoleModal";

export function DetailRoleModal(): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  // Set init params
  const pageIndex = Number(searchParams.get("index_role")) || 1;
  const pageSize = Number(searchParams.get("size_role")) || 10;
  const searchContent = searchParams.get("search_role") || "";
  const userRecoil = useRecoilValue(UserState);

  // Get roles
  const rolesQuery = useSearchRoles({
    params: {
      pageIndex: pageIndex,
      pageSize: pageSize,
      search_content: isEmpty(searchContent) ? null : searchContent,
      user_id: userRecoil.user_id,
    },
    config: {
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) {
          rolesQuery.refetch();
        }
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const columns: TableColumnsType<IRole> = [
    {
      title: t("authorization.roles.table.stt"),
      width: 50,
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("authorization.roles.table.role_code"),
      dataIndex: "role_code",
      width: 200,
      key: "role_code",
      sorter: (a, b) => {
        const nameA = a.role_code?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.role_code?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.roles.table.role_name"),
      dataIndex: "role_name",
      width: "25%",
      sorter: (a, b) => {
        const nameA = a.role_name?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.role_name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.roles.table.description"),
      dataIndex: "description",
      sorter: (a, b) => {
        const nameA = a.description?.toUpperCase() || ""; // ignore upper and lowercase
        const nameB = b.description?.toUpperCase() || ""; // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.roles.table.action"),
      width: 70,
      dataIndex: "action",
      align: "center",
      key: "action",
      render: (_, record) => {
        return (
          <Flex>
            <RoleModal isCreate={false} id={record.role_id} />
            <DeleteRoleModal id={record.role_id} label={record.role_name} />
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Tooltip title={t("authorization.tooltip.btn_detail_role")}>
        <Button
          size="small"
          type="default"
          onClick={handleOpen}
          style={{ width: "50px !important" }}
          className={"btn btn-primary"}
        >
          {/* <EyeOutlined style={{ color: "#1587F1" }} /> */}
          Xem
        </Button>
      </Tooltip>
      <ModalRender
        title={t("authorization.roles.title_role")}
        open={isOpen}
        width={"60vw"}
        onOk={handleCancel}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <Row gutter={16} align={"middle"}>
          <Col
            span={24}
            className={styles.padding_l_1}
            style={{ marginTop: 10 }}
          >
            <TableRender
              columns={columns}
              loading={rolesQuery?.isLoading}
              dataSource={rolesQuery?.data?.data}
              scroll={{ x: 1 }}
              footer={() => <RoleModal />}
              pagination={{
                total: rolesQuery?.data?.totalItems,
                current: pageIndex,
                pageSize,
                onChange: (page, pageSize) => {
                  searchParams.set("index_role", String(page));
                  searchParams.set("size_role", String(pageSize));
                  setSearchParams(searchParams);
                },
                showTotal(total, range) {
                  return (
                    `${range[0]}-${range[1]} trên ${total} ` +
                    t("authorization.roles.title_role").toLowerCase()
                  );
                },
              }}
              rowKey={"role_id"}
            />
          </Col>
        </Row>
      </ModalRender>
    </>
  );
}
