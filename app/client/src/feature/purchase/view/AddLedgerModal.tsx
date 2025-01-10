import { UploadOutlined } from "@ant-design/icons";
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
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { ledgerCreateSchema } from "../../ledger/model/ledger_type";
import { PurchaseCreateProps } from "./PurchaseCreate";

export function AddLedgerModal(props: PurchaseCreateProps) {
  const active = props.modal == "dp";
  const { Text } = Typography;
  const [form] = Form.useForm();

  return (
    <>
      <Modal
        centered
        destroyOnClose
        title="Tambah Panjar (DP)"
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
            const payload = {
              id: randomID(),
              purchaseId: props.hook.state.id,
              supplierId: props.hook.state.supplierId,
              amount: values.amount,
              outstanding: props.hook.state.total - values.amount,
              file: values.file,
              note: values.note,
            };

            await ledgerCreateSchema
              .validate(payload, { strict: true })
              .then(() => {
                props.hook.setLedger(payload);
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
                placeholder="Jumlah"
                min={0}
                style={{ display: "block", width: "100%" }}
                formatter={(value) => {
                  const formatted = Num.format(value ?? 0);
                  return formatted;
                }}
              />
            </Form.Item>
            <Form.Item noStyle name="note">
              <Input.TextArea placeholder="Catatan" />
            </Form.Item>
            <Form.Item
              noStyle
              name="file"
              valuePropName="file"
              getValueFromEvent={(e) => {
                return e.file;
              }}
            >
              <Upload name="file" maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />} size="large">
                  Upload Lampiran
                </Button>
              </Upload>
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
