import {
  ProductOutlined,
  DollarOutlined,
  PlusOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import {
  Spin,
  Flex,
  Row,
  Col,
  Dropdown,
  Button,
  Space,
  Input,
  DatePicker,
  Table,
  InputNumber,
} from "antd";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { InvoiceCreateProps } from "./InvoiceCreate";

export function InvoiceTable(props: InvoiceCreateProps) {
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
                      key: "payment",
                      label: "DP",
                      icon: <DollarOutlined />,
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
                      value={""}
                    />
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        // props.setModal("supplier");
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
                        created: dateString.toString(),
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
                          props.hook.removeItem(record);
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
                        // props.hook.modItem({ ...record, qty: value });
                      }}
                    />
                  );
                },
              },
              {
                title: "Harga",
                dataIndex: "price",
                // onCell: (record) => {
                //   if (record.tag == ReceiptTableTag.Payment) {
                //     return { colSpan: 0 };
                //   }

                //   return {};
                // },
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
                        // props.hook.modItem({ ...record, price: value });
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
            if (props.hook.state.item.length > 0) {
              return (
                <>
                  <Row gutter={[0, 8]}>
                    <Col span={24}>
                      <Row justify="space-between">
                        <Col>Total Item</Col>
                        <Col>{Num.format(0)}</Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row justify="space-between">
                        <Col>DP (Down Payment)</Col>
                        <Col>{Num.format(0)}</Col>
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
                    defaultValue={""}
                    onChange={(e) => {
                      // props.hook.note(e.target.value);
                    }}
                  />
                  <Button type="primary" size="large" onClick={() => {}}>
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
