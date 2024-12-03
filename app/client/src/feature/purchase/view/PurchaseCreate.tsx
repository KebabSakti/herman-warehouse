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
import {
  PurchaseCreate as PurchaseCreateType,
  PurchaseTableColumn,
} from "../model/purchase_type";
import { PurchaseAddProduct } from "./PurchaseAddProduct";
import { Num } from "../../../helper/num";

export function PurchaseCreate() {
  const navigate = useNavigate();
  const [modal, setModal] = useState("");
  const [tableData, setTableData] = useState<PurchaseTableColumn[]>([]);
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

  useEffect(() => {
    const datas = [];

    for (const inventory of purchaseForm.inventory) {
      datas.push({
        key: inventory.id,
        productId: inventory.productId,
        name: inventory.productName,
        quantity: inventory.qty,
        price: inventory.price,
        total: inventory.total,
      });
    }

    if (purchaseForm.inventory.length > 0) {
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

    if (purchaseForm.inventory.length > 0) {
      datas.push({
        key: "total",
        name: "Total",
        total: purchaseForm.total,
      });

      datas.push({
        key: "note",
      });
    }

    console.log(purchaseForm);

    setTableData(datas);
  }, [purchaseForm]);

  return (
    <>
      <PurchaseAddProduct
        modal={modal}
        setModal={setModal}
        purchaseForm={purchaseForm}
        setPurchaseForm={setPurchaseForm}
      />
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
                    items: [
                      {
                        key: "produk",
                        label: "Produk",
                        icon: <ProductOutlined />,
                      },
                      {
                        key: "biaya",
                        label: "Biaya lain",
                        icon: <DollarOutlined />,
                        disabled: purchaseForm.inventory.length == 0,
                      },
                    ],
                    onClick: ({ key }) => {
                      if (key == "produk") {
                        setModal("product");
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
                      defaultValue={purchaseForm.fee}
                      onChange={(value) => {
                        setPurchaseForm({ ...purchaseForm, fee: value ?? 0 });
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
              dataSource={tableData}
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
                    if (record.key == "total") {
                      return (
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {record.name}
                        </div>
                      );
                    }

                    if (record.key == "note") {
                      return (
                        <Input.TextArea
                          placeholder="Catatan"
                          defaultValue={purchaseForm.note ?? ""}
                          onChange={(e) => {
                            setPurchaseForm({
                              ...purchaseForm,
                              note: e.target.value,
                            });
                          }}
                        />
                      );
                    }

                    return <>{record.name}</>;
                  },
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
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
                  render: (value, record) => {
                    return (
                      <InputNumber
                        placeholder="Quantity"
                        min={0}
                        style={{ display: "block" }}
                        defaultValue={value}
                        addonAfter={<>Kg</>}
                        onChange={(value) => {
                          const val = value ?? 0;
                          const inventory = [...purchaseForm.inventory];

                          const index = inventory.findIndex(
                            (e) => e.id == record.key
                          );

                          const total = val * inventory[index].price;

                          inventory[index] = {
                            ...inventory[index],
                            qty: val,
                            total: total,
                          };

                          setPurchaseForm({
                            ...purchaseForm,
                            inventory: inventory,
                          });
                        }}
                      />
                    );
                  },
                },
                {
                  title: "Harga",
                  dataIndex: "price",
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
                  render: (value, record) => {
                    return (
                      <InputNumber
                        placeholder="Harga"
                        min={0}
                        step={100}
                        style={{ display: "block" }}
                        defaultValue={value}
                        addonAfter={<>Kg</>}
                        onChange={(value) => {
                          if (value) {
                            const inventory = [...purchaseForm.inventory];

                            const index = inventory.findIndex(
                              (e) => e.id == record.key
                            );

                            const total = value * inventory[index].qty;

                            inventory[index] = {
                              ...inventory[index],
                              price: value,
                              total: total,
                            };

                            setPurchaseForm({
                              ...purchaseForm,
                              inventory: inventory,
                            });
                          }
                        }}
                      />
                    );
                  },
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  minWidth: 200,
                  onCell: (record) => {
                    if (record.key == "note") {
                      return { colSpan: 0 };
                    }

                    return {};
                  },
                  render: (value) => {
                    const formattedValue =
                      value == undefined ? 0 : Num.format(Number(value));

                    return (
                      <div style={{ width: "100%" }}>{formattedValue}</div>
                    );
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
                    if (record.key == "fee" || record.key == "total") {
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
                            const inventory = [
                              ...purchaseForm.inventory,
                            ].filter((e) => e.id != record.key);

                            const payment =
                              inventory.length == 0
                                ? []
                                : [...purchaseForm.payment].filter(
                                    (e) => e.id != record.key
                                  );

                            const note =
                              inventory.length == 0 ? "" : purchaseForm.note;

                            setPurchaseForm({
                              ...purchaseForm,
                              inventory: inventory,
                              payment: payment,
                              note: note,
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
    </>
  );
}
