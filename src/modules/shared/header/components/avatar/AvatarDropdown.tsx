import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, Space, Spin, Typography } from "antd";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";

import avatarDefault from "@/assets/svg/avatar_default.svg";
import { LOCAL_USER } from "@/constant/config";
import { UserState } from "@/store/auth/atom";
import { LOGIN_URL } from "@/urls";
import storage, { clearLogout, storageService } from "@/utils/storage";

import ChangePassword from "./ChangePassword";
import Profile from "./Profile";

export type GlobalHeaderRightProps = {
  menu?: boolean;
  // children?: React.ReactNode;
};

export const AvatarName = () => {
  const userRecoil = useRecoilValue(UserState);
  return (
    <Space>
      <Avatar src={userRecoil.avatar || avatarDefault} />
      <div>
        <Typography.Text strong>
          {userRecoil?.full_name || userRecoil?.user_name}
        </Typography.Text>
        <div>
          <Typography.Text>{userRecoil.position_name}</Typography.Text>
        </div>
      </div>
    </Space>
  );
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  menu,
  // children,
}) => {
  const navigate = useNavigate();
  const [userRecoil, setUserProfile] = useRecoilState(UserState);
  const resetUserProfile = useResetRecoilState(UserState);

  useEffect(() => {
    (async () => {
      const userLocal = storageService.getStorage(LOCAL_USER);
      if (!userLocal.user_id) {
        resetUserProfile();
        clearLogout();
        return;
      }
      // const user = await authorization();
      setUserProfile(userLocal);
    })();
  }, []);

  const logOut = async () => {
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get("redirect");
    if (window.location.pathname !== LOGIN_URL && !redirect) {
      storage.clearToken();
      storageService.resetStorage();
      navigate(LOGIN_URL, {
        preventScrollReset: true,
      });
    }
  };

  const onMenuClick = useCallback((event: any) => {
    const { key } = event;
    switch (key) {
      case "logout":
        logOut();
        break;
    }
  }, []);

  const loading = (
    <span className={"actionClassName"}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!userRecoil.user_id) {
    return loading;
  }

  if (!userRecoil.user_id || !userRecoil.user_id) {
    return loading;
  }

  const menuItems: MenuProps["items"] = [
    ...(menu
      ? [
          {
            key: "profile",
            label: <Profile />,
          },
          {
            key: "pass",
            label: <ChangePassword />,
          },
          {
            type: "divider" as const,
          },
        ]
      : []),
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
    },
  ];

  return (
    <Dropdown
      menu={{
        onClick: onMenuClick,
        items: menuItems,
      }}
      trigger={["click"]}
    >
      <a onClick={(e) => e.preventDefault()}>
        <AvatarName />
      </a>
    </Dropdown>
  );
};
