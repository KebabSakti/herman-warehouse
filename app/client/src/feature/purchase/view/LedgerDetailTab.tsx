import {
  CloseCircleFilled,
  DeleteFilled,
  PrinterFilled,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { SERVER } from "../../../common/common";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";
import { ledgerCreateSchema } from "../../ledger/model/ledger_type";
import { useLedgerHook } from "../../ledger/view/LedgerHook";
import { Purchase } from "../model/purchase_model";
import { PurchaseHookType } from "./PurchaseHook";

export function LedgerDetailTab({
  purchaseHook,
}: {
  purchaseHook: PurchaseHookType;
}) {
  const { auth, ledgerController } = useContext(Dependency)!;
  const ledger = useLedgerHook(ledgerController);
  const [form] = Form.useForm();
  const { Text } = Typography;
  const [attachment, setAttachment] = useState<UploadFile<File> | null>();
  const purchase = purchaseHook.state.data as Purchase;
  const ledgerData = purchase.ledger?.sort(
    (a, b) => dayjs(b.created).valueOf() - dayjs(a.created).valueOf()
  );

  console.log(ledgerData);

  useEffect(() => {
    if (ledger.state.status == "complete" && ledger.state.error != null) {
      notification.error({
        message: "Error",
        description: ledger.state.error.message,
      });
    }

    if (
      ledger.state.action == "create" &&
      ledger.state.status == "complete" &&
      ledger.state.error == null
    ) {
      form.resetFields();
      purchaseHook.read(purchase.id, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Proses berhasil",
      });
    }

    if (
      ledger.state.action == "remove" &&
      ledger.state.status == "complete" &&
      ledger.state.error == null
    ) {
      purchaseHook.read(purchase.id, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Proses berhasil",
      });
    }
  }, [ledger.state]);

  return (
    <>
      <Spin spinning={ledger.state.status == "loading"}>
        <Space direction="vertical" style={{ width: "100%" }}>
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
              <Row justify="space-between">
                <Col>No. Hp</Col>
                <Col>{purchase.supplierPhone}</Col>
              </Row>
            </Col>
            <Col
              span={24}
              style={{ borderBottom: "1px solid #efefef", paddingBottom: 18 }}
            >
              <Row justify="space-between">
                <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Total
                </Col>
                <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Rp {Num.format(purchase.total)}
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between">
                <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Sisa Hutang
                </Col>
                <Col style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Rp {Num.format(purchase.balance)}
                </Col>
              </Row>
            </Col>
          </Row>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Table
              bordered
              size="small"
              loading={false}
              style={{ overflowX: "scroll" }}
              pagination={false}
              dataSource={
                ledgerData?.map((e, i) => {
                  return { key: i, ...e };
                }) ?? []
              }
              columns={[
                {
                  title: "No",
                  dataIndex: "key",
                  render: (value) => <>{value + 1}</>,
                },
                {
                  title: "Tanggal",
                  dataIndex: "created",
                  render: (value) => <>{dayjs(value).format("DD-MM-YYYY")}</>,
                },
                {
                  title: "Lampiran",
                  dataIndex: "file",
                  render: (value) => (
                    <>
                      {value == undefined ? (
                        "-"
                      ) : (
                        <Button
                          color="primary"
                          variant="link"
                          size="small"
                          href={`${SERVER}/${value}`}
                          target="_blank"
                          onClick={() => {
                            //
                          }}
                        >
                          [Lampiran]
                        </Button>
                      )}
                    </>
                  ),
                },
                {
                  title: "Catatan",
                  dataIndex: "note",
                  render: (value) => <>{value ?? "-"}</>,
                },
                {
                  title: "Setor",
                  dataIndex: "amount",
                  render: (value) => <>{Num.format(value)}</>,
                },
                {
                  title: "Sisa Hutang",
                  dataIndex: "outstanding",
                  render: (value) => <>{Num.format(value)}</>,
                },
                {
                  render: (_, record) =>
                    !record.dp && (
                      <Flex justify="center">
                        <Popconfirm
                          placement="topLeft"
                          title="Data akan dihapus"
                          description="Proses ini tidak dapat dikembalikan, lanjutkan?"
                          okText="Ya"
                          cancelText="Batal"
                          onConfirm={() => {
                            ledger.remove(record.id, {
                              token: auth.state.data!,
                            });
                          }}
                        >
                          <Button
                            icon={<DeleteFilled />}
                            color="danger"
                            size="small"
                            variant="solid"
                          />
                        </Popconfirm>
                      </Flex>
                    ),
                },
              ]}
            />
            {purchase.balance > 0 && (
              <Form
                size="large"
                form={form}
                onFinish={async (values) => {
                  const payload = {
                    id: randomID(),
                    purchaseId: purchase.id,
                    supplierId: purchase.supplierId,
                    amount: values.amount,
                    outstanding:
                      values.amount &&
                      values.amount > 0 &&
                      purchase.balance - values.amount,
                    file: values.file,
                    note: values.note,
                    printed: values.printed,
                  };

                  await ledgerCreateSchema
                    .validate(payload)
                    .then(() => {
                      ledger.create(payload, {
                        token: auth.state.data!,
                      });
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
                }}
              >
                <Flex gap="small">
                  <Form.Item noStyle name="printed">
                    <DatePicker
                      placeholder="Tanggal"
                      style={{ display: "block", width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item noStyle name="amount">
                    <InputNumber
                      placeholder="Jumlah"
                      min={1}
                      max={purchase.balance ?? 0}
                      style={{ display: "block", width: "100%" }}
                      formatter={(value) => {
                        const formatted = Num.format(value ?? 0);
                        return formatted;
                      }}
                    />
                  </Form.Item>
                  <Form.Item noStyle name="note">
                    <Input placeholder="Catatan" />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    name="file"
                    valuePropName="file"
                    getValueFromEvent={(e) => {
                      return e.file;
                    }}
                  >
                    {attachment ? (
                      <Button
                        icon={<CloseCircleFilled />}
                        iconPosition="end"
                        onClick={() => {
                          setAttachment(null);
                        }}
                      >
                        1 File
                      </Button>
                    ) : (
                      <Upload
                        showUploadList={false}
                        name="file"
                        maxCount={1}
                        beforeUpload={() => false}
                        onChange={(e) => {
                          setAttachment(e.file);
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Lampiran</Button>
                      </Upload>
                    )}
                  </Form.Item>
                  <Form.Item noStyle>
                    <Button htmlType="submit" type="primary" size="large">
                      Submit
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            )}
          </Space>
          <Button
            block
            icon={<PrinterFilled />}
            color="primary"
            size="large"
            variant="solid"
            target="_blank"
            href={`/print/ledger/${purchase.id}`}
          >
            Print
          </Button>
        </Space>
      </Spin>
    </>
  );
}
