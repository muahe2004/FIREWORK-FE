import { CloseCircleFilled, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalProps,
  Select,
  SelectProps,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
  Typography,
} from "antd";
import { t } from "i18next";

export const ModalRender = (props: ModalProps) => {
  return (
    <Modal
      style={{ top: 63 }}
      closable={false}
      okText={t("all.btn_save")}
      cancelText={t("all.btn_cancel")}
      className="modal"
      okButtonProps={{
        className: "btn btn-primary",
      }}
      cancelButtonProps={{
        className: "btn btn-default",
      }}
      footer={(child) => {
        const isCenter = props.className?.includes("modal-center");
        return (
          <Flex
            justify={isCenter ? "center" : "flex-end"}
            align="center"
            gap={8}
          >
            {child}
          </Flex>
        );
      }}
      destroyOnClose
      maskClosable={false}
      {...props}
      title={undefined}
    >
      <Flex justify="space-between" className="modal-title-wrap">
        <Typography.Title level={4}>{props.title}</Typography.Title>

        <CloseCircleFilled onClick={props.onCancel} />
      </Flex>
      <div className="modal-body">{props.children}</div>
    </Modal>
  );
};

export const TableRender = (props: TableProps<any>) => {
  return (
    <Table
      bordered
      size="small"
      {...props}
      scroll={{ x: props.scroll?.x || 1100, y: props.scroll?.y }}
      pagination={{
        size: "small",
        ...props.pagination,
      }}
    />
  );
};

export const SelectRender = (props: SelectProps) => {
  return (
    <Select
      showSearch
      filterOption={(input, option) =>
        (option?.label?.toString()?.toLowerCase() ?? "").includes(
          input?.toLowerCase(),
        )
      }
      style={{ width: "100%" }}
      {...props}
      placeholder={props.placeholder || t("all.btn_selected")}
    />
  );
};

// TODO: move to utils and improve type and custom color
export const tagRender = (props: any) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={"#0CA3DF"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3, paddingTop: 2, paddingBottom: 2 }}
    >
      {label}
    </Tag>
  );
};

export const getColumnSearchProps = (
  dataIndex: string | string[],
  searchInput: any,
  placeholder?: string,
): TableColumnType<any> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={placeholder}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Tìm
        </Button>
        <Button
          onClick={() => clearFilters && clearFilters()}
          size="small"
          style={{ width: 90 }}
        >
          Đặt lại
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            close();
          }}
        >
          Đóng
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    typeof dataIndex === "string"
      ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
      : dataIndex
          .map((i: any) => record[i])
          ?.join(" ")
          ?.toLowerCase()
          .includes((value as string).toLowerCase()),
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  render: (text) => text,
});
