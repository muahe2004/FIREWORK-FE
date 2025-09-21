import { Button, Result } from "antd";
import { useEffect } from "react";
import { FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { HOME_URL } from "@/urls";

export function ErrorTemp(props: FallbackProps): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (props?.error?.message?.includes("dynamically imported")) {
      window.location.reload();
    }
  }, [props]);

  useEffect(() => {
    document.title = "Lỗi hệ thống | Firework";
  }, []);

  return (
    <Result
      style={{ paddingTop: 150 }}
      status="500"
      title={t("error.500.title")}
      subTitle={t("error.500.subTitle")}
      extra={
        <Button type="primary" onClick={backHome}>
          Quay lại
        </Button>
      }
    />
  );

  function backHome() {
    props.resetErrorBoundary();
    navigate(HOME_URL);
  }
}
