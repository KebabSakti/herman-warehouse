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
  Table,
  Typography,
} from "antd";
import { array, number, object, string } from "yup";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { PurchaseCreateProps } from "./PurchaseCreate";
import { ReceiptTableTag } from "./ReceiptTableHook";

export function ReceiptTable(props: PurchaseCreateProps) {
  const { Text } = Typography;
  // const { auth, purchaseController } = useContext(Dependency)!;
  const inventories = props.hook.state.item.filter(
    (a) => a.tag == ReceiptTableTag.Inventory
  );
  const payments = props.hook.state.item.filter(
    (a) => a.tag == ReceiptTableTag.Payment
  );
  const tableData = inventories.concat(payments);

  async function submitForm(): Promise<void> {
    const id = randomID();

    const values = {
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

    const schema = object({
      supplierId: string().required("Supplier tidak boleh kosong"),
      fee: number().required("Fee tidak boleh kosong"),
      printed: string().required("Tanggal tidak boleh kosong"),
      note: string().nullable(),
      inventory: array(
        object({
          productId: string(),
          qty: number(),
          price: number(),
        })
      )
        .min(1)
        .required("Harap tambahkan minimal 1 produk"),
      payment: array(
        object({
          note: string(),
          amount: number(),
        })
      ).optional(),
    });

    await schema
      .validate(values, { strict: true, abortEarly: false })
      .then(() => {
        console.log(values);
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
                  props.setModal(key);
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
              <Col xs={24} md={6} xl={6}>
                <DatePicker
                  size="large"
                  placeholder="Tanggal nota"
                  style={{ display: "block" }}
                  onChange={(_, dateString) => {
                    props.hook.created(dateString.toString());
                  }}
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
          dataSource={tableData}
          footer={(records) => {
            if (records.length == 0) {
              return null;
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
    </>
  );
}
