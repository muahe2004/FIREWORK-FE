import { Button, Col, Flex, Input, Row, Tree, Typography } from "antd";
import { DirectoryTreeProps } from "antd/es/tree";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { ERROR_TIMEOUT } from "@/constant/config";
import { useSearchFunctions } from "@/loader/function.loader";
import { UserState } from "@/store/auth/atom";
import { functionState } from "@/store/feature/atom";

import styles from "../../scss/feature.module.scss";
import { CreateFunctionModal } from "./CreateFeatureModal";
import { DeleteFunctionModal } from "./DeleteFeatureModal";
import { UpdateFunctionModal } from "./UpdateFeatureModal";

export const FeatureTable = (): JSX.Element => {
  const [func, setFunction] = useRecoilState(functionState);
  const [contentSearch, setContentSearch] = useState("");
  const userRecoil = useRecoilValue(UserState);

  const [label, setLabel] = useState("");

  const { data, refetch } = useSearchFunctions({
    params: {
      search_content: isEmpty(contentSearch) ? null : contentSearch,
      user_id: userRecoil.user_id,
    },
    config: {
      onSuccess: (data) => {
        if (data.message === ERROR_TIMEOUT) {
          refetch();
        }
      },
    },
  });

  const { t } = useTranslation();

  const onSelect: DirectoryTreeProps["onSelect"] = (
    keys,
    { selectedNodes },
  ) => {
    setFunction(keys?.length > 0 ? keys[0].toString() : "");
    setLabel(selectedNodes?.[0]?.title?.toString() || "");
  };

  const handleSearch = (value: string) => {
    setContentSearch(value);
  };

  return (
    <>
      <Row
        className={styles.head_manager_wrap}
        style={{ padding: 0, paddingBottom: 12 }}
        justify={"space-between"}
      >
        <Col span={24} style={{ marginBottom: 12 }}>
          <Flex align="center" justify="space-between">
            <Typography.Title level={5} style={{ margin: 0 }} ellipsis>
              {t("authorization.functions.title_function")}
            </Typography.Title>
            <Button.Group style={{ justifyContent: "flex-end" }}>
              <CreateFunctionModal />
              <UpdateFunctionModal />
              <DeleteFunctionModal label={label} />
            </Button.Group>
          </Flex>
        </Col>
        <Col span={24}>
          <Input.Search
            onSearch={handleSearch}
            placeholder={t("authorization.functions.search_placeholder") || ""}
          />
        </Col>
      </Row>
      <Tree
        defaultExpandAll
        selectedKeys={[func]}
        className={styles.tree}
        style={{ maxHeight: 400, overflow: "auto" }}
        onSelect={onSelect}
        treeData={data?.data}
      />
    </>
  );
};
