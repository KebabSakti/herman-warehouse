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
import { supplierCreateSchema } from "../model/supplier_type";
import { useSupplierHook } from "./SupplierHook";
import { randomID } from "../../../helper/util";

export function SupplierCreate() {
  const { auth, supplierController } = useContext(Dependency)!;
  const supplier = useSupplierHook(supplierController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (
      supplier.state.action == "create" &&
      supplier.state.status == "complete"
    ) {
      if (supplier.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Data berhasil ditambahkan",
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
        title="Tambah Supplier"
        maskClosable={false}
        open={location.pathname.includes("/app/supplier/create")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/supplier?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        <Spin spinning={supplier.state.status == "loading"}>
          <Form
            size="large"
            form={form}
            style={{ paddingTop: "14px" }}
            onFinish={async (values) => {
              const payload = { id: randomID(), ...values };

              await supplierCreateSchema
                .validate(payload, { strict: true, abortEarly: false })
                .then(() => {
                  supplier.create(payload, { token: auth.state.data! });
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
      </Modal>
    </>
  );
}
