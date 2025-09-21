import { Flex, TableColumnProps, Typography } from "antd";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { TableRender } from "@/constant/antd";
import {
  ERROR_TIMEOUT,
  SEARCH_BRANCH,
  SEARCH_CONTENT,
  SEARCH_DEPARTMENT,
  SEARCH_FROM_DASH,
  SEARCH_PAGE,
  SEARCH_SIZE,
} from "@/constant/config";
import { useSearchUsers } from "@/loader/user.loader";
import { UserState } from "@/store/auth/atom";
import { customerFilterState } from "@/store/filter/atom";
import { IUser } from "@/types/user";

import UserDeleteModal from "./UserDeleteModal";
import UserLockModal from "./UserLockModal";
import UserModal from "./UserModal";
import UserResetPasswordModal from "./UserResetPasswordModal";
import UserRoleModal from "./UserRoleModal";

export default function UserTable(): JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "user" });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get(SEARCH_PAGE) || "1";
  const pageSize = searchParams.get(SEARCH_SIZE) || "10";
  const searchContent = searchParams.get(SEARCH_CONTENT) || "";
  const branch_id = searchParams.get(SEARCH_BRANCH) || "";
  const department_id = searchParams.get(SEARCH_DEPARTMENT) || "";
  const fromDash = searchParams.get(SEARCH_FROM_DASH);

  const userRecoil = useRecoilValue(UserState);
  const [customerFilter, setCustomerFilter] =
    useRecoilState(customerFilterState);

  const usersQuery = useSearchUsers({
    params: {
      search_content: searchContent?.toLowerCase()?.trim(),
      pageIndex: +page,
      pageSize: +pageSize,
      user_id: userRecoil.user_id,
      branch_id: isEmpty(branch_id) ? null : branch_id,
      department_id: isEmpty(department_id) ? null : department_id,
      customer_id: isEmpty(customerFilter) ? null : customerFilter,
    },
    config: {
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) usersQuery.refetch();
      },
    },
  });

  useEffect(() => {
    if (fromDash) {
      const prevCustomer = customerFilter;
      setCustomerFilter("");
      return () => setCustomerFilter(prevCustomer);
    }
  }, []);

  const columns: TableColumnProps<IUser>[] = [
    {
      title: t("fields.serial"),
      align: "center",
      width: 50,
      render: (_, __, index) => index + 1 + +pageSize * (+page - 1),
    },
    {
      title: t("fields.username"),
      dataIndex: "user_name",
      width: 80,
      render: (_, record) => <UserModal isCreate={false} user={record} />,
    },
    {
      title: t("fields.full_name"),
      dataIndex: "full_name",
      width: 120,
    },
    {
      title: t("fields.phone"),
      dataIndex: "phone_number",
      align: "center",
      width: 100,
    },
    {
      title: t("fields.email"),
      dataIndex: "email",
      width: 180,
      render: (value) => (
        <Typography.Link
          href={`mailto:${value}`}
          target="_blank"
          rel="noopener"
        >
          {value}
        </Typography.Link>
      ),
    },
    {
      title: t("fields.position"),
      dataIndex: "position_name",
      width: 120,
    },
    {
      title: t("fields.branch"),
      dataIndex: "branch_name",
      width: 100,
    },
    {
      title: t("fields.department"),
      dataIndex: "department_name",
      width: 130,
    },
    {
      title: t("fields.role"),
      dataIndex: "role_group",
    },
    {
      title: t("fields.action"),
      align: "center",
      width: 100,
      render: (_, record) => (
        <Flex align="center" justify="center">
          <UserRoleModal user={record} />
          <UserLockModal user={record} />
          <UserDeleteModal id={record.user_id} label={record.full_name} />
          <UserResetPasswordModal user={record} />
        </Flex>
      ),
    },
  ];

  return (
    <div className="table-wrap">
      <TableRender
        columns={columns}
        loading={usersQuery.isLoading}
        dataSource={usersQuery.data?.data || []}
        pagination={{
          total: usersQuery.data?.totalItems || 0,
          current: +page,
          pageSize: +pageSize,
          onChange: (page, pageSize) => {
            searchParams.set(SEARCH_PAGE, page + "");
            searchParams.set(SEARCH_SIZE, pageSize + "");
            setSearchParams(searchParams);
          },
        }}
        rowKey={"user_id"}
      />
    </div>
  );
}
