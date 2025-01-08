import { PrinterFilled } from "@ant-design/icons";
import { Button, Col, Row, Table } from "antd";
import dayjs from "dayjs";
import { SERVER } from "../../../common/common";
import { Num } from "../../../helper/num";
import { Invoice } from "../model/invoice_model";

export function InvoiceDetailTab({ invoice }: { invoice: Invoice }) {
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
            bordered
            size="small"
            loading={false}
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
        </Col>
        <Col span={24}>
          <Row justify="space-between">
            <Col>Total Item</Col>
            <Col>{Num.format(invoice.totalItem)}</Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row justify="space-between">
            <Col>
              Setor
              {invoice.installment?.[0]?.attachment == undefined ? (
                ""
              ) : (
                <Button
                  color="primary"
                  variant="link"
                  size="small"
                  href={`${SERVER}/${invoice.installment?.[0]?.attachment}`}
                  target="_blank"
                  onClick={() => {
                    //
                  }}
                >
                  [Lampiran]
                </Button>
              )}
            </Col>
            <Col>{Num.format(invoice.totalPaid)}</Col>
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
              {Num.format(invoice.total)}
            </Col>
          </Row>
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
