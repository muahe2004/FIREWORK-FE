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
import { useSearchBranches } from "@/loader/branch.loader";
import { UserState } from "@/store/auth/atom";
import { IBranch } from "@/types/branch";

import { BranchDelete } from "./BranchDelete";
import { BranchModal } from "./BranchModal";

export const BranchTable = (): JSX.Element => {
  const { t } = useTranslation("translation", { keyPrefix: "branch" });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get(SEARCH_PAGE) || "1";
  const pageSize = searchParams.get(SEARCH_SIZE) || "10";
  const searchContent = searchParams.get(SEARCH_CONTENT) || "";

  const userRecoil = useRecoilValue(UserState);

  const branchesQuery = useSearchBranches({
    params: {
      search_content: searchContent?.toLowerCase()?.trim(),
      pageIndex: +page,
      pageSize: +pageSize,
      user_id: userRecoil.user_id,
    },
    config: {
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) branchesQuery.refetch();
      },
    },
  });

  const columns: TableColumnsType<IBranch> = [
    {
      title: t("fields.serial"),
      align: "center",
      width: 50,
      render: (_, __, index) => index + 1 + +pageSize * (+page - 1),
    },
    {
      title: t("fields.branch_name"),
      dataIndex: "branch_name",
      width: 150,
      render: (_, record) => <BranchModal isCreate={false} branch={record} />,
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
          <BranchDelete id={record.branch_id} label={record.branch_name} />
        </Flex>
      ),
    },
  ];

  return (
    <div className="table-wrap">
      <TableRender
        columns={columns}
        loading={branchesQuery.isLoading}
        dataSource={branchesQuery.data?.data || []}
        pagination={{
          total: branchesQuery.data?.totalItems || 0,
          current: +page,
          pageSize: +pageSize,
          onChange: (page, pageSize) => {
            searchParams.set(SEARCH_PAGE, page + "");
            searchParams.set(SEARCH_SIZE, pageSize + "");
            setSearchParams(searchParams);
          },
        }}
        rowKey={"branch_id"}
      />
    </div>
  );
};
