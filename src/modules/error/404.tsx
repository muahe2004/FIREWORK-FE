import { Button, Result } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { HOME_URL } from "@/urls";

export function NotFoundPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Không tìm thấy trang | Firework";
  }, []);

  return (
    <Result
      style={{ paddingTop: 150 }}
      status="404"
      title={t("error.404.title")}
      subTitle={t("error.404.subTitle")}
      extra={
        <Button type="primary" onClick={backHome}>
          {t("error.backHome")}
        </Button>
      }
    />
  );

  function backHome() {
    navigate(HOME_URL);
  }
}
