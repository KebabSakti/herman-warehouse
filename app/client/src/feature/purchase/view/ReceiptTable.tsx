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
  notification,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { useContext, useEffect } from "react";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { purchaseCreateSchema } from "../model/purchase_type";
import { PurchaseCreateProps } from "./PurchaseCreate";
import { usePurchaseHook } from "./PurchaseHook";
import { ReceiptTableTag } from "./ReceiptTableHook";
import { useNavigate } from "react-router-dom";

export function ReceiptTable(props: PurchaseCreateProps) {
  const { Text } = Typography;
  const navigate = useNavigate();
  const { auth, purchaseController } = useContext(Dependency)!;
  const purchase = usePurchaseHook(purchaseController);
  const inventories = props.hook.state.item.filter(
    (a) => a.tag == ReceiptTableTag.Inventory
  );
  const payments = props.hook.state.item.filter(
    (a) => a.tag == ReceiptTableTag.Payment
  );
  const tableData = inventories.concat(payments);

  async function submitForm(): Promise<void> {
    const id = randomID();
    const values: any = {
      id: id,
      supplierId: props.hook.state.supplier?.id,
      fee: props.hook.state.fee,
      printed: props.hook.state.created,
      note: props.hook.state.note,
      inventory: inventories.map((a) => {
        return { purchaseId: id, productId: a.id, qty: a.qty, price: a.price };
      }),
      payment: payments.map((a) => {
        return { purchaseId: id, note: a.name, amount: a.total };
      }),
    };

    await purchaseCreateSchema
      .validate(values, { strict: true, abortEarly: false })
      .then(async () => {
        purchase.create(values, { token: auth.state.data! });
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
          <Row gutter={[0, 4]} justify={{ xl: "space-between" }}>
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
                      key: "payment",
                      label: "Biaya lain",
                      icon: <DollarOutlined />,
                      disabled: inventories.length == 0,
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
                <Col xs={{ flex: "100%" }} md={{ flex: "35%" }}>
                  <Space.Compact block>
                    <Input
                      readOnly
                      placeholder="Supplier"
                      size="large"
                      value={props.hook.state.supplier?.name ?? ""}
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
                <Col xs={{ flex: "100%" }} md={{ flex: "25%" }}>
                  <DatePicker
                    size="large"
                    placeholder="Tanggal nota"
                    style={{ display: "block" }}
                    onChange={(_, dateString) => {
                      props.hook.created(dateString.toString());
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
            dataSource={tableData}
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
                onCell: (record) => {
                  if (record.tag == ReceiptTableTag.Payment) {
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
          {(() => {
            if (inventories.length > 0) {
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
                        <Col>{Num.format(props.hook.state.total.margin)}</Col>
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
                  </Row>
                  <Input.TextArea
                    placeholder="Catatan"
                    defaultValue={props.hook.state.note ?? ""}
                    onChange={(e) => {
                      props.hook.note(e.target.value);
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
