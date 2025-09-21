import { Button, Table, TableColumnProps, Tooltip, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { EditIcon } from "@/assets/svg";
import { ModalRender, TableRender } from "@/constant/antd";
import { queryClient } from "@/lib/react-query";
import { useGetRoleUserDetail, useSearchRoles } from "@/loader/role.loader";
import { useCreateUserRole } from "@/loader/user-role.loader";
import { CACHE_USER } from "@/loader/user.loader";
import { UserState } from "@/store/auth/atom";
import { IRole } from "@/types/role";
import { IUser } from "@/types/user";
import { filterNot } from "@/utils/array";
import { useDisclosure } from "@/utils/modal";

interface Props {
  user: IUser;
}

export default function UserRoleModal({ user }: Props): JSX.Element {
  const { t } = useTranslation();
  const { open, close, isOpen } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const userRecoil = useRecoilValue(UserState);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();

  const rolesQuery = useSearchRoles({
    params: {
      pageIndex: page,
      pageSize,
      user_id: userRecoil.user_id,
    },
    config: {
      enabled: isOpen,
    },
  });

  const createUserRole = useCreateUserRole({
    config: {
      onSuccess: (data) => {
        if (!data.success && data.message) {
          notification.error({
            message: data.message,
          });
          return;
        }
        notification.success({
          message: data.message,
        });
        handleCancel();
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(CACHE_USER.SEARCH);
      },
    },
  });

  const { remove: removeGetDetail } = useGetRoleUserDetail({
    id: user.user_id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        if (data && data?.length)
          setSelectedRowKeys(data?.map((i: any) => i.role_id));
      },
    },
  });

  const handleSubmit = () => {
    const dataPost = {
      user_role_list: [
        ...(selectedRowKeys?.map((i: any) => ({
          user_role_id: "",
          role_id: i,
          user_id: user.user_id,
          active_flag: 1,
        })) || []),
        ...filterNot(rolesQuery.data?.data, selectedRowKeys, "role_id").map(
          (i) => ({
            user_role_id: "",
            role_id: i.role_id,
            user_id: user.user_id,
            active_flag: 0,
          }),
        ),
      ],
      created_by_user_id: userRecoil.user_id,
    };

    createUserRole.mutate(dataPost);
  };

  const columns: TableColumnProps<IRole>[] = [
    {
      title: t("user.fields.serial"),
      align: "center",
      width: 50,
      render: (_, __, index) => index + 1 + +pageSize * (+page - 1),
    },
    {
      title: t("user.fields.role_code"),
      dataIndex: "role_code",
      width: 200,
    },
    {
      title: t("user.fields.role_name"),
      dataIndex: "role_name",
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleCancel = () => {
    removeGetDetail();
    setSelectedRowKeys([]);
    close();
  };

  return (
    <>
      <Tooltip title={t("user.title_role")}>
        <Button
          className="center"
          icon={<EditIcon />}
          type="text"
          onClick={open}
        />
      </Tooltip>

      <ModalRender
        title={t("user.title_role")}
        open={isOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={"50vw"}
        confirmLoading={createUserRole.isLoading}
      >
        <TableRender
          rowSelection={{
            type: "radio",
            selectedRowKeys: selectedRowKeys || [],
            onChange: onSelectChange,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
          }}
          columns={columns}
          dataSource={rolesQuery.data?.data}
          scroll={{ x: 1 }}
          pagination={{
            total: rolesQuery.data?.totalItems,
            current: page,
            pageSize,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          rowKey={"role_id"}
        />
      </ModalRender>
    </>
  );
}
