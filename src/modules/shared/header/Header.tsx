import { HomeOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Breadcrumb, Flex } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";

import { MenuHideIcon, MenuShowIcon } from "@/assets/svg";
import { HOME_URL } from "@/urls";

import { AvatarDropdown } from "./components/avatar/AvatarDropdown";
import styles from "./scss/header.module.scss";

interface IProps {
  collapsed: boolean;
  setCollapsed: (status: boolean) => void;
}

export default function Header({
  collapsed,
  setCollapsed,
}: IProps): JSX.Element {
  return (
    <>
      <PageContainer
        className={styles.header}
        style={{ height: 64 }}
        breadcrumb={undefined}
        fixedHeader
        content={
          <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
            <Flex>
              <div
                className={styles.iconMenu}
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? <MenuHideIcon /> : <MenuShowIcon />}
              </div>
            </Flex>
            <Flex align="center" gap={16}>
              <AvatarDropdown menu />
            </Flex>
          </Flex>
        }
      ></PageContainer>
      <PageContainer
        className={styles.breadcrumb}
        breadcrumbRender={(props: any) => {
          return (
            <Breadcrumb
              items={[
                {
                  href: HOME_URL,
                  title: <HomeOutlined />,
                },
                ...(props.breadcrumb?.items?.map((item: any, index: number) => {
                  const data: BreadcrumbItemType = {
                    title: item?.title?.props?.children,
                  };

                  if (index < props.breadcrumb?.items?.length - 1)
                    data.href = item?.linkPath;

                  return data;
                }) || []),
              ]}
            />
          );
        }}
      ></PageContainer>
    </>
  );
}
