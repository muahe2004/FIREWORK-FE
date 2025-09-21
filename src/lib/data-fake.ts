import { DefaultOptionType } from "antd/es/select";
import { t } from "i18next";

export const defaultGenderOptions: DefaultOptionType[] = [
  {
    label: t("all.man"),
    value: 1,
  },
  {
    label: t("all.woman"),
    value: 0,
  },
];
