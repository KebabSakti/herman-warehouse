import { PrinterFilled } from "@ant-design/icons";
import { Button, Col, Row, Table, Typography } from "antd";
import dayjs from "dayjs";
import { Num } from "../../../helper/num";
import { PurchaseTabProps } from "./PurchaseRead";
import { SERVER } from "../../../common/common";

export function PurchaseDetailTab({ purchase }: PurchaseTabProps) {
  const { Text } = Typography;

  const summaries = [
    {
      item: "Total Produk",
      total: purchase.totalItem,
      min: false,
    },
  ];

  function init() {
    if (purchase.fee > 0) {
      summaries.push({
        item: `Fee ${purchase.fee}%`,
        total: purchase.margin,
        min: true,
      });
    }

    if (purchase.other ?? 0 > 0) {
      summaries.push({
        item: "Biaya Lain",
        total: purchase.other ?? 0,
        min: true,
      });
    }

    if (purchase.dp ?? 0 > 0) {
      summaries.push({
        item: "Panjar",
        total: purchase.dp ?? 0,
        min: true,
      });
    }

    if (purchase.outstanding ?? 0 > 0) {
      summaries.push({
        item: "Sisa Hutang",
        total: purchase.outstanding ?? 0,
        min: false,
      });
    }

    summaries.push({
      item: "TOTAL",
      total: purchase.total,
      min: false,
    });
  }

  init();

  return (
    <>
      <Row gutter={[0, 8]}>
        <Col span={24}>
          <Row justify="space-between">
            <Col>Kode</Col>
            <Col>{purchase.code}</Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row justify="space-between">
            <Col>Tanggal</Col>
            <Col>{dayjs(purchase.printed).format("DD-MM-YYYY")}</Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row justify="space-between">
            <Col>Supplier</Col>
            <Col>{purchase.supplierName}</Col>
          </Row>
        </Col>
        <Col span={24}>
          <Table
            size="small"
            loading={false}
            style={{ overflowX: "auto" }}
            pagination={false}
            dataSource={purchase.inventory.map((e, i) => {
              return { key: i, ...e };
            })}
            columns={[
              {
                title: "Item",
                dataIndex: "productName",
              },
              {
                title: "Quantity",
                dataIndex: "qty",
                render: (value) => Num.format(value),
              },
              {
                title: "Harga",
                dataIndex: "price",
                render: (value) => Num.format(value),
              },
              {
                title: "Total",
                dataIndex: "total",
                align: "right",
                render: (value) => Num.format(value),
              },
            ]}
          />

          {(() => {
            if (purchase.payment && purchase.payment.length > 0) {
              return (
                <>
                  <Table
                    size="small"
                    showHeader={false}
                    loading={false}
                    style={{ overflowX: "auto" }}
                    pagination={false}
                    dataSource={purchase.payment?.map((e, i) => {
                      return { key: i, ...e };
                    })}
                    columns={[
                      {
                        dataIndex: "note",
                      },
                      {
                        dataIndex: "amount",
                        align: "right",
                        render: (value) => Num.format(value ?? 0),
                      },
                    ]}
                  />
                </>
              );
            }
          })()}

          <Table
            size="small"
            showHeader={false}
            loading={false}
            pagination={false}
            style={{ overflowX: "auto" }}
            dataSource={summaries.map((e, i) => {
              return { key: i, ...e };
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
                        {value == "Panjar" && purchase.ledger?.[0]?.file ? (
                          <>
                            <Button
                              color="primary"
                              variant="link"
                              size="small"
                              target="_blank"
                              href={`${SERVER}/${purchase.ledger?.[0]?.file}`}
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

        <Col span={24} style={{ marginTop: 14 }}>
          <Button
            block
            icon={<PrinterFilled />}
            color="primary"
            size="large"
            variant="solid"
            target="_blank"
            href={`/print/inventory/${purchase.id}`}
          >
            Print
          </Button>
        </Col>
      </Row>
    </>
  );
}
