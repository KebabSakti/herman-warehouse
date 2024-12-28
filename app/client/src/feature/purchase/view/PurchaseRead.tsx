import { Button, Col, Modal, Result, Row, Table } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { Purchase } from "../model/purchase_model";
import { usePurchaseHook } from "./PurchaseHook";
import { ReceiptTableItem, ReceiptTableTag } from "./ReceiptTableHook";
import { PrinterFilled } from "@ant-design/icons";

export function PurchaseRead() {
  const { auth, purchaseController } = useContext(Dependency)!;
  const purchase = usePurchaseHook(purchaseController);
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();

  useEffect(() => {
    if (purchase.state.action == "idle" && purchase.state.status == "idle") {
      purchase.read(param.id!, { token: auth.state.data! });
    }
  }, [purchase.state]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        loading={purchase.state.status == "loading"}
        title="Detail Nota"
        maskClosable={false}
        open={location.pathname.includes("/app/inventory/read")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/inventory?page=1&limit=10"
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (purchase.state.error != null) {
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

          if (purchase.state.data != null) {
            const data = purchase.state.data as Purchase;
            const inventories: ReceiptTableItem[] = data.inventory!.map((e) => {
              return {
                key: e.id,
                id: e.id,
                name: e.productName,
                tag: ReceiptTableTag.Inventory,
                qty: e.qty,
                price: e.price,
                total: e.total,
              };
            });
            const payments: ReceiptTableItem[] | undefined = data.payment?.map(
              (e) => {
                return {
                  key: e.id,
                  id: e.id,
                  name: e.note,
                  tag: ReceiptTableTag.Payment,
                  total: e.amount,
                };
              }
            );
            const inventoryTotal = inventories.reduce((a, b) => a + b.total, 0);
            const paymentTotal = payments?.reduce((a, b) => a + b.total, 0);
            const tableData = inventories.concat(payments ?? []);

            return (
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
                      <Col>{dayjs(data.printed).format("DD-MM-YYYY")}</Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col>Supplier</Col>
                      <Col>{data.supplierName}</Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Table
                      bordered
                      size="small"
                      loading={false}
                      style={{ overflowX: "scroll" }}
                      pagination={false}
                      dataSource={tableData}
                      columns={[
                        {
                          title: "Item",
                          dataIndex: "name",
                          onCell: (record) => {
                            if (record.tag == ReceiptTableTag.Payment) {
                              return { colSpan: 3 };
                            }

                            return {};
                          },
                        },
                        {
                          title: "Quantity",
                          dataIndex: "qty",
                          onCell: (record) => {
                            if (record.tag == ReceiptTableTag.Payment) {
                              return { colSpan: 0 };
                            }

                            return {};
                          },
                          render: (value) => <>{Num.format(value ?? 0)}</>,
                        },
                        {
                          title: "Harga",
                          dataIndex: "price",
                          onCell: (record) => {
                            if (record.tag == ReceiptTableTag.Payment) {
                              return { colSpan: 0 };
                            }

                            return {};
                          },
                          render: (value) => <>{Num.format(value ?? 0)}</>,
                        },
                        {
                          title: "Total",
                          dataIndex: "total",
                          align: "right",
                          render: (value) => <>{Num.format(value ?? 0)}</>,
                        },
                      ]}
                    />
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col>Produk Total</Col>
                      <Col>{Num.format(inventoryTotal)}</Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col>Fee {data.fee}%</Col>
                      <Col>{Num.format(data.margin)}</Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col>Biaya Lain</Col>
                      <Col>{Num.format(paymentTotal ?? 0)}</Col>
                    </Row>
                  </Col>
                  {data.outstanding == 0 ? (
                    ""
                  ) : (
                    <Col span={24}>
                      <Row justify="space-between">
                        <Col>Sisa Hutang ({data.supplierName})</Col>
                        <Col>{Num.format(data.outstanding)}</Col>
                      </Row>
                    </Col>
                  )}
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                        Total
                      </Col>
                      <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {Num.format(data.balance)}
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
                      href={`/print/inventory/${data.id}`}
                    >
                      Print
                    </Button>
                  </Col>
                </Row>
              </>
            );
          }
        })()}
      </Modal>
    </>
  );
}
