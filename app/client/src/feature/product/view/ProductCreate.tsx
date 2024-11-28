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
import { productCreateSchema } from "../model/product_type";
import { useProductHook } from "./ProductHook";

export function ProductCreate() {
  const { auth, productController } = useContext(Dependency)!;
  const product = useProductHook(productController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (
      product.state.action == "create" &&
      product.state.status == "complete"
    ) {
      if (product.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Produk berhasil ditambahkan",
        });

        const target =
          location.state?.from == null
            ? "/app/product?page=1&limit=10&search="
            : location.state.from;

        navigate(target);
      } else {
        notification.error({
          message: "Error",
          description: product.state.error.message,
        });
      }
    }
  }, [product.state]);

  return (
    <>
      <Modal
        centered
        title="Tambah Produk"
        maskClosable={false}
        open={location.pathname.includes("/app/product/create")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/product?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        <Spin spinning={product.state.status == "loading"}>
          <Form
            size="large"
            form={form}
            style={{ paddingTop: "14px" }}
            onFinish={async (values) => {
              await productCreateSchema
                .validate(values, { strict: true, abortEarly: false })
                .then(() => {
                  product.create(values, { token: auth.state.data! });
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
              <Form.Item noStyle name="code">
                <Input type="text" placeholder="Kode produk" />
              </Form.Item>
              <Form.Item noStyle name="name">
                <Input type="text" placeholder="Nama produk" />
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={product.state.status == "loading"}
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
