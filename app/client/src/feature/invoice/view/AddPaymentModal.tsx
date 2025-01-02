import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Typography,
  Upload,
} from "antd";
import { mixed, number, object } from "yup";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { InvoiceCreateProps } from "./InvoiceCreate";
import { UploadOutlined } from "@ant-design/icons";

export function AddPaymentModal(props: InvoiceCreateProps) {
  const active = props.modal == "dp";
  const { Text } = Typography;
  const [form] = Form.useForm();
  const itemTotal = props.hook.state.item.reduce((a, b) => a + b.total, 0);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        title="Tambahkan DP"
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
            console.log(values);

            const FILE_SIZE = 2 * 1024 * 1024; // 2 MB
            const SUPPORTED_FORMATS = [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "application/pdf",
            ];

            const schema = object({
              amount: number().required("Total tidak boleh kosong"),
              attachment: mixed()
                .nullable()
                .notRequired()
                .test(
                  "fileSize",
                  "Maksimal ukuran file < 2MB",
                  (value: any) => {
                    return !value || value.size <= FILE_SIZE;
                  }
                )
                .test(
                  "fileFormat",
                  "Format file tidak didukung",
                  (value: any) => {
                    return !value || SUPPORTED_FORMATS.includes(value.type);
                  }
                ),
            });

            await schema
              .validate(values, { strict: true, abortEarly: false })
              .then(() => {
                const outstanding = itemTotal - values;

                props.hook.changeInstallment({
                  id: randomID(),
                  invoiceId: props.hook.state.id,
                  amount: values.amount,
                  note: values.note,
                  outstanding: outstanding,
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
            <Form.Item noStyle name="amount">
              <InputNumber
                placeholder="Total"
                min={0}
                max={itemTotal}
                style={{ display: "block", width: "100%" }}
                formatter={(value) => {
                  const formatted = Num.format(value ?? 0);
                  return formatted;
                }}
              />
            </Form.Item>
            <Form.Item
              noStyle
              name="attachment"
              getValueFromEvent={(e) => {
                return e.file;
              }}
            >
              <Upload name="file" maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>
                  Lampirkan bukti setoran
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item noStyle name="note">
              <Input.TextArea placeholder="Catatan" />
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
