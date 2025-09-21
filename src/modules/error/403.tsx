import { Button, Result } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { useGetDetailUser } from "@/loader/user.loader";
import { UserState } from "@/store/auth/atom";
import { HOME_URL } from "@/urls";

export function NotAuthorizationPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userRecoil = useRecoilValue(UserState);

  useGetDetailUser({ id: userRecoil.user_id });

  useEffect(() => {
    document.title = "Không có quyền truy cập | Firework";
  }, []);

  return (
    <Result
      style={{ paddingTop: 150 }}
      status="403"
      title={t("error.403.title")}
      subTitle={t("error.403.subTitle")}
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
