import { useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { useProductHook } from "./ProductHook";
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
import { Product, productUpdateSchema } from "../model/product_type";

export function ProductEdit() {
  const { auth, productController } = useContext(Dependency)!;
  const param = useParams();
  const product = useProductHook(productController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (product.state.action == "idle" && product.state.status == "idle") {
      product.read(param.id!, { token: auth.state.data! });
    }

    if (
      product.state.action == "update" &&
      product.state.status == "complete"
    ) {
      if (product.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Produk berhasil di update",
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
        loading={product.state.data == null}
        title="Edit Produk"
        maskClosable={false}
        open={location.pathname.includes("/app/product/edit")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/product?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (product.state.data != null) {
            const productEdit = product.state.data as Product | null;

            return (
              <>
                <Spin spinning={product.state.status == "loading"}>
                  <Form
                    size="large"
                    form={form}
                    style={{ paddingTop: "14px" }}
                    initialValues={{
                      code: productEdit!.code,
                      name: productEdit!.name,
                    }}
                    onFinish={async (values) => {
                      await productUpdateSchema
                        .validate(values, { strict: true, abortEarly: false })
                        .then(() => {
                          product.update(param.id!, values, {
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
              </>
            );
          }
        })()}
      </Modal>
    </>
  );
}
