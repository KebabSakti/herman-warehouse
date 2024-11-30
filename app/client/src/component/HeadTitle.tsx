import { LeftOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";

type HeadTitleProps = {
  title: string;
  onClick?: () => void | null | undefined;
};

export function HeadTitle(props: HeadTitleProps) {
  const { Title } = Typography;

  return (
    <Flex gap="small">
      {props.onClick == null ? (
        <></>
      ) : (
        <Button shape="circle" onClick={props.onClick}>
          <LeftOutlined />
        </Button>
      )}
      <Title level={4}>{props.title}</Title>
    </Flex>
  );
}
