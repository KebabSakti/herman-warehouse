import {
  DeleteFilled,
  DollarOutlined,
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
import { invoiceCreateSchema } from "../model/invoice_type";
import { InvoiceCreateProps } from "./InvoiceCreate";
import { useInvoiceHook } from "./InvoiceHook";

export function InvoiceTable(props: InvoiceCreateProps) {
  const { auth, invoiceController } = useContext(Dependency)!;
  const invoice = useInvoiceHook(invoiceController);
  const navigate = useNavigate();
  const { Text } = Typography;

  async function submitForm(): Promise<void> {
    const param = props.hook.state;

    await invoiceCreateSchema
      .validate(param)
      .then(async () => {
        invoice.create(
          {
            id: param.id,
            customerId: param.customerId,
            customerName: param.customerName,
            customerPhone: param.customerPhone,
            customerAddress: param.customerAddress,
            code: param.code,
            note: param.note,
            total: param.total,
            printed: param.printed!,
            item: param.item,
            installment: param.installment,
          },
          { token: auth.state.data! }
        );
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
      invoice.state.action == "create" &&
      invoice.state.status == "complete"
    ) {
      if (invoice.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Proses berhasil",
        });

        navigate(-1);
      } else {
        notification.error({
          message: "Error",
          description: invoice.state.error.message,
        });
      }
    }
  }, [invoice.state]);

  return (
    <>
      <Spin spinning={false}>
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
                      label: "Setor",
                      icon: <DollarOutlined />,
                      disabled:
                        props.hook.state.item.length == 0 ||
                        props.hook.state.installment != undefined,
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
                      placeholder="Kustomer"
                      size="large"
                      value={props.hook.state.customerName}
                    />
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        props.setModal("customer");
                      }}
                    />
                  </Space.Compact>
                </Col>
                <Col xs={{ flex: "100%" }} md={{ flex: "30%" }}>
                  <DatePicker
                    size="large"
                    placeholder="Tanggal nota"
                    style={{ display: "block" }}
                    onChange={(_, dateString) => {
                      props.hook.setState({
                        ...props.hook.state,
                        printed: dateString.toString(),
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
            dataSource={props.hook.state.item.map((e, i) => ({
              ...e,
              key: i,
            }))}
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
                          props.hook.changeItem({ ...record, qty: 0 });
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
                render: (_, record) => {
                  const item = props.hook.state.item.find(
                    (a) => a.stockId == record.stockId
                  );

                  return (
                    <InputNumber
                      placeholder="Quantity"
                      min={0}
                      style={{ display: "block", width: "100%" }}
                      value={item?.qty ?? 0}
                      formatter={(value) => {
                        const formatted = Num.format(value ?? 0);
                        return formatted;
                      }}
                      onChange={(value) => {
                        const qty = value ?? 0;
                        const total = qty * record.price;

                        props.hook.changeItem({
                          ...record,
                          qty: qty,
                          total: total,
                        });
                      }}
                    />
                  );
                },
              },
              {
                title: "Harga",
                dataIndex: "price",
                render: (value) => {
                  return Num.format(value);
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
            if (props.hook.state.item.length > 0) {
              const totalItem = props.hook.state.item.reduce(
                (a, b) => a + b.total,
                0
              );
              const totalInstallment = props.hook.state.installment?.reduce(
                (a, b) => a + b.amount,
                0
              );

              return (
                <>
                  <Row gutter={[0, 8]}>
                    <Col span={24}>
                      <Row justify="space-between">
                        <Col>Total Item</Col>
                        <Col>{Num.format(totalItem)}</Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row justify="space-between">
                        <Col>
                          Setor
                          {props.hook.state.installment == undefined ? (
                            ""
                          ) : (
                            <Button
                              color="danger"
                              variant="link"
                              size="small"
                              onClick={() => {
                                props.hook.changeInstallment(null);
                              }}
                            >
                              [Hapus]
                            </Button>
                          )}
                        </Col>
                        <Col>{Num.format(totalInstallment ?? 0)}</Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row justify="space-between">
                        <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                          Total
                        </Col>
                        <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {Num.format(props.hook.state.total)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Input.TextArea
                    placeholder="Catatan"
                    value={props.hook.state.note ?? ""}
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
