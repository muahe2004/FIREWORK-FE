import { Flex, Input, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { SEARCH_CONTENT, SEARCH_PAGE } from "@/constant/config";

import { DepartmentModal } from "./components/DepartmentModal";
import { DepartmentTable } from "./components/DepartmentTable";

export default function Department(): JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "department" });
  const [searchParams, setSearchParams] = useSearchParams();
  const searchContent = searchParams.get(SEARCH_CONTENT) || "";

  const handleSearch = (value: string) => {
    searchParams.set(SEARCH_PAGE, "1");
    searchParams.set(SEARCH_CONTENT, value);

    setSearchParams(searchParams);
  };

  return (
    <>
      <Flex justify="space-between" className="title-wrap">
        <Typography.Title level={3} className="title">
          {t("title")}
        </Typography.Title>
        <Space>
          <Input.Search
            placeholder={t("search_placeholder")}
            className="search-form"
            defaultValue={searchContent}
            onSearch={handleSearch}
            onFocus={(e) => e.target.select()}
          />
          <DepartmentModal />
        </Space>
      </Flex>

      <DepartmentTable />
    </>
  );
}
