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
  Modal,
  notification,
  Result,
  Row,
  Space,
  Table,
  Tabs,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { SERVER } from "../../../common/common";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { useInstallmentHook } from "../../installment/view/InstallmentHook";
import { Invoice } from "../model/invoice_model";
import { useInvoiceHook } from "./InvoiceHook";
import { randomID } from "../../../helper/util";
import { installmentCreateSchema } from "../../installment/model/installment_types";

export function InvoiceRead() {
  const { auth, invoiceController, isntallmentController } =
    useContext(Dependency)!;
  const invoice = useInvoiceHook(invoiceController);
  const installment = useInstallmentHook(isntallmentController);
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [attachment, setAttachment] = useState<UploadFile | null | undefined>();
  const [activeTab, setActiveTab] = useState<string>("1");

  useEffect(() => {
    if (invoice.state.action == "idle" && invoice.state.status == "idle") {
      invoice.read(param.id!, { token: auth.state.data! });
    }

    if (
      installment.state.action == "idle" &&
      installment.state.status == "idle"
    ) {
      // install.read(param.id!, { token: auth.state.data! });
    }
  }, [invoice.state, installment.state]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        width={800}
        maskClosable={false}
        open={location.pathname.includes("/app/order/read")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/order?page=1&limit=10"
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (invoice.state.error != null) {
            return (
              <Result
                status="error"
                title="Error"
                subTitle="Klik tombol di bawah untuk mengulang, atau coba beberapa saat lagi"
                extra={[
                  <Button
                    type="primary"
                    key="0"
                    onClick={() => {
                      //
                    }}
                  >
                    Coba lagi
                  </Button>,
                ]}
              />
            );
          }

          if (invoice.state.data != null) {
            const data = invoice.state.data as Invoice;
            const totalItem = data.item.reduce((a, b) => a + b.total, 0);

            return (
              <Tabs
                activeKey={activeTab}
                onTabClick={(key) => {
                  setActiveTab(key);
                }}
                items={[
                  {
                    key: "1",
                    label: "Detail Nota",
                    children: (
                      <>
                        <Row gutter={[0, 8]}>
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col>Kode</Col>
                              <Col>{data.code}</Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col>Tanggal</Col>
                              <Col>
                                {dayjs(data.printed).format("DD-MM-YYYY")}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col>Kustomer</Col>
                              <Col>{data.customerName}</Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col>No. Hp</Col>
                              <Col>{data.customerPhone}</Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            <Table
                              bordered
                              size="small"
                              loading={false}
                              style={{ overflowX: "scroll" }}
                              pagination={false}
                              dataSource={data.item.map((e, i) => {
                                return { ...e, key: i };
                              })}
                              columns={[
                                {
                                  title: "Kode",
                                  dataIndex: "productCode",
                                },
                                {
                                  title: "Item",
                                  dataIndex: "productName",
                                },
                                {
                                  title: "Quantity",
                                  dataIndex: "qty",
                                },
                                {
                                  title: "Harga",
                                  dataIndex: "price",
                                },
                                {
                                  title: "Total",
                                  dataIndex: "total",
                                  align: "right",
                                  render: (value) => (
                                    <>{Num.format(value ?? 0)}</>
                                  ),
                                },
                              ]}
                            />
                          </Col>
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col>Total Item</Col>
                              <Col>{Num.format(totalItem)}</Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col>
                                Setor
                                {data.installment?.[0]?.attachment ==
                                undefined ? (
                                  ""
                                ) : (
                                  <Button
                                    color="primary"
                                    variant="link"
                                    size="small"
                                    href={`${SERVER}/${data.installment?.[0]?.attachment}`}
                                    target="_blank"
                                    onClick={() => {
                                      //
                                    }}
                                  >
                                    [Lampiran]
                                  </Button>
                                )}
                              </Col>
                              <Col>
                                {Num.format(data.installment?.[0]?.amount ?? 0)}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Total
                              </Col>
                              <Col
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                {Num.format(data.total)}
                              </Col>
                            </Row>
                          </Col>
                          {data.note == null ? (
                            ""
                          ) : (
                            <Col span={24}>Catatan : {data.note}</Col>
                          )}
                          <Col span={24} style={{ marginTop: 14 }}>
                            <Button
                              block
                              icon={<PrinterFilled />}
                              color="primary"
                              size="large"
                              variant="solid"
                              target="_blank"
                              href={`/print/order/${data.id}`}
                            >
                              Print
                            </Button>
                          </Col>
                        </Row>
                      </>
                    ),
                  },
                  {
                    key: "2",
                    label: "Riwayat Setoran",
                    children: (
                      <>
                        <Space
                          direction="vertical"
                          size={20}
                          style={{ width: "100%" }}
                        >
                          <Space direction="vertical" style={{ width: "100%" }}>
                            <Form
                              size="large"
                              form={form}
                              style={{ paddingTop: "14px" }}
                              onFinish={async (values) => {
                                const payload = {
                                  ...values,
                                  id: randomID(),
                                  invoiceId: data.id,
                                  printed: dayjs(values.printed).format(
                                    "YYYY-MM-DD"
                                  ),
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
                                    min={0}
                                    max={data.total}
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
                            <Table
                              bordered
                              size="small"
                              loading={false}
                              style={{ overflowX: "scroll" }}
                              pagination={false}
                              dataSource={data.installment?.map((e, i) => {
                                return { ...e, key: i };
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
                          </Space>
                          <Button
                            block
                            icon={<PrinterFilled />}
                            color="primary"
                            size="large"
                            variant="solid"
                            target="_blank"
                            href={`/print/installment/${data.id}`}
                            disabled={
                              data.installment && data.installment.length > 0
                                ? false
                                : true
                            }
                          >
                            Print
                          </Button>
                        </Space>
                      </>
                    ),
                  },
                ]}
              />
            );
          }
        })()}
      </Modal>
    </>
  );
}
