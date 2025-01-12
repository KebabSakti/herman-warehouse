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
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { Expense } from "../model/expense_model";
import { writeExpenseSchema } from "../model/expense_type";
import { useExpenseHook } from "./ExpenseHook";

export function ExpenseEdit() {
  const { auth, expenseController } = useContext(Dependency)!;
  const param = useParams();
  const expense = useExpenseHook(expenseController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (expense.state.action == "idle" && expense.state.status == "idle") {
      expense.read(param.id!, { token: auth.state.data! });
    }

    if (
      expense.state.action == "update" &&
      expense.state.status == "complete"
    ) {
      if (expense.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Data berhasil di update",
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
        loading={expense.state.data == null}
        title="Edit Expense"
        maskClosable={false}
        open={location.pathname.includes("/app/expense/edit")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/expense?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (expense.state.data != null) {
            const expenseData = expense.state.data as Expense;

            return (
              <>
                <Spin spinning={expense.state.status == "loading"}>
                  <Form
                    size="large"
                    form={form}
                    style={{ paddingTop: "14px" }}
                    initialValues={{
                      ...expenseData,
                      printed: dayjs(expenseData.printed),
                    }}
                    onFinish={async (values) => {
                      const payload = {
                        ...values,
                        id: expenseData.id,
                        printed: values.printed.format("YYYY-MM-DD"),
                      };

                      await writeExpenseSchema
                        .validate(payload)
                        .then(() => {
                          expense.update(expenseData.id, payload, {
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
                        <Upload
                          name="file"
                          maxCount={1}
                          beforeUpload={() => false}
                        >
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
              </>
            );
          }
        })()}
      </Modal>
    </>
  );
}
