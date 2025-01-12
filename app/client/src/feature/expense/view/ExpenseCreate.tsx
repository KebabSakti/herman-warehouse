import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Spin,
  Typography,
  Upload,
} from "antd";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { writeExpenseSchema } from "../model/expense_type";
import { useExpenseHook } from "./ExpenseHook";

export function ExpenseCreate() {
  const { auth, expenseController } = useContext(Dependency)!;
  const expense = useExpenseHook(expenseController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (
      expense.state.action == "create" &&
      expense.state.status == "complete"
    ) {
      if (expense.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Data berhasil ditambahkan",
        });

        const target =
          location.state?.from == null
            ? "/app/expense?page=1&limit=10&search="
            : location.state.from;

        navigate(target);
      } else {
        notification.error({
          message: "Error",
          description: expense.state.error.message,
        });
      }
    }
  }, [expense.state]);

  return (
    <>
      <Modal
        centered
        title="Tambah Data"
        maskClosable={false}
        open={location.pathname.includes("/app/expense/create")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/expense?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        <Spin spinning={expense.state.status == "loading"}>
          <Form
            size="large"
            form={form}
            style={{ paddingTop: "14px" }}
            onFinish={async (values) => {
              const payload = {
                ...values,
                id: randomID(),
                printed: values.printed.format("YYYY-MM-DD"),
              };

              await writeExpenseSchema
                .validate(payload)
                .then(() => {
                  expense.create(payload, { token: auth.state.data! });
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
              <Form.Item noStyle name="title">
                <Input type="text" placeholder="Nama transaksi" />
              </Form.Item>
              <Form.Item noStyle name="amount">
                <InputNumber
                  placeholder="Jumlah"
                  min={1}
                  style={{ display: "block", width: "100%" }}
                  formatter={(value) => Num.format(value ?? 0)}
                />
              </Form.Item>
              <Form.Item noStyle name="printed">
                <DatePicker
                  size="large"
                  placeholder="Tanggal"
                  style={{ display: "block" }}
                />
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
                    Lampiran
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={expense.state.status == "loading"}
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
