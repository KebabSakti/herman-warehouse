import {
  DeleteFilled,
  DollarOutlined,
  PercentageOutlined,
  PlusOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import {
  Result as AntdResult,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Flex,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Row,
  Skeleton,
  Space,
  Table,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { HeadTitle } from "../../../component/HeadTitle";
import { debounce } from "../../../helper/debounce";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { Product } from "../../product/model/product_type";
import { useProductHook } from "../../product/view/ProductHook";
import { Supplier } from "../../supplier/model/supplier_model";
import { useSupplierHook } from "../../supplier/view/supplier_hook";
import {
  PurchaseCreate as PurchaseCreateType,
  PurchaseTableColumn,
} from "../model/purchase_type";

type TableColumnType = {
  key: string;
  name: string;
  tag: TableItemTag;
  id?: string | null | undefined;
  qty?: string | null | undefined;
  price?: string | null | undefined;
  total?: string | null | undefined;
};

type Inventory = {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  price: number;
  total: number;
};

type Payment = {
  id: string;
  amount: number;
};

type Purchase = {
  id: string;
  supplierId: string;
  supplierName: string;
  fee: number;
  margin: number;
  paid: number;
  total: number;
  balance: number;
  note: "";
  created: string;
};

enum TableItemTag {
  Product,
  Payment,
  Fee,
  Total,
  Note,
}

export function PurchaseCreate() {
  const navigate = useNavigate();
  const [modal, setModal] = useState("");
  const [tableData, setTableData] = useState<PurchaseTableColumn[]>([]);

  const [data, setData] = useState<TableColumnType[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [payment, setPayment] = useState<Payment[]>([]);
  const [purchase, setPurchase] = useState<Purchase>();

  const [purchaseForm, setPurchaseForm] = useState<PurchaseCreateType>({
    supplierId: "",
    supplierName: "",
    fee: 0,
    margin: 0,
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
        total: purchaseForm.margin,
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
      <AddSupplier
        modal={modal}
        setModal={setModal}
        purchaseForm={purchaseForm}
        setPurchaseForm={setPurchaseForm}
      />
      <AddProduct
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
                    type="primary"
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
                    <Space.Compact>
                      <Input
                        readOnly
                        placeholder="Supplier"
                        size="large"
                        value={purchaseForm.supplierName}
                      />
                      <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setModal("supplier");
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
                      defaultValue={purchaseForm.fee}
                      onChange={(value) => {
                        const val = value ?? 0;
                        const invTotal = purchaseForm.inventory.reduce(
                          (acc, item) => acc + item.total,
                          0
                        );

                        const margin = invTotal * (val / 100);
                        const grandTotal = invTotal - margin;

                        setPurchaseForm({
                          ...purchaseForm,
                          fee: val,
                          margin: margin,
                          total: grandTotal,
                        });
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

                          const invTotal = inventory.reduce(
                            (acc, item) => acc + item.total,
                            0
                          );

                          const margin = invTotal * (purchaseForm.fee / 100);
                          const grandTotal = invTotal - margin;

                          setPurchaseForm({
                            ...purchaseForm,
                            inventory: inventory,
                            total: grandTotal,
                            margin: margin,
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

                            const invTotal = inventory.reduce(
                              (acc, item) => acc + item.total,
                              0
                            );

                            const margin = invTotal * (purchaseForm.fee / 100);
                            const grandTotal = invTotal - margin;

                            setPurchaseForm({
                              ...purchaseForm,
                              inventory: inventory,
                              total: grandTotal,
                              margin: margin,
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

                            const invTotal = inventory.reduce(
                              (acc, item) => acc + item.total,
                              0
                            );

                            const margin = invTotal * (purchaseForm.fee / 100);
                            const grandTotal = invTotal - margin;

                            setPurchaseForm({
                              ...purchaseForm,
                              inventory: inventory,
                              payment: payment,
                              note: note,
                              margin: margin,
                              total: grandTotal,
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

function AddProduct(props: any) {
  const active = props.modal == "product";
  const { auth, productController } = useContext(Dependency)!;
  const product = useProductHook(productController);
  const result = product.state.data as Result<Product[]> | null;
  const initParam = {
    page: "1",
    limit: "10",
  };
  const [param, setParam] = useState<any>(initParam);

  const productSearch = debounce((message: string) => {
    const searchValue = {
      ...param,
      search: message,
    };

    if (message.length == 0) {
      delete searchValue.search;
    }

    setParam(searchValue);
  }, 500);

  useEffect(() => {
    if (active) {
      product.list(param, {
        token: auth.state.data!,
      });
    }
  }, [active, param]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        width={800}
        title="Tambah Produk"
        maskClosable={false}
        open={active}
        footer={null}
        onCancel={() => {
          props.setModal("");
        }}
      >
        {(() => {
          if (product.state.error != null) {
            return (
              <AntdResult
                status="error"
                title="Error"
                subTitle="Klik tombol di bawah untuk mengulang, atau coba beberapa saat lagi"
                extra={[
                  <Button
                    type="primary"
                    key="0"
                    onClick={() => {
                      setParam(initParam);
                    }}
                  >
                    Coba lagi
                  </Button>,
                ]}
              />
            );
          }

          if (result?.data != null) {
            return (
              <Flex vertical gap="small">
                <Input.Search
                  allowClear
                  placeholder="Kode / nama produk"
                  size="large"
                  defaultValue={param.search}
                  onChange={(e) => {
                    productSearch(e.target.value);
                  }}
                />
                {(() => {
                  const products = result.data;

                  return (
                    <Flex vertical gap="middle">
                      <Table
                        bordered
                        loading={product.state.status == "loading"}
                        style={{ overflowX: "scroll" }}
                        pagination={false}
                        dataSource={
                          products.length == 0
                            ? []
                            : products.map((e, i) => {
                                return { ...e, key: i };
                              })
                        }
                        columns={[
                          {
                            title: "Kode",
                            dataIndex: "code",
                            minWidth: 60,
                          },
                          {
                            title: "Product",
                            dataIndex: "name",
                            minWidth: 60,
                          },
                          {
                            render: (_, record) => {
                              const total = props.purchaseForm.inventory.filter(
                                (e: any) => e.productId == record.id
                              ).length;

                              return (
                                <InputNumber
                                  min={0}
                                  value={total}
                                  onStep={(_, info) => {
                                    let inventory = [
                                      ...props.purchaseForm.inventory,
                                    ];

                                    if (info.type == "down") {
                                      const index = inventory.findIndex(
                                        (e: any) => e.productId == record.id
                                      );

                                      inventory.splice(index, 1);
                                    }

                                    if (info.type == "up") {
                                      inventory.push({
                                        id: randomID(),
                                        productId: record.id,
                                        productName: record.name,
                                        qty: 0,
                                        price: 0,
                                        total: 0,
                                      });
                                    }

                                    props.setPurchaseForm({
                                      ...props.purchaseForm,
                                      inventory: inventory,
                                    });
                                  }}
                                />
                              );
                            },
                          },
                        ]}
                      />
                      <Pagination
                        simple
                        align="center"
                        showSizeChanger={false}
                        current={result?.paging!.page}
                        total={result?.paging!.total}
                        onChange={(page) => {
                          setParam({
                            ...param,
                            page: page.toString(),
                          });
                        }}
                      />
                    </Flex>
                  );
                })()}
              </Flex>
            );
          }

          return <Skeleton />;
        })()}
      </Modal>
    </>
  );
}

function AddSupplier(props: any) {
  const active = props.modal == "supplier";
  const { auth, supplierController } = useContext(Dependency)!;
  const supplier = useSupplierHook(supplierController);
  const result = supplier.state.data as Result<Supplier[]> | null;
  const initParam = {
    page: "1",
    limit: "10",
  };
  const [param, setParam] = useState<any>(initParam);

  const makeSearch = debounce((message: string) => {
    const searchValue = {
      ...param,
      search: message,
    };

    if (message.length == 0) {
      delete searchValue.search;
    }

    setParam(searchValue);
  }, 500);

  useEffect(() => {
    if (active) {
      supplier.list(param, {
        token: auth.state.data!,
      });
    }
  }, [active, param]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        width={800}
        title="Daftar Supplier"
        maskClosable={false}
        open={active}
        footer={null}
        onCancel={() => {
          props.setModal("");
        }}
      >
        {(() => {
          if (supplier.state.error != null) {
            return (
              <AntdResult
                status="error"
                title="Error"
                subTitle="Klik tombol di bawah untuk mengulang, atau coba beberapa saat lagi"
                extra={[
                  <Button
                    type="primary"
                    key="0"
                    onClick={() => {
                      setParam(initParam);
                    }}
                  >
                    Coba lagi
                  </Button>,
                ]}
              />
            );
          }

          if (result?.data != null) {
            return (
              <Flex vertical gap="small">
                <Input.Search
                  allowClear
                  placeholder="Nama supplier"
                  size="large"
                  defaultValue={param.search}
                  onChange={(e) => {
                    makeSearch(e.target.value);
                  }}
                />
                {(() => {
                  const products = result.data;

                  return (
                    <Flex vertical gap="middle">
                      <Table
                        bordered
                        loading={supplier.state.status == "loading"}
                        style={{ overflowX: "scroll" }}
                        pagination={false}
                        dataSource={
                          products.length == 0
                            ? []
                            : products.map((e, i) => {
                                return { ...e, key: i };
                              })
                        }
                        columns={[
                          {
                            title: "Supplier",
                            dataIndex: "name",
                            minWidth: 60,
                          },
                          {
                            title: "No. Hp",
                            dataIndex: "phone",
                            minWidth: 60,
                          },
                          {
                            render: (_, record) => {
                              return (
                                <Button
                                  type="primary"
                                  disabled={
                                    props.purchaseForm.supplierId == record.id
                                  }
                                  onClick={() => {
                                    props.setPurchaseForm({
                                      ...props.purchaseForm,
                                      supplierId: record.id,
                                      supplierName: record.name,
                                    });

                                    props.setModal("");
                                  }}
                                >
                                  {props.purchaseForm.supplierId == record.id
                                    ? "Terpilih"
                                    : "Pilih"}
                                </Button>
                              );
                            },
                          },
                        ]}
                      />
                      <Pagination
                        simple
                        align="center"
                        showSizeChanger={false}
                        current={result?.paging!.page}
                        total={result?.paging!.total}
                        onChange={(page) => {
                          setParam({
                            ...param,
                            page: page.toString(),
                          });
                        }}
                      />
                    </Flex>
                  );
                })()}
              </Flex>
            );
          }

          return <Skeleton />;
        })()}
      </Modal>
    </>
  );
}
