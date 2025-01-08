import { PrinterFilled } from "@ant-design/icons";
import { Button, Col, Row, Table } from "antd";
import dayjs from "dayjs";
import { Num } from "../../../helper/num";
import { PurchaseTabProps } from "./PurchaseRead";
import { ReceiptTableItem, ReceiptTableTag } from "./ReceiptTableHook";

export function PurchaseDetailTab({ purchase }: PurchaseTabProps) {
  const data = purchase;

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

  const payments: ReceiptTableItem[] | undefined =
    data.payment?.[0]?.id == null
      ? undefined
      : data.payment?.map((e) => {
          return {
            key: e.id,
            id: e.id,
            name: e.note,
            tag: ReceiptTableTag.Payment,
            total: e.amount,
          };
        });

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
            <Col style={{ fontWeight: "bold", fontSize: "16px" }}>Total</Col>
            <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
              {Num.format(data.balance)}
            </Col>
          </Row>
        </Col>
        {data.note == null ? "" : <Col span={24}>Catatan : {data.note}</Col>}
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
