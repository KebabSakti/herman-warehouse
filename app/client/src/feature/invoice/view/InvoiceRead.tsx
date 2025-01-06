import { PrinterFilled } from "@ant-design/icons";
import { Button, Col, Modal, Result, Row, Space, Table, Tabs } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { SERVER } from "../../../common/common";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { Invoice } from "../model/invoice_model";
import { useInvoiceHook } from "./InvoiceHook";

export function InvoiceRead() {
  const { auth, invoiceController } = useContext(Dependency)!;
  const invoice = useInvoiceHook(invoiceController);
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();

  useEffect(() => {
    if (invoice.state.action == "idle" && invoice.state.status == "idle") {
      invoice.read(param.id!, { token: auth.state.data! });
    }
  }, [invoice.state]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        width={650}
        loading={invoice.state.status == "loading"}
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
                defaultActiveKey="1"
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
                    disabled:
                      data.installment && data.installment.length > 0
                        ? false
                        : true,
                    children: (
                      <>
                        <Space
                          direction="vertical"
                          size={20}
                          style={{ width: "100%" }}
                        >
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
                                dataIndex: "created",
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
                                title: "Piutang",
                                dataIndex: "outstanding",
                                render: (value) => <>{Num.format(value)}</>,
                              },
                            ]}
                          />
                          <Button
                            block
                            icon={<PrinterFilled />}
                            color="primary"
                            size="large"
                            variant="solid"
                            target="_blank"
                            href={`/print/installment/${data.id}`}
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
