import {
  DeleteFilled,
  DollarOutlined,
  PercentageOutlined,
  PlusOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Flex,
  Input,
  InputNumber,
  Row,
  Space,
  Table,
} from "antd";
import { PurchaseCreateProps } from "./PurchaseCreateOther";
import { ReceiptTableTag } from "./ReceiptTableHook";
import { Num } from "../../../helper/num";

export function ReceiptTable(props: PurchaseCreateProps) {
  console.log(props.hook.state);

  const inventories = props.hook.state.item.filter(
    (a) => a.tag == ReceiptTableTag.Inventory
  );
  const payments = props.hook.state.item.filter(
    (a) => a.tag == ReceiptTableTag.Payment
  );

  return (
    <>
      <Flex vertical gap="small">
        <Row gutter={[0, 6]} justify={{ xl: "space-between" }}>
          <Col xs={24} md={6} xl={4}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "product",
                    label: "Produk",
                    icon: <ProductOutlined />,
                  },
                  {
                    key: "payment",
                    label: "Biaya lain",
                    icon: <DollarOutlined />,
                    disabled: inventories.length == 0,
                  },
                ],
                onClick: ({ key }) => {
                  if (key == "product") {
                    props.setModal("product");
                  }
                },
              }}
            >
              <Button block type="primary" size="large" icon={<PlusOutlined />}>
                Tambah Item
              </Button>
            </Dropdown>
          </Col>
          <Col xs={24} md={18} xl={20}>
            <Row gutter={[6, 14]} justify={{ xl: "end" }}>
              <Col xs={24} md={6} xl={6}>
                <Space.Compact>
                  <Input
                    readOnly
                    placeholder="Supplier"
                    size="large"
                    // value={purchaseForm.supplierName}
                  />
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      //   setModal("supplier");
                    }}
                  />
                </Space.Compact>
              </Col>
              <Col xs={24} md={6} xl={6}>
                <DatePicker
                  size="large"
                  placeholder="Tanggal nota"
                  style={{ display: "block" }}
                />
              </Col>
              <Col xs={24} md={4} xl={4}>
                <InputNumber
                  min={0}
                  size="large"
                  placeholder="Fee"
                  style={{ display: "block" }}
                  addonAfter={<PercentageOutlined />}
                  defaultValue={props.hook.state.fee}
                  onChange={(value) => {
                    props.hook.fee(value ?? 0);
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          bordered
          loading={false}
          style={{ overflowX: "scroll" }}
          pagination={false}
          dataSource={props.hook.state.item}
          footer={(records) => {
            if (records.length == 0) {
              return <></>;
            }

            return (
              <>
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col>Produk Total</Col>
                      <Col>{Num.format(props.hook.state.total.item)}</Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col>Fee %</Col>
                      <Col>{Num.format(props.hook.state.margin)}</Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col>Biaya Lain</Col>
                      <Col>{Num.format(props.hook.state.total.payment)}</Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                        Total
                      </Col>
                      <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {Num.format(props.hook.state.total.sum)}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col span={24}>
                        <Input.TextArea
                          placeholder="Catatan"
                          defaultValue={props.hook.state.note ?? ""}
                          onChange={(e) => {
                            //
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            );
          }}
          columns={[
            {
              width: 70,
              render: (_, record) => {
                return (
                  <Flex gap={4} justify="center">
                    <Button
                      icon={<DeleteFilled />}
                      color="danger"
                      size="small"
                      variant="solid"
                      onClick={() => {
                        props.hook.removeItem(record);
                      }}
                    />
                  </Flex>
                );
              },
            },
            {
              title: "Item",
              dataIndex: "name",
            },
            {
              title: "Quantity",
              dataIndex: "qty",
              render: (value, record) => {
                return (
                  <InputNumber
                    placeholder="Quantity"
                    min={0}
                    style={{ display: "block", width: "100%" }}
                    defaultValue={value}
                    formatter={(value) => {
                      const formatted = Num.format(value ?? 0);
                      return formatted;
                    }}
                    onChange={(value) => {
                      props.hook.modItem({ ...record, qty: value });
                    }}
                  />
                );
              },
            },
            {
              title: "Harga",
              dataIndex: "price",
              render: (value, record) => {
                return (
                  <InputNumber
                    placeholder="Harga"
                    min={0}
                    step={100}
                    style={{ display: "block", width: "100%" }}
                    defaultValue={value}
                    formatter={(value) => {
                      const formatted = Num.format(value ?? 0);
                      return formatted;
                    }}
                    onChange={(value) => {
                      props.hook.modItem({ ...record, price: value });
                    }}
                  />
                );
              },
            },
            {
              title: "Total",
              dataIndex: "total",
              align: "right",
              width: 200,
              render: (value) => {
                const formatted = Num.format(value ?? 0);
                return formatted;
              },
            },
          ]}
        />
      </Flex>
    </>
  );
}
