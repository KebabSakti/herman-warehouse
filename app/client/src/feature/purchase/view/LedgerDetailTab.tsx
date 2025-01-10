import {
  CloseCircleFilled,
  PrinterFilled,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Spin,
  Table,
  Typography,
  Upload,
  UploadFile,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SERVER } from "../../../common/common";
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { Installment } from "../../installment/model/installment_model";
import { installmentCreateSchema } from "../../installment/model/installment_types";
import { useInstallmentHook } from "../../installment/view/InstallmentHook";
import { Purchase } from "../model/purchase_model";

export function LedgerDetailTab({ purchase }: { purchase: Purchase }) {
  const { auth, installmentController } = useContext(Dependency)!;
  const installment = useInstallmentHook(installmentController);
  const result = installment.state.data as Result<Installment[]> | null;
  const invoiceId = invoice.id;
  const [form] = Form.useForm();
  const { Text, Title } = Typography;
  const [attachment, setAttachment] = useState<UploadFile<File> | null>();
  const [search, setSearch] = useSearchParams();
  const initParam = {
    page: "1",
    limit: "10",
  };
  const param: any =
    search.size == 0 ? initParam : Object.fromEntries(search.entries());

  useEffect(() => {
    setSearch(param);
  }, []);

  useEffect(() => {
    if (search.size >= 2 && invoiceId) {
      installment.list(invoiceId, param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (
      installment.state.status == "complete" &&
      installment.state.error != null
    ) {
      notification.error({
        message: "Error",
        description: installment.state.error.message,
      });
    }

    if (
      installment.state.action == "create" &&
      installment.state.status == "complete" &&
      installment.state.error == null &&
      invoiceId
    ) {
      form.resetFields();
      installment.list(invoiceId, param, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Proses berhasil",
      });
    }
  }, [installment.state]);

  return (
    <>
      <Spin spinning={installment.state.status == "loading"}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Row justify="space-between">
                <Col>Kode</Col>
                <Col>{invoice.code}</Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between">
                <Col>Tanggal</Col>
                <Col>{dayjs(invoice.printed).format("DD-MM-YYYY")}</Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between">
                <Col>Kustomer</Col>
                <Col>{invoice.customerName}</Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between">
                <Col>No. Hp</Col>
                <Col>{invoice.customerPhone}</Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between">
                <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Total
                </Col>
                <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Rp {invoice.totalItem}
                </Col>
              </Row>
            </Col>
          </Row>
          <Space direction="vertical" style={{ width: "100%" }}>
            {(() => {
              if (result?.data) {
                const datas = result.data;
                const paid = datas.length > 0 && datas[0].outstanding == 0;

                return (
                  <>
                    <Table
                      bordered
                      size="small"
                      loading={false}
                      style={{ overflowX: "scroll" }}
                      pagination={false}
                      dataSource={datas.map((e, i) => {
                        return { key: i, ...e };
                      })}
                      columns={[
                        {
                          title: "No",
                          dataIndex: "key",
                          render: (value) => <>{value + 1}</>,
                        },
                        {
                          title: "Tanggal",
                          dataIndex: "printed",
                          render: (value) => (
                            <>{dayjs(value).format("DD-MM-YYYY")}</>
                          ),
                        },
                        {
                          title: "Lampiran",
                          dataIndex: "attachment",
                          render: (value) => (
                            <>
                              {value == undefined ? (
                                "-"
                              ) : (
                                <Button
                                  color="primary"
                                  variant="link"
                                  size="small"
                                  href={`${SERVER}/${value}`}
                                  target="_blank"
                                  onClick={() => {
                                    //
                                  }}
                                >
                                  [Lampiran]
                                </Button>
                              )}
                            </>
                          ),
                        },
                        {
                          title: "Catatan",
                          dataIndex: "note",
                          render: (value) => <>{value ?? "-"}</>,
                        },
                        {
                          title: "Setor",
                          dataIndex: "amount",
                          render: (value) => <>{Num.format(value)}</>,
                        },
                        {
                          title: "Sisa Piutang",
                          dataIndex: "outstanding",
                          render: (value) => <>{Num.format(value)}</>,
                        },
                      ]}
                    />
                    {paid ? (
                      <div
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <Title level={1} type="success">
                          LUNAS
                        </Title>
                      </div>
                    ) : (
                      <Form
                        size="large"
                        form={form}
                        onFinish={async (values) => {
                          const printed = !values.printed
                            ? undefined
                            : dayjs(values.printed).format("YYYY-MM-DD");
                          const amount = values.amount ?? 0;
                          const updatedOutstanding =
                            invoice.outstanding - amount;

                          const payload = {
                            ...values,
                            id: randomID(),
                            customerId: invoice.customerId,
                            invoiceId: invoiceId,
                            outstanding: updatedOutstanding,
                            printed: printed,
                          };

                          await installmentCreateSchema
                            .validate(payload)
                            .then(() => {
                              installment.create(payload, {
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
                        <Flex gap="small">
                          <Form.Item noStyle name="printed">
                            <DatePicker
                              placeholder="Tanggal"
                              style={{ display: "block", width: "100%" }}
                            />
                          </Form.Item>
                          <Form.Item noStyle name="amount">
                            <InputNumber
                              placeholder="Jumlah"
                              min={1}
                              max={invoice.outstanding}
                              style={{ display: "block", width: "100%" }}
                              formatter={(value) => {
                                const formatted = Num.format(value ?? 0);
                                return formatted;
                              }}
                            />
                          </Form.Item>
                          <Form.Item noStyle name="note">
                            <Input placeholder="Catatan" />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            name="attachment"
                            valuePropName="attachment"
                            getValueFromEvent={(e) => {
                              return e.file;
                            }}
                          >
                            {attachment ? (
                              <Button
                                icon={<CloseCircleFilled />}
                                iconPosition="end"
                                onClick={() => {
                                  setAttachment(null);
                                }}
                              >
                                1 File
                              </Button>
                            ) : (
                              <Upload
                                showUploadList={false}
                                name="file"
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={(e) => {
                                  setAttachment(e.file);
                                }}
                              >
                                <Button icon={<UploadOutlined />}>
                                  Lampiran
                                </Button>
                              </Upload>
                            )}
                          </Form.Item>
                          <Form.Item noStyle>
                            <Button
                              htmlType="submit"
                              type="primary"
                              size="large"
                            >
                              Submit
                            </Button>
                          </Form.Item>
                        </Flex>
                      </Form>
                    )}
                  </>
                );
              }

              return <Table bordered pagination={false} dataSource={[]} />;
            })()}
          </Space>
          <Button
            block
            style={{ marginTop: "14px" }}
            icon={<PrinterFilled />}
            color="primary"
            size="large"
            variant="solid"
            target="_blank"
            href={`/print/installment/${invoiceId}`}
          >
            Print
          </Button>
        </Space>
      </Spin>
    </>
  );
}
