import { DeleteFilled, EditFilled } from "@ant-design/icons";
import {
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
  Spin,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { SERVER } from "../../../common/common";
import { Dependency } from "../../../component/App";
import { ImagePreview } from "../../../component/ImagePreview";
import { debounce } from "../../../helper/debounce";
import { Num } from "../../../helper/num";
import { ExpenseSummary } from "../model/expense_model";
import { useExpenseHook } from "./ExpenseHook";

export function ExpenseList() {
  const { auth, expenseController } = useContext(Dependency)!;
  const expense = useExpenseHook(expenseController);
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
      expense.list(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (expense.state.status == "complete" && expense.state.error != null) {
      notification.error({
        message: "Error",
        description: expense.state.error.message,
      });
    }

    if (
      expense.state.action == "remove" &&
      expense.state.status == "complete" &&
      expense.state.error == null
    ) {
      expense.list(param, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Data berhasil dihapus",
      });
    }
  }, [expense.state]);

  return (
    <>
      <Outlet />
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Title level={4}>Daftar Pengeluaran</Title>
        <Spin spinning={expense.state.status == "loading"}>
          <Card>
            <Flex vertical gap="small">
              <Row gutter={[4, 4]} justify={{ xl: "space-between" }}>
                <Col xs={{ flex: "100%" }} md={{ flex: "20%" }}>
                  <Button
                    block
                    color="primary"
                    variant="solid"
                    size="large"
                    onClick={() => {
                      navigate("/app/expense/create", {
                        state: {
                          from: location.pathname + location.search,
                        },
                      });
                    }}
                  >
                    Tambah Data
                  </Button>
                </Col>
                <Col xs={{ flex: "100%" }} md={{ flex: "80%" }}>
                  <Row gutter={[4, 4]} justify="end">
                    <Col>
                      <RangePicker
                        size="large"
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
                        placeholder="Nama transaksi"
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
                if (expense.state.data) {
                  const expenseData = expense.state.data as ExpenseSummary;

                  return (
                    <Flex vertical gap="middle">
                      <Table
                        bordered
                        style={{ overflowX: "scroll" }}
                        pagination={false}
                        dataSource={expenseData.data.map((e, i) => {
                          return { ...e, key: i };
                        })}
                        columns={[
                          {
                            title: "Catatan",
                            dataIndex: "title",
                            minWidth: 60,
                          },
                          {
                            title: "Nilai",
                            dataIndex: "amount",
                            minWidth: 60,
                            render: (value) => Num.format(value),
                          },
                          {
                            title: "Lampiran",
                            dataIndex: "file",
                            minWidth: 60,
                            render: (value) => {
                              return (
                                <>
                                  {value && (
                                    <ImagePreview src={`${SERVER}/${value}`} />
                                  )}
                                </>
                              );
                            },
                          },
                          {
                            title: "Tanggal",
                            dataIndex: "printed",
                            minWidth: 60,
                            render: (value) =>
                              dayjs(value).format("DD-MM-YYYY"),
                          },
                          {
                            dataIndex: "id",
                            render: (value) => (
                              <>
                                <Flex gap={4}>
                                  <Button
                                    icon={<EditFilled />}
                                    color="primary"
                                    size="small"
                                    variant="solid"
                                    onClick={() => {
                                      navigate(`/app/expense/edit/${value}`, {
                                        state: {
                                          from:
                                            location.pathname + location.search,
                                        },
                                      });
                                    }}
                                  />
                                  <Popconfirm
                                    placement="topLeft"
                                    title="Data akan dihapus"
                                    description="Proses ini tidak dapat dikembalikan, lanjutkan?"
                                    okText="Ya"
                                    cancelText="Batal"
                                    onConfirm={() => {
                                      expense.remove(value, {
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
                              </>
                            ),
                          },
                        ]}
                      />
                      <Pagination
                        simple
                        align="center"
                        showSizeChanger={false}
                        current={param.page}
                        total={expenseData.record}
                        onChange={(page) => {
                          setSearch({
                            ...param,
                            page: page.toString(),
                          });
                        }}
                      />
                    </Flex>
                  );
                }

                return <Table bordered pagination={false} dataSource={[]} />;
              })()}
            </Flex>
          </Card>
        </Spin>
      </Flex>
    </>
  );
}
