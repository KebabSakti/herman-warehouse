import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  notification,
  Spin,
  Typography,
} from "antd";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { randomID } from "../../../helper/util";
import { customerCreateSchema } from "../model/customer_type";
import { useCustomerHook } from "./CustomerHook";

export function CustomerCreate() {
  const { auth, customerController } = useContext(Dependency)!;
  const customer = useCustomerHook(customerController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (
      customer.state.action == "create" &&
      customer.state.status == "complete"
    ) {
      if (customer.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Data berhasil ditambahkan",
        });

        const target =
          location.state?.from == null
            ? "/app/customer?page=1&limit=10&search="
            : location.state.from;

        navigate(target);
      } else {
        notification.error({
          message: "Error",
          description: customer.state.error.message,
        });
      }
    }
  }, [customer.state]);

  return (
    <>
      <Modal
        centered
        title="Tambah Data"
        maskClosable={false}
        open={location.pathname.includes("/app/customer/create")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/customer?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        <Spin spinning={customer.state.status == "loading"}>
          <Form
            size="large"
            form={form}
            style={{ paddingTop: "14px" }}
            onFinish={async (values) => {
              const payload = { id: randomID(), ...values };

              await customerCreateSchema
                .validate(payload, { strict: true, abortEarly: false })
                .then(() => {
                  customer.create(payload, { token: auth.state.data! });
                })
                .catch((e) => {
                  notification.error({
                    message: "Error",
                    description: (
                      <Flex vertical gap={1}>
                        {e.errors.map((e: any, i: any) => {
                          return (
                            <Text key={i} type="danger">
                              {e}
                            </Text>
                          );
                        })}
                      </Flex>
                    ),
                  });
                });
            }}
          >
            <Flex vertical gap="middle">
              <Form.Item noStyle name="name">
                <Input type="text" placeholder="Nama" />
              </Form.Item>
              <Form.Item noStyle name="phone">
                <Input type="text" placeholder="Telp" />
              </Form.Item>
              <Form.Item noStyle name="address">
                <Input.TextArea placeholder="Alamat" />
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={customer.state.status == "loading"}
                >
                  Submit
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
