import { Flex, Input, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { SelectRender } from "@/constant/antd";
import {
  SEARCH_BRANCH,
  SEARCH_CONTENT,
  SEARCH_DEPARTMENT,
  SEARCH_PAGE,
} from "@/constant/config";
import { useDropdownBranches } from "@/loader/branch.loader";
import { useDropdownDepartments } from "@/loader/department.loader";

import UserModal from "./components/UserModal";
import UserTable from "./components/UserTable";

export default function User(): JSX.Element {
  const { t } = useTranslation("translation");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchContent = searchParams.get(SEARCH_CONTENT) || "";
  const branch_id = searchParams.get(SEARCH_BRANCH) || "";
  const department_id = searchParams.get(SEARCH_DEPARTMENT) || "";

  const handleSearch = (value: string, key: string) => {
    searchParams.set(SEARCH_PAGE, "1");
    searchParams.set(key, value);

    setSearchParams(searchParams);
  };

  const { data: dropdownDepartments, isLoading: loadingDepartment } =
    useDropdownDepartments({});
  const { data: dropdownBranches, isLoading: loadingBranch } =
    useDropdownBranches({});

  return (
    <>
      <Flex justify="space-between" className="title-wrap">
        <Typography.Title level={3} className="title">
          {t("user.title")}
        </Typography.Title>
        <Space>
          <SelectRender
            style={{ width: 150 }}
            defaultValue={branch_id ? +branch_id : ""}
            loading={loadingBranch}
            options={[
              { label: t("all.all") + " chi nhánh", value: "" },
              ...(dropdownBranches
                ? dropdownBranches?.message
                  ? []
                  : dropdownBranches
                : []),
            ]}
            onSelect={(value) => handleSearch(value, SEARCH_BRANCH)}
          />
          <SelectRender
            style={{ width: 150 }}
            defaultValue={department_id ? +department_id : ""}
            loading={loadingDepartment}
            options={[
              { label: t("all.all") + " phòng ban", value: "" },
              ...(dropdownDepartments
                ? dropdownDepartments?.message
                  ? []
                  : dropdownDepartments
                : []),
            ]}
            onSelect={(value) => handleSearch(value, SEARCH_DEPARTMENT)}
          />
          <Input.Search
            placeholder={t("user.search_placeholder")}
            className="search-form"
            defaultValue={searchContent}
            onSearch={(value) => handleSearch(value, SEARCH_CONTENT)}
            onFocus={(e) => e.target.select()}
          />
          <UserModal />
        </Space>
      </Flex>

      <UserTable />
    </>
  );
}
