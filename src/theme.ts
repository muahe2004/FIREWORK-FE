import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    fontFamily: "SF Pro Display, Roboto, sans-serif",
    fontSize: 12,
    colorPrimary: "#07527e",
    colorText: "#2C3030",
    colorSuccess: "#53c31b",
    colorInfo: "#3fa9ff",
    colorWarning: "#ffbf69",
    colorError: "#ff4d4f",
    colorTextHeading: "#444A4B",
  },
  components: {
    Table: {
      headerBg: "#DFE2E2",
      rowSelectedBg: "#ecfcfe",
      rowSelectedHoverBg: "#d1f6fb",
      bodySortBg: "#ecfcfe",
      headerSortActiveBg: "#ecfcfe",
      headerSortHoverBg: "#ecfcfe",
    },
    Select: {
      // optionSelectedColor: "#fff",
      optionSelectedBg: "#ecfcfe",
    },
    Tree: {
      // nodeSelectedBg: "#ecfcfe",
    },
  },
};
