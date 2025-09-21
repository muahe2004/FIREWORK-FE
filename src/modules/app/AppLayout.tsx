import { CheckOutlined } from "@ant-design/icons";
import { ProLayout, ProLayoutProps } from "@ant-design/pro-components";
import { ConfigProvider, Image, Space, Typography } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import logoCollapsed from "@/assets/img/logo/logo-2.png";
import logo from "@/assets/img/logo/logo-3.png";
import "@/assets/scss/index.scss";
import { LOCAL_COLLAPSE, LOCAL_COLOR } from "@/constant/config";
import { UserState } from "@/store/auth/atom";
import { collapsedSidebarState } from "@/store/layout/atom";
import { HOME_URL } from "@/urls";
import { storageService } from "@/utils/storage";

import Header from "../shared/header/Header";
import Settings from "../shared/settings/Settings";
import { appRoute } from "./AppRouter";

dayjs.extend(utc);

interface Props {
  children?: React.ReactNode;
}

const settings: ProLayoutProps = {
  fixSiderbar: true,
};

const listColors = ["#07527e", "#004225", "#6B240C"];

export default function AppLayout({ children }: Props): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const userRecoil = useRecoilValue(UserState);
  const [primary, setPrimary] = useState(
    () => storageService.getStorage(LOCAL_COLOR, false) || listColors[0],
  );

  const [collapsed, setCollapsed] = useRecoilState(collapsedSidebarState);

  useEffect(() => {
    handleCollapsed(storageService.getStorage(LOCAL_COLLAPSE) || 0);
    handleChangeColor(
      storageService.getStorage(LOCAL_COLOR, false) || listColors[0],
    )();
  }, []);

  const handleChangeColor = (color: string) => () => {
    if (color) {
      setPrimary(color);
      const root = document.documentElement;
      root.style.setProperty("--color-primary", color);
      storageService.setStorage(LOCAL_COLOR, color);
    }
  };

  const handleCollapsed = (status: boolean) => {
    storageService.setStorage(LOCAL_COLLAPSE, JSON.stringify(+status));
    setCollapsed(status);
  };

  if (location.pathname === "/")
    return <Navigate to={HOME_URL} replace relative="route" />;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primary,
        },
      }}
    >
      <ProLayout
        collapsed={collapsed}
        onCollapse={handleCollapsed}
        collapsedButtonRender={false}
        menuHeaderRender={undefined}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <div className="color-picker">
              <Space>
                {listColors.map((color, index) => (
                  <div
                    className="color-wrap"
                    key={index}
                    onClick={handleChangeColor(color)}
                  >
                    <div
                      className="color-item"
                      style={{ backgroundColor: color }}
                    >
                      {color === primary && (
                        <CheckOutlined style={{ color: "#fff" }} />
                      )}
                    </div>
                  </div>
                ))}
              </Space>
            </div>
          );
        }}
        location={location}
        style={{
          height: "100vh",
        }}
        siderWidth={240}
        logo={
          <div onClick={() => navigate(HOME_URL)}>
            <Typography.Text
              style={{ fontSize: collapsed ? 10 : 18, whiteSpace: "nowrap" }}
            >
              <Image
                src={collapsed ? logoCollapsed : logo}
                width={collapsed ? 40 : 150}
                preview={false}
              />
            </Typography.Text>
          </div>
        }
        title={""}
        menu={{
          loading: userRecoil.functions.length > 0 ? false : true,
          collapsedShowTitle: false,
          autoClose: false,
        }}
        route={appRoute(userRecoil.functions)}
        {...settings}
      >
        <Header collapsed={collapsed} setCollapsed={handleCollapsed} />
        <div className="container">
          <Outlet />
        </div>
        {children}

        <Settings />
      </ProLayout>
    </ConfigProvider>
  );
}
