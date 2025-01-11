import { PrinterFilled } from "@ant-design/icons";
import { Button, Col, Row, Table, Typography } from "antd";
import dayjs from "dayjs";
import { SERVER } from "../../../common/common";
import { Num } from "../../../helper/num";
import { Invoice } from "../model/invoice_model";

export function InvoiceDetailTab({ invoice }: { invoice: Invoice }) {
  const { Text } = Typography;
  const summaries = [
    {
      item: "Produk",
      total: invoice.totalItem,
      min: false,
    },
  ];

  if (invoice.totalPaid > 0) {
    summaries.push({
      item: "Panjar",
      total: invoice.totalPaid,
      min: true,
    });
  }

  summaries.push({
    item: "Total",
    total: invoice.total,
    min: false,
  });

  return (
    <>
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
          <Table
            size="small"
            style={{ overflowX: "scroll" }}
            pagination={false}
            dataSource={invoice.item.map((e, i) => {
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
                render: (value) => <>{Num.format(value ?? 0)}</>,
              },
            ]}
          />
          <Table
            size="small"
            showHeader={false}
            style={{ overflowX: "scroll" }}
            pagination={false}
            dataSource={summaries.map((e, i) => {
              return { ...e, key: i };
            })}
            columns={[
              {
                dataIndex: "item",
                render: (value) => {
                  return (
                    <>
                      <div
                        style={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {value}
                        {value == "Panjar" &&
                        invoice.installment?.[0]?.attachment ? (
                          <>
                            <Button
                              color="primary"
                              variant="link"
                              size="small"
                              target="_blank"
                              href={`${SERVER}/${invoice.installment?.[0]?.attachment}`}
                            >
                              [Lampiran]
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  );
                },
              },
              {
                dataIndex: "total",
                align: "right",
                render: (value, record) => {
                  return (
                    <div style={{ fontWeight: "bold" }}>
                      <Text style={{ color: record.min ? "red" : "" }}>
                        {Num.format(value ?? 0)}
                      </Text>
                    </div>
                  );
                },
              },
            ]}
          />
        </Col>
        {invoice.note == null ? (
          ""
        ) : (
          <Col span={24}>Catatan : {invoice.note}</Col>
        )}
        <Col span={24} style={{ marginTop: 14 }}>
          <Button
            block
            icon={<PrinterFilled />}
            color="primary"
            size="large"
            variant="solid"
            target="_blank"
            href={`/print/order/${invoice.id}`}
          >
            Print
          </Button>
        </Col>
      </Row>
    </>
  );
}
