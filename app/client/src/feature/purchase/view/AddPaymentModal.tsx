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
import { number, object, string } from "yup";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { PurchaseCreateProps } from "./PurchaseCreate";

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
              .validate(values, { strict: true })
              .then(() => {
                props.hook.setPayment({
                  id: randomID(),
                  purchaseId: props.hook.state.id,
                  amount: values.total,
                  note: values.name,
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
