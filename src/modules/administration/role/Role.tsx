import { Col, Flex, Row, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ActionTable from "./components/actions/ActionTable";
import RoleTable from "./components/roles/RoleTable";

export default function Role(): JSX.Element {
  const { t } = useTranslation();
  const [dataChecked, setDataChecked] = useState<any[]>([]);

  return (
    <>
      {/* <FeatureTable /> */}
      <Flex justify="space-between" className="title-wrap">
        <Typography.Title level={3} className="title">
          {t("authorization.roles.title")}
        </Typography.Title>
      </Flex>
      <Row gutter={16}>
        <Col span={7}>
          <div className={"content-table"}>
            <RoleTable
              dataChecked={dataChecked}
              setDataChecked={setDataChecked}
            />
          </div>
        </Col>
        <Col span={17}>
          <div className="content-table">
            <ActionTable />
          </div>
        </Col>
      </Row>
    </>
  );
}
