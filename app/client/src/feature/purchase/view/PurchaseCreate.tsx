import {
  DeleteFilled,
  DollarOutlined,
  PercentageOutlined,
  PlusOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Flex,
  Input,
  InputNumber,
  Row,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeadTitle } from "../../../component/HeadTitle";
import { randomID } from "../../../helper/util";
import { PurchaseCreate as PurchaseCreateType } from "../model/purchase_type";

export function PurchaseCreate() {
  console.log("PURCHASE REBUILD");

  const navigate = useNavigate();
  const datas: any[] = [];
  const [purchaseForm, setPurchaseForm] = useState<PurchaseCreateType>({
    supplierId: "",
    supplierName: "",
    fee: 0,
    paid: 0,
    total: 0,
    balance: 0,
    other: 0,
    note: "",
    due: "",
    inventory: [],
    payment: [],
  });
  const items: any = [
    {
      key: "produk",
      label: "Produk",
      icon: <ProductOutlined />,
    },
    {
      key: "biaya",
      label: "Biaya lain",
      icon: <DollarOutlined />,
    },
  ];

  for (const inventory of purchaseForm.inventory) {
    datas.push({
      key: inventory.id,
      productId: inventory.productId,
      name: inventory.productName,
      quantity: inventory.qty,
      price: inventory.price,
      total: inventory.qty * inventory.price,
    });
  }

  if (datas.length > 0) {
    datas.push({
      key: "fee",
      name: "Fee %",
      total: purchaseForm.fee,
    });
  }

  for (const payment of purchaseForm.payment) {
    datas.push({
      key: payment.id,
      name: payment.note,
      total: payment.amount,
    });
  }

  if (datas.length > 0) {
    datas.push({
      key: "note",
    });
  }

  useEffect(() => {
    console.log(purchaseForm);
  }, [purchaseForm]);

  return (
    <Flex vertical gap="small" style={{ padding: "16px" }}>
      <HeadTitle
        title="Nota Baru"
        onClick={() => {
          navigate(-1);
        }}
      />
      <Card>
        <Flex vertical gap="small">
          <Row gutter={[0, 6]} justify={{ xl: "space-between" }}>
            <Col xs={24} md={6} xl={4}>
              <Dropdown
                menu={{
                  items,
                  onClick: ({ key }) => {
                    if (key == "produk") {
                      const inventory = [...purchaseForm.inventory];

                      inventory.push({
                        id: randomID(),
                        productId: randomID(),
                        productName: "Bandeng",
                        qty: 0,
                        price: 0,
                        total: 0,
                      });

                      setPurchaseForm({
                        ...purchaseForm,
                        inventory: inventory,
                      });
                    }

                    if (key == "biaya") {
                      const payment = [...purchaseForm.payment];

                      payment.push({
                        id: randomID(),
                        note: "Biaya macam-macam",
                        amount: 0,
                      });

                      setPurchaseForm({
                        ...purchaseForm,
                        payment: payment,
                      });
                    }
                  },
                }}
              >
                <Button
                  block
                  color="primary"
                  variant="solid"
                  size="large"
                  icon={<PlusOutlined />}
                >
                  Tambah Item
                </Button>
              </Dropdown>
            </Col>
            <Col xs={24} md={18} xl={20}>
              <Row gutter={[6, 14]} justify={{ xl: "end" }}>
                <Col xs={24} md={6} xl={6}>
                  <AutoComplete
                    options={[]}
                    style={{ display: "block" }}
                    onChange={(value) => {
                      console.log(value);
                    }}
                  >
                    <Input.Search size="large" placeholder="Supplier" />
                  </AutoComplete>
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
            dataSource={datas}
            columns={[
              {
                title: "Item",
                dataIndex: "name",
                minWidth: 60,
                onCell: (record) => {
                  if (
                    record.quantity == null &&
                    record.price == null &&
                    record.key != "note"
                  ) {
                    return { colSpan: 3 };
                  }

                  if (record.key == "note") {
                    return { colSpan: 5 };
                  }

                  return {};
                },
                render: (_, record) => {
                  if (record.key == "note") {
                    return <Input.TextArea placeholder="Catatan" />;
                  }

                  return <>{record.name}</>;
                },
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                minWidth: 60,
                onCell: (record) => {
                  if (
                    record.quantity == null ||
                    record.price == null ||
                    record.key == "note"
                  ) {
                    return { colSpan: 0 };
                  }

                  return {};
                },
                render: (value) => {
                  return (
                    <InputNumber
                      placeholder="Quantity"
                      defaultValue={value}
                      style={{ display: "block" }}
                      addonAfter={<>Kg</>}
                    />
                  );
                },
              },
              {
                title: "Harga",
                dataIndex: "price",
                minWidth: 60,
                onCell: (record) => {
                  if (
                    record.quantity == null ||
                    record.price == null ||
                    record.key == "note"
                  ) {
                    return { colSpan: 0 };
                  }

                  return {};
                },
                render: (value) => {
                  return (
                    <InputNumber
                      placeholder="Harga"
                      defaultValue={value}
                      style={{ display: "block" }}
                      addonAfter={<>Rp</>}
                    />
                  );
                },
              },
              {
                title: "Total",
                dataIndex: "total",
                minWidth: 60,
                onCell: (record) => {
                  if (record.key == "note") {
                    return { colSpan: 0 };
                  }

                  return {};
                },
              },
              {
                onCell: (record) => {
                  if (record.key == "note") {
                    return { colSpan: 0 };
                  }

                  return {};
                },
                render: (_, record) => {
                  if (record.key == "fee") {
                    return null;
                  }

                  return (
                    <Flex gap={4}>
                      <Button
                        icon={<DeleteFilled />}
                        color="danger"
                        size="small"
                        variant="solid"
                        onClick={() => {
                          const inventory = [...purchaseForm.inventory].filter(
                            (e) => e.id != record.key
                          );

                          const payment = [...purchaseForm.payment].filter(
                            (e) => e.id != record.key
                          );

                          setPurchaseForm({
                            ...purchaseForm,
                            inventory: inventory,
                            payment: payment,
                          });
                        }}
                      />
                    </Flex>
                  );
                },
              },
            ]}
          />
        </Flex>
      </Card>
    </Flex>
  );
}
