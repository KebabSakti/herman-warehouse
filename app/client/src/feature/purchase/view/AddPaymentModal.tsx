import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Typography,
} from "antd";
import { PurchaseCreateProps } from "./PurchaseCreateOther";
import { productCreateSchema } from "../../product/model/product_type";
import { number, object, string } from "yup";
import { randomID } from "../../../helper/util";
import { ReceiptTableTag } from "./ReceiptTableHook";
import { Num } from "../../../helper/num";

export function AddPaymentModal(props: PurchaseCreateProps) {
  const active = props.modal == "payment";
  const { Text } = Typography;
  const [form] = Form.useForm();

  return (
    <>
      <Modal
        centered
        destroyOnClose
        title="Tambah biaya Lain"
        maskClosable={false}
        open={active}
        footer={null}
        onCancel={() => {
          props.setModal("");
        }}
      >
        <Form
          size="large"
          form={form}
          style={{ paddingTop: "14px" }}
          onFinish={async (values) => {
            const schema = object({
              name: string().required("Jenis biaya tidak boleh kosong"),
              total: number().required("Nilai tidak boleh kosong"),
            });

            await schema
              .validate(values, { strict: true, abortEarly: false })
              .then(() => {
                props.hook.addItem({
                  key: randomID(),
                  id: randomID(),
                  tag: ReceiptTableTag.Payment,
                  ...values,
                });

                form.resetFields();
                props.setModal("");
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
              <Input type="text" placeholder="Jenis biaya" />
            </Form.Item>
            <Form.Item noStyle name="total">
              <InputNumber
                placeholder="Nilai"
                min={0}
                style={{ display: "block", width: "100%" }}
                formatter={(value) => {
                  const formatted = Num.format(value ?? 0);
                  return formatted;
                }}
              />
            </Form.Item>
            <Form.Item noStyle>
              <Button htmlType="submit" type="primary" size="large">
                Submit
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}
