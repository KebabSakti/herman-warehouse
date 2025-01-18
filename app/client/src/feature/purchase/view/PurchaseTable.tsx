import {
  AppstoreAddOutlined,
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
  notification,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { purchaseCreateSchema } from "../model/purchase_type";
import { PurchaseCreateProps } from "./PurchaseCreate";
import { usePurchaseHook } from "./PurchaseHook";
import { fileSchema } from "../../../common/type";
import dayjs from "dayjs";

export function PurchaseTable(props: PurchaseCreateProps) {
  const { Text } = Typography;
  const navigate = useNavigate();
  const { auth, purchaseController } = useContext(Dependency)!;
  const purchase = usePurchaseHook(purchaseController);

  async function submitForm(): Promise<void> {
    const day = props.hook.state.printed;
    const time = dayjs().format("HH:mm:ss");
    const printed = `${day} ${time}`;
    let payload = { ...props.hook.state, printed: printed };

    if (payload.ledger && payload.ledger.length > 0 && payload.ledger[0].file) {
      await fileSchema.validate(payload.ledger[0]).catch((e) => {
        notification.error({
          message: "Error",
          description: (
            <Flex vertical gap={1}>
              {e.errors.map((e: any, i: any) => {
                return (
                  <Text key={i} type="danger">
                    {e}
                  </Text>
                );
              })}
            </Flex>
          ),
        });
      });
    }

    await purchaseCreateSchema
      .validate(props.hook.state)
      .then(() => {
        purchase.create(props.hook.state, { token: auth.state.data! });
      })
      .catch((e) => {
        notification.error({
          message: "Error",
          description: (
            <Flex vertical gap={1}>
              {e.errors.map((e: any, i: any) => {
                return (
                  <Text key={i} type="danger">
                    {e}
                  </Text>
                );
              })}
            </Flex>
          ),
        });
      });
  }

  useEffect(() => {
    if (
      purchase.state.action == "create" &&
      purchase.state.status == "complete"
    ) {
      if (purchase.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Proses berhasil",
        });

        navigate(-1);
      } else {
        notification.error({
          message: "Error",
          description: purchase.state.error.message,
        });
      }
    }
  }, [purchase.state]);

  return (
    <>
      <Spin spinning={purchase.state.status == "loading"}>
        <Flex vertical gap="small">
          <Row gutter={[4, 4]} justify={{ xl: "space-between" }}>
            <Col xs={{ flex: "100%" }} md={{ flex: "20%" }}>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "product",
                      label: "Produk",
                      icon: <ProductOutlined />,
                    },
                    {
                      key: "dp",
                      label: "Panjar",
                      icon: <AppstoreAddOutlined />,
                      disabled:
                        props.hook.state.inventory.length == 0 ||
                        (props.hook.state.ledger != undefined &&
                          props.hook.state.ledger.length > 0),
                    },
                    {
                      key: "payment",
                      label: "Biaya lain",
                      icon: <DollarOutlined />,
                      disabled: props.hook.state.inventory.length == 0,
                    },
                  ],
                  onClick: ({ key }) => {
                    props.setModal(key);
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
            <Col xs={{ flex: "100%" }} md={{ flex: "80%" }}>
              <Row gutter={[4, 4]} justify="end">
                <Col xs={{ flex: "100%" }} md={{ flex: "30%" }}>
                  <Space.Compact block>
                    <Input
                      readOnly
                      placeholder="Supplier"
                      size="large"
                      value={props.hook.state.supplierName ?? ""}
                    />
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        props.setModal("supplier");
                      }}
                    />
                  </Space.Compact>
                </Col>
                <Col xs={{ flex: "100%" }} md={{ flex: "30%" }}>
                  <DatePicker
                    size="large"
                    placeholder="Tanggal nota"
                    style={{ display: "block" }}
                    onChange={(date) => {
                      const day = date.format("YYYY-MM-DD");
                      const time = dayjs().format("HH:mm:ss");
                      const dateString = `${day} ${time}`;
                      props.hook.setDate(dateString);
                    }}
                  />
                </Col>
                <Col xs={{ flex: "100%" }} md={{ flex: "20%" }}>
                  <InputNumber
                    min={0}
                    size="large"
                    placeholder="Fee"
                    style={{ display: "block" }}
                    addonAfter={<PercentageOutlined />}
                    defaultValue={props.hook.state.fee}
                    onChange={(value) => {
                      props.hook.setFee(value ?? 0);
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Table
            size="small"
            rowHoverable={false}
            loading={false}
            style={{ overflowX: "auto" }}
            pagination={false}
            dataSource={props.hook.state.inventory.map((e, i) => {
              return { ...e, key: i };
            })}
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
                          props.hook.setInventory({ ...record, qty: 0 });
                        }}
                      />
                    </Flex>
                  );
                },
              },
              {
                title: "Item",
                dataIndex: "productName",
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
                        props.hook.setValue({ ...record, qty: value });
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
                        props.hook.setValue({ ...record, price: value });
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
          {(() => {
            if (props.hook.state.inventory.length > 0) {
              const summaries = [
                {
                  item: "Produk Total",
                  total: props.hook.state.totalItem,
                  min: false,
                },
              ];

              if (props.hook.state.fee > 0) {
                summaries.push({
                  item: "Fee",
                  total: props.hook.state.margin,
                  min: true,
                });
              }

              if (props.hook.state.other ?? 0 > 0) {
                summaries.push({
                  item: "Biaya Lain",
                  total: props.hook.state.other ?? 0,
                  min: true,
                });
              }

              if (props.hook.state.dp ?? 0 > 0) {
                summaries.push({
                  item: "Panjar",
                  total: props.hook.state.dp ?? 0,
                  min: true,
                });
              }

              if (props.hook.state.outstanding ?? 0 > 0) {
                summaries.push({
                  item: `Hutang (${props.hook.state.supplierName})`,
                  total: props.hook.state.outstanding ?? 0,
                  min: false,
                });
              }

              summaries.push({
                item: "TOTAL",
                total: props.hook.state.total,
                min: false,
              });

              return (
                <>
                  {(() => {
                    if (
                      props.hook.state.payment &&
                      props.hook.state.payment.length > 0
                    ) {
                      return (
                        <>
                          <Table
                            size="small"
                            rowHoverable={false}
                            showHeader={false}
                            loading={false}
                            pagination={false}
                            style={{ overflowX: "auto", margin: 0, padding: 0 }}
                            dataSource={props.hook.state.payment?.map(
                              (e, i) => {
                                return { key: i, ...e };
                              }
                            )}
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
                                          props.hook.setPayment({
                                            ...record,
                                            amount: 0,
                                          });
                                        }}
                                      />
                                    </Flex>
                                  );
                                },
                              },
                              {
                                dataIndex: "note",
                              },
                              {
                                dataIndex: "amount",
                                align: "right",
                                width: 200,
                                render: (value) => {
                                  const formatted = Num.format(value ?? 0);
                                  return formatted;
                                },
                              },
                            ]}
                          />
                        </>
                      );
                    }
                  })()}

                  <Table
                    size="small"
                    rowHoverable={false}
                    showHeader={false}
                    loading={false}
                    pagination={false}
                    style={{ overflowX: "auto", margin: 0, padding: 0 }}
                    dataSource={summaries.map((e, i) => {
                      return { key: i, ...e };
                    })}
                    columns={[
                      {
                        dataIndex: "item",
                        render: (value) => {
                          return (
                            <>
                              {value}
                              {value == "Panjar" ? (
                                <>
                                  <Button
                                    color="danger"
                                    variant="link"
                                    size="small"
                                    onClick={() => {
                                      props.hook.setLedger({
                                        ...props.hook.state.ledger![0],
                                        amount: 0,
                                      });
                                    }}
                                  >
                                    [Hapus]
                                  </Button>
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        },
                      },
                      {
                        dataIndex: "total",
                        align: "right",
                        width: 200,
                        render: (value, record) => {
                          return (
                            <Text style={{ color: record.min ? "red" : "" }}>
                              {Num.format(value ?? 0)}
                            </Text>
                          );
                        },
                      },
                    ]}
                  />

                  <Input.TextArea
                    placeholder="Catatan"
                    defaultValue={props.hook.state.note ?? ""}
                    onChange={(e) => {
                      props.hook.setState({
                        ...props.hook.state,
                        note: e.target.value,
                      });
                    }}
                  />
                  <Button type="primary" size="large" onClick={submitForm}>
                    Submit
                  </Button>
                </>
              );
            }
          })()}
        </Flex>
      </Spin>
    </>
  );
}
