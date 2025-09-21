import { CaretUpOutlined } from "@ant-design/icons";
import BackTop from "@uiw/react-back-top";
import { FloatButton } from "antd";

export default function Settings(): JSX.Element {
  return (
    <>
      <BackTop
        speed={10}
        content={<FloatButton icon={<CaretUpOutlined />} />}
      />
    </>
  );
}
