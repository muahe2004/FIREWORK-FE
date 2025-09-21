import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Spin,
  Tooltip,
  Typography,
  message,
  notification,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { produce } from "immer";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

import { ModalRender, SelectRender } from "@/constant/antd";
import { ERROR_TIMEOUT, LOCAL_USER } from "@/constant/config";
import { defaultGenderOptions } from "@/lib/data-fake";
import { queryClient } from "@/lib/react-query";
import { useDropdownBranches } from "@/loader/branch.loader";
import { useDropdownDepartments } from "@/loader/department.loader";
import { useDropdownPositions } from "@/loader/position.loader";
import {
  CACHE_USER,
  useCreateUser,
  useGetDetailUser,
  useUpdateUser,
} from "@/loader/user.loader";
import { UserState } from "@/store/auth/atom";
import { ICustomerList, IUser } from "@/types/user";
import { getUpdatedArray } from "@/utils/array";
import {
  formatDateShow,
  generateUsername,
  getDateVi,
} from "@/utils/format-string";
import { useDisclosure } from "@/utils/modal";
import { storageService } from "@/utils/storage";
import { RULES_FORM } from "@/utils/validator";

interface Props {
  user?: IUser;
  isCreate?: boolean;
}

export default function UserModal({
  user,
  isCreate = true,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const { open, close, isOpen } = useDisclosure();
  const [form] = Form.useForm();
  const [userRecoil, setUserRecoil] = useRecoilState(UserState);

  const handleSetCustomers = (customers: ICustomerList[]) => {
    const newUser = produce(userRecoil, (draft) => {
      draft.customers =
        customers?.map((i) => ({
          customer_name: i.customer_name,
          customer_id: i.customer_id,
          tax_code: i.tax_code,
        })) || [];
    });

    setUserRecoil(newUser);
    storageService.setStorage(LOCAL_USER, JSON.stringify(newUser));
  };

  const {
    data: dataEmployees,
    refetch: employeeRefetch,
    isLoading,
  } = useGetDetailUser({
    id: user?.user_id!,
    enabled: isOpen && !isCreate,
    config: {
      async onSuccess(data) {
        if (data.message === ERROR_TIMEOUT) {
          employeeRefetch();
        }

        if (!data?.message) {
          form.setFieldsValue(data);
          const date = dayjs(data?.date_of_birth).isValid()
            ? dayjs(data?.date_of_birth)
            : null;

          form.setFieldValue("date_of_birth", date);
        }
      },
    },
  });

  const updateEmployee = useUpdateUser({
    config: {
      onSuccess: (data, { employee_customer_for_detail, user_id }) => {
        if (!data.success && data.message) {
          notification.error({
            message: data.message,
          });
          return;
        }

        userRecoil.user_id === user_id &&
          handleSetCustomers(employee_customer_for_detail);

        notification.success({
          message: data.message,
        });
        handleCancel();
        queryClient.invalidateQueries([CACHE_USER.SEARCH]);
      },
      onError: (err) => {
        notification.error({ message: err.message });
      },
    },
  });

  const createEmployee = useCreateUser({
    config: {
      onSuccess: (data, { employee_customer_for_detail, user_id }) => {
        if (!data.success && data.message) {
          notification.error({
            message: data.message,
          });
          return;
        }

        userRecoil.user_id === user_id &&
          handleSetCustomers(employee_customer_for_detail);

        notification.success({
          message: data.message,
        });
        handleCancel();
        queryClient.invalidateQueries([CACHE_USER.SEARCH]);
      },
      onError: (err) => {
        notification.error({ message: err.message });
      },
    },
  });

  const dropdownPosition = useDropdownPositions({
    config: { enabled: isOpen },
  });
  const dropdownDepartment = useDropdownDepartments({
    config: { enabled: isOpen },
  });
  const dropdownBranches = useDropdownBranches({ config: { enabled: isOpen } });

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const [first, ...middle] = values.full_name.split(" ");
        const last = middle.splice(middle.length - 1, 1)?.[0] || "";
        const dataPost = {
          ...values,
          date_of_birth: getDateVi(values.date_of_birth),
          list_json_employee_customer: getUpdatedArray(
            dataEmployees?.employee_customer_for_detail || [],
            values?.employee_customer_for_detail || [],
            "customer_id",
          )?.map((i: any) => ({
            ...i,
            employee_id: values?.employee_id,
          })),
          first_name: first,
          last_name: last,
          middle_name: middle.join(" "),
          verify: values.verify ? 1 : 0,
        };

        if (isCreate) {
          dataPost.created_by_user_id = userRecoil.user_id;
          createEmployee.mutate(dataPost);
        } else {
          dataPost.lu_user_id = userRecoil.user_id;
          updateEmployee.mutate(dataPost);
        }
      })
      .catch(() => message.warning(t("messages.validate_form")));
  };

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const handleChangeUsername = (value: string) => {
    if (isCreate) {
      const username = generateUsername(value);
      form.setFieldValue("user_name", username);
    }
  };

  return (
    <>
      {isCreate ? (
        <Button className="btn btn-primary" onClick={handleOpen}>
          {t("all.btn_add")}
        </Button>
      ) : (
        <Tooltip title={t("all.detail")}>
          <Typography.Link onClick={handleOpen}>
            {user?.user_name}
          </Typography.Link>
        </Tooltip>
      )}
      <ModalRender
        open={isOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        title={isCreate ? t("user.title_create") : t("user.title_update")}
        width={"90vw"}
        confirmLoading={updateEmployee.isLoading || createEmployee.isLoading}
      >
        <Spin spinning={isLoading}>
          <div
            style={{
              // maxHeight: "calc(100vh - 214px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Form
              form={form}
              spellCheck={false}
              layout="vertical"
              style={{ marginRight: 5 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Form.Item
                    name={"full_name"}
                    label={t("user.fields.full_name")}
                    rules={[...RULES_FORM.required]}
                  >
                    <Input
                      onChange={(e) => handleChangeUsername(e.target.value)}
                      placeholder={t("user.fields.full_name")}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("user.fields.birthday")}
                    required
                    rules={[...RULES_FORM.required]}
                    name={"date_of_birth"}
                  >
                    <DatePicker
                      // inputReadOnly
                      format={{ format: formatDateShow, type: "mask" }}
                      style={{ width: "100%" }}
                      placeholder={formatDateShow}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("user.fields.username")}
                    name={"user_name"}
                    rules={[...RULES_FORM.required]}
                  >
                    <Input disabled={!isCreate} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("user.fields.password")}
                    name={"password"}
                    rules={[...RULES_FORM.required]}
                    initialValue={"123456"}
                  >
                    <Input.Password
                      // disabled={!isCreate}
                      placeholder={t("user.fields.password")}
                    />
                  </Form.Item>
                </Col>

                <Form.Item name={"user_id"} hidden>
                  <Input />
                </Form.Item>
                <Col span={6}>
                  <Form.Item
                    name={"gender"}
                    label={t("user.fields.gender")}
                    initialValue={0}
                    rules={[...RULES_FORM.required]}
                  >
                    <SelectRender
                      placeholder={t("user.fields.gender")}
                      options={defaultGenderOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={"email"}
                    label={t("user.fields.email")}
                    rules={[...RULES_FORM.required, ...RULES_FORM.email]}
                  >
                    <Input type="email" placeholder={t("user.fields.email")} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={"phone_number"}
                    label={t("user.fields.phone")}
                    rules={[...RULES_FORM.required, ...RULES_FORM.phone]}
                  >
                    <Input placeholder={t("user.fields.phone")} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={"department_id"}
                    label={t("user.fields.department")}
                    rules={[...RULES_FORM.required]}
                  >
                    <SelectRender
                      placeholder={t("user.fields.department")}
                      options={
                        dropdownDepartment.data?.length
                          ? dropdownDepartment.data
                          : []
                      }
                      loading={dropdownDepartment.isLoading}
                    />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    name={"position_id"}
                    label={t("user.fields.position")}
                    rules={[...RULES_FORM.required]}
                  >
                    <SelectRender
                      placeholder={t("user.fields.position")}
                      options={
                        dropdownPosition.data?.length
                          ? dropdownPosition.data
                          : []
                      }
                      loading={dropdownPosition.isLoading}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={"branch_id"}
                    label={t("user.fields.branch")}
                    rules={[...RULES_FORM.required]}
                  >
                    <SelectRender
                      placeholder={t("user.fields.branch")}
                      options={
                        dropdownBranches.data?.length
                          ? dropdownBranches.data
                          : []
                      }
                      loading={dropdownBranches.isLoading}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={"description"}
                    label={t("user.fields.description")}
                  >
                    <Input placeholder={t("user.fields.description")} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Spin>
      </ModalRender>
    </>
  );
}
