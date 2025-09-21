import { Col, Flex, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import ActionTable from "./components/actions/ActionTable";
import { FeatureTable } from "./components/feature/FeatureTable";

export default function Feature(): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <Flex justify="space-between" className="title-wrap">
        <Typography.Title level={3} className="title">
          {t("authorization.functions.title")}
        </Typography.Title>
      </Flex>
      <Row gutter={16}>
        <Col span={7}>
          <div className={"table-wrap"}>
            <FeatureTable />
          </div>
        </Col>
        <Col span={17}>
          <div className="table-wrap">
            <ActionTable />
          </div>
        </Col>
      </Row>
    </>
  );
}
