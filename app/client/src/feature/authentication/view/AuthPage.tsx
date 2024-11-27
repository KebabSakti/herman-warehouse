import { Col, Row } from "antd";

export function AuthPage() {
  return (
    <>
      <div style={{ padding: "14px" }}>
        <Row gutter={[8, 8]}>
          <Col
            span={12}
            style={{
              backgroundColor: "aqua",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            1
          </Col>
          <Col
            span={12}
            style={{
              backgroundColor: "aqua",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            2
          </Col>
          <Col
            span={12}
            style={{
              backgroundColor: "aqua",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </Col>
          <Col
            span={12}
            style={{
              backgroundColor: "aqua",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            4
          </Col>
        </Row>
      </div>

      {/* <div
        style={{
          height: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Row>
          <Col sm={24} lg={24}>
            <Card>
              <Form>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your Username!" },
                  ]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your Username!" },
                  ]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div> */}
    </>
  );
}
