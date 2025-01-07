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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { Customer } from "../model/customer_model";
import { customerUpdateSchema } from "../model/customer_type";
import { useCustomerHook } from "./CustomerHook";

export function CustomerEdit() {
  const { auth, customerController } = useContext(Dependency)!;
  const param = useParams();
  const customer = useCustomerHook(customerController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (customer.state.action == "idle" && customer.state.status == "idle") {
      customer.read(param.id!, { token: auth.state.data! });
    }

    if (
      customer.state.action == "update" &&
      customer.state.status == "complete"
    ) {
      if (customer.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Data berhasil di update",
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
        loading={customer.state.data == null}
        title="Edit customer"
        maskClosable={false}
        open={location.pathname.includes("/app/customer/edit")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/customer?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (customer.state.data != null) {
            const customerEdit = customer.state.data as Customer;

            return (
              <>
                <Spin spinning={customer.state.status == "loading"}>
                  <Form
                    size="large"
                    form={form}
                    style={{ paddingTop: "14px" }}
                    initialValues={{
                      name: customerEdit.name,
                      phone: customerEdit.phone,
                      address: customerEdit.address,
                    }}
                    onFinish={async (values) => {
                      const payload = { id: param.id, ...values };

                      await customerUpdateSchema
                        .validate(payload, { strict: true, abortEarly: false })
                        .then(() => {
                          customer.update(param.id!, payload, {
                            token: auth.state.data!,
                          });
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
              </>
            );
          }
        })()}
      </Modal>
    </>
  );
}
