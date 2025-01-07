import { useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Dependency } from "../../../component/App";
import {
  Button,
  Flex,
  Input,
  Modal,
  notification,
  Spin,
  Form,
  Typography,
} from "antd";
import { useSupplierHook } from "./SupplierHook";
import { Supplier } from "../model/supplier_model";
import { supplierUpdateSchema } from "../model/supplier_type";

export function SupplierEdit() {
  const { auth, supplierController } = useContext(Dependency)!;
  const param = useParams();
  const supplier = useSupplierHook(supplierController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (supplier.state.action == "idle" && supplier.state.status == "idle") {
      supplier.read(param.id!, { token: auth.state.data! });
    }

    if (
      supplier.state.action == "update" &&
      supplier.state.status == "complete"
    ) {
      if (supplier.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Data berhasil di update",
        });

        const target =
          location.state?.from == null
            ? "/app/supplier?page=1&limit=10&search="
            : location.state.from;

        navigate(target);
      } else {
        notification.error({
          message: "Error",
          description: supplier.state.error.message,
        });
      }
    }
  }, [supplier.state]);

  return (
    <>
      <Modal
        centered
        loading={supplier.state.data == null}
        title="Edit Supplier"
        maskClosable={false}
        open={location.pathname.includes("/app/supplier/edit")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/supplier?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (supplier.state.data != null) {
            const supplierEdit = supplier.state.data as Supplier;

            return (
              <>
                <Spin spinning={supplier.state.status == "loading"}>
                  <Form
                    size="large"
                    form={form}
                    style={{ paddingTop: "14px" }}
                    initialValues={{
                      name: supplierEdit.name,
                      phone: supplierEdit.phone,
                      address: supplierEdit.address,
                    }}
                    onFinish={async (values) => {
                      const payload = { id: param.id, ...values };

                      await supplierUpdateSchema
                        .validate(payload, { strict: true, abortEarly: false })
                        .then(() => {
                          supplier.update(param.id!, payload, {
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
                          loading={supplier.state.status == "loading"}
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
