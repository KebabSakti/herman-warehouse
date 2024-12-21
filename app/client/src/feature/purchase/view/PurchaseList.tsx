import { DeleteFilled } from "@ant-design/icons";
import {
  Result as AntdResult,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Input,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Skeleton,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { debounce } from "../../../helper/debounce";
import { Num } from "../../../helper/num";
import { Purchase } from "../model/purchase_model";
import { usePurchaseHook } from "./PurchaseHook";

export function PurchaseList() {
  const { auth, purchaseController } = useContext(Dependency)!;
  const purchase = usePurchaseHook(purchaseController);
  const result = purchase.state.data as Result<Purchase[]> | null;
  const location = useLocation();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [search, setSearch] = useSearchParams();
  const initParam = {
    page: "1",
    limit: "10",
  };
  const param: any =
    search.size == 0 ? initParam : Object.fromEntries(search.entries());

  const searchRecord = debounce((message: string) => {
    const searchValue = {
      ...param,
      ...initParam,
      search: message,
    };

    if (message.length == 0) {
      delete searchValue.search;
    }

    setSearch(searchValue);
  }, 500);

  useEffect(() => {
    setSearch(param);
  }, []);

  useEffect(() => {
    if (search.size >= 2) {
      purchase.list(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (purchase.state.status == "complete" && purchase.state.error != null) {
      notification.error({
        message: "Error",
        description: purchase.state.error.message,
      });
    }

    if (
      purchase.state.action == "remove" &&
      purchase.state.status == "complete" &&
      purchase.state.error == null
    ) {
      purchase.list(param, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Data berhasil dihapus",
      });
    }
  }, [purchase.state]);

  return (
    <>
      <Outlet />
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Title level={4}>Daftar Nota Masuk</Title>
        <Card>
          {(() => {
            if (purchase.state.error != null) {
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
                        setSearch(initParam);
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
                  <Row gutter={[0, 6]} justify={{ xl: "space-between" }}>
                    <Col xs={24} md={6} xl={4}>
                      <Button
                        block
                        color="primary"
                        variant="solid"
                        size="large"
                        onClick={() => {
                          navigate("/app/inventory/create", {
                            state: {
                              from: location.pathname + location.search,
                            },
                          });
                        }}
                      >
                        Buat Nota Baru
                      </Button>
                    </Col>
                    <Col xs={24} md={18} xl={20}>
                      <Row gutter={[6, 6]} justify={{ xl: "end" }}>
                        <Col>
                          <RangePicker
                            size="large"
                            defaultValue={
                              param.start == null && param.end == null
                                ? undefined
                                : [dayjs(param.start), dayjs(param.start)]
                            }
                            onChange={(date, dateString) => {
                              const dateRangeValue = {
                                ...param,
                                ...initParam,
                                start: dateString[0],
                                end: dateString[1],
                              };

                              if (date == null) {
                                delete dateRangeValue.start;
                                delete dateRangeValue.end;
                              }

                              setSearch(dateRangeValue);
                            }}
                          />
                        </Col>
                        <Col>
                          <Input.Search
                            allowClear
                            placeholder="Kode / nama supplier"
                            size="large"
                            defaultValue={param.search}
                            onChange={(e) => {
                              searchRecord(e.target.value);
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {(() => {
                    const datas = result.data;

                    return (
                      <Flex vertical gap="middle">
                        <Table
                          bordered
                          loading={purchase.state.status == "loading"}
                          style={{ overflowX: "scroll" }}
                          pagination={false}
                          dataSource={
                            datas.length == 0
                              ? []
                              : datas.map((e, i) => {
                                  return { ...e, key: i };
                                })
                          }
                          columns={[
                            {
                              title: "Kode",
                              dataIndex: "code",
                              minWidth: 60,
                              render: (_, record) => (
                                <>
                                  <Link
                                    to={`/app/inventory/read/${record.id}`}
                                    state={{
                                      from: location.pathname + location.search,
                                    }}
                                  >
                                    {record.code}
                                  </Link>
                                </>
                              ),
                            },
                            {
                              title: "Supplier",
                              dataIndex: "supplierName",
                              minWidth: 60,
                            },
                            {
                              title: "Total",
                              dataIndex: "total",
                              minWidth: 60,
                              render: (value) => {
                                return <>{Num.format(value)}</>;
                              },
                            },
                            {
                              title: "Fee %",
                              dataIndex: "fee",
                              minWidth: 60,
                              render: (_, record) => {
                                return (
                                  <>
                                    {Num.format(record.margin)} ({record.fee}%)
                                  </>
                                );
                              },
                            },
                            {
                              title: "Biaya",
                              dataIndex: "other",
                              minWidth: 60,
                              render: (value) => {
                                return <>{Num.format(value)}</>;
                              },
                            },
                            {
                              title: "Hutang",
                              dataIndex: "balance",
                              minWidth: 60,
                              render: (value) => {
                                return <>{Num.format(value)}</>;
                              },
                            },
                            {
                              title: "Tanggal",
                              dataIndex: "printed",
                              minWidth: 60,
                              render: (value) => {
                                return <>{dayjs(value).format("DD-MM-YYYY")}</>;
                              },
                            },
                            {
                              render: (_, e) => (
                                <>
                                  <Popconfirm
                                    placement="topLeft"
                                    title="Data akan dihapus"
                                    description="Proses ini tidak dapat dikembalikan, lanjutkan?"
                                    okText="Ya"
                                    cancelText="Batal"
                                    onConfirm={() => {
                                      purchase.remove(e.id, {
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
                                </>
                              ),
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
                            setSearch({
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
        </Card>
      </Flex>
    </>
  );
}
