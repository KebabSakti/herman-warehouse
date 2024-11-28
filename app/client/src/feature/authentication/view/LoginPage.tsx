import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  notification,
  Row,
  Spin,
} from "antd";
import Title from "antd/es/typography/Title";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../asset/logo.png";
import { Dependency } from "../../../component/App";
import { userLoginSchema } from "../model/auth_type";

export function LoginPage() {
  const { auth } = useContext(Dependency)!;
  const navigate = useNavigate();
  const loading = auth.state.status == "loading";
  const [messageApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (auth.state.action == "login" && auth.state.data != null) {
      navigate("/app");
    }

    if (auth.state.error != null) {
      messageApi.error({
        message: "Login gagal",
        description: auth.state.error.message,
      });
    }
  }, [auth.state]);

  return (
    <>
      {contextHolder}
      <Row
        justify="center"
        align="middle"
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Col xs={20} md={8} xl={6}>
          <Spin
            spinning={loading}
            tip="Loading.."
            size="large"
            indicator={<LoadingOutlined spin />}
          >
            <Card>
              <Flex
                vertical
                align="center"
                style={{ margin: "0px 0px 14px 0px" }}
              >
                <img src={logo} style={{ width: "50%" }} />
                <Title level={4}>Login to continue</Title>
              </Flex>
              <Form
                layout="vertical"
                onFinish={async (values) => {
                  await userLoginSchema
                    .validate(values, { strict: true })
                    .then(async () => {
                      await auth.login(values);
                    })
                    .catch(() => {
                      messageApi.error({
                        message: "Login gagal",
                        description:
                          "Cek kembali username dan password yang anda masukkan",
                      });
                    });
                }}
              >
                <Flex vertical gap="small">
                  <Form.Item noStyle name="uid">
                    <Input type="text" placeholder="Username" size="large" />
                  </Form.Item>
                  <Form.Item noStyle name="password">
                    <Input
                      type="password"
                      placeholder="Password"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item noStyle>
                    <Button
                      htmlType="submit"
                      type="primary"
                      size="large"
                      loading={loading}
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
              <div style={{ textAlign: "center", marginTop: "14px" }}>
                <Link to="">Lupa password? Klik untuk reset</Link>
              </div>
            </Card>
          </Spin>
        </Col>
      </Row>
    </>
  );
}
