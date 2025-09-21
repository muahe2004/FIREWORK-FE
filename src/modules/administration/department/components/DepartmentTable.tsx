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
import { useSearchDepartments } from "@/loader/department.loader";
import { UserState } from "@/store/auth/atom";
import { IDepartment } from "@/types/department";

import { DepartmentDelete } from "./DepartmentDelete";
import { DepartmentModal } from "./DepartmentModal";

export const DepartmentTable = (): JSX.Element => {
  const { t } = useTranslation("translation", { keyPrefix: "department" });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get(SEARCH_PAGE) || "1";
  const pageSize = searchParams.get(SEARCH_SIZE) || "10";
  const searchContent = searchParams.get(SEARCH_CONTENT) || "";

  const userRecoil = useRecoilValue(UserState);

  const departmentsQuery = useSearchDepartments({
    params: {
      search_content: searchContent?.toLowerCase()?.trim(),
      pageIndex: +page,
      pageSize: +pageSize,
      user_id: userRecoil.user_id,
    },
    config: {
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) departmentsQuery.refetch();
      },
    },
  });

  const columns: TableColumnsType<IDepartment> = [
    {
      title: t("fields.serial"),
      align: "center",
      width: 50,
      render: (_, __, index) => index + 1 + +pageSize * (+page - 1),
    },
    {
      title: t("fields.department_name"),
      dataIndex: "department_name",
      width: 150,
      render: (_, record) => (
        <DepartmentModal isCreate={false} department={record} />
      ),
    },
    {
      title: t("fields.phone"),
      width: 120,
      align: "center",
      dataIndex: "phone",
    },
    {
      title: t("fields.fax"),
      width: 120,
      align: "center",
      dataIndex: "fax",
    },
    {
      title: t("fields.address"),
      dataIndex: "type",
    },
    {
      title: t("fields.action"),
      align: "center",
      width: 50,
      render: (_, record) => (
        <Flex align="center" gap={8} justify="center">
          <DepartmentDelete
            id={record.department_id}
            label={record.department_name}
          />
        </Flex>
      ),
    },
  ];

  return (
    <div className="table-wrap">
      <TableRender
        columns={columns}
        loading={departmentsQuery.isLoading}
        dataSource={departmentsQuery.data?.data || []}
        pagination={{
          total: departmentsQuery.data?.totalItems || 0,
          current: +page,
          pageSize: +pageSize,
          onChange: (page, pageSize) => {
            searchParams.set(SEARCH_PAGE, page + "");
            searchParams.set(SEARCH_SIZE, pageSize + "");
            setSearchParams(searchParams);
          },
        }}
        rowKey={"department_id"}
      />
    </div>
  );
};
