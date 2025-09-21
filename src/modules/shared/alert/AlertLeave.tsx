import { Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useBlocker } from "react-router-dom";

import { ModalRender } from "@/constant/antd";

export function AlertLeave({ isBlocking }: { isBlocking: boolean }) {
  const { t } = useTranslation();
  let blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const toCoDetail = nextLocation.pathname.replace(
      /^\/co-management\/co-document\/[^\/]+\d$/g,
      "",
    );

    if (toCoDetail === "") return false;
    return isBlocking && currentLocation.pathname !== nextLocation.pathname;
  });

  useEffect(() => {
    return () => blocker?.reset?.();
  }, []);

  return (
    <ModalRender
      open={blocker.state === "blocked"}
      onOk={() => blocker?.proceed?.()}
      onCancel={() => blocker?.reset?.()}
      title="Cảnh báo"
      okText={t("all.btn_confirm")}
      className="modal modal-center"
    >
      <Typography.Paragraph style={{ textAlign: "center" }} strong>
        Bạn chưa lưu thông tin được thay đổi.
      </Typography.Paragraph>
      <Typography.Text style={{ textAlign: "center", display: "block" }} strong>
        Bạn có chắc chắn muốn{" "}
        <Typography.Text type="danger">thoát khỏi</Typography.Text> trang này ?
      </Typography.Text>
    </ModalRender>
  );
}
