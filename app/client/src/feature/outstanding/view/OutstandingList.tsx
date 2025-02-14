import { PrinterFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Input,
  notification,
  Row,
  Spin,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { debounce } from "../../../helper/debounce";
import { Num } from "../../../helper/num";
import { useOutstandingHook } from "./OutstandingHook";

export function OutstandingList() {
  const { auth, outstandingController } = useContext(Dependency)!;
  const outstanding = useOutstandingHook(outstandingController);
  const { RangePicker } = DatePicker;
  const [search, setSearch] = useSearchParams();
  const initParam = {
    start: dayjs().format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  };
  const param: any =
    search.size == 0 ? initParam : Object.fromEntries(search.entries());
  const searchRecord = debounce((message: string) => {
    const searchValue = {
      ...param,
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
      outstanding.list(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (
      outstanding.state.status == "complete" &&
      outstanding.state.error != null
    ) {
      notification.error({
        message: "Error",
        description: outstanding.state.error.message,
      });
    }
  }, [outstanding.state]);

  return (
    <>
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Title level={4}>Laporan Hutang</Title>
        <Spin spinning={outstanding.state.status == "loading"}>
          <Card>
            <Flex vertical gap="small">
              <Row gutter={[4, 4]} justify={{ xl: "space-between" }}>
                <Col xs={{ flex: "100%" }} md={{ flex: "20%" }}>
                  <Button
                    icon={<PrinterFilled />}
                    color="primary"
                    size="large"
                    variant="solid"
                    onClick={() => {
                      window.open(
                        `/print/outstanding/${param.start}/to/${param.end}`,
                        "_blank"
                      );
                    }}
                  >
                    Print Laporan
                  </Button>
                </Col>
                <Col xs={{ flex: "100%" }} md={{ flex: "80%" }}>
                  <Row gutter={[4, 4]} justify="end">
                    <Col>
                      <RangePicker
                        size="large"
                        defaultValue={[dayjs(param.start), dayjs(param.end)]}
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
                if (outstanding.state.data) {
                  const outstandingData = outstanding.state.data;

                  return (
                    <Table
                      bordered
                      style={{ overflowX: "scroll" }}
                      pagination={{
                        simple: true,
                        position: ["bottomCenter"],
                        pageSize: 10,
                      }}
                      footer={() => {
                        return (
                          <>
                            <Flex
                              vertical
                              gap="small"
                              style={{ fontWeight: "bold" }}
                            >
                              <Flex justify="space-between">
                                <div>NOTA BELUM LUNAS</div>
                                <div>{outstandingData.unpaid}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>NOTA LUNAS</div>
                                <div>{outstandingData.paid}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>TOTAL NOTA</div>
                                <div>{outstandingData.nota}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>TOTAL HUTANG</div>
                                <div>{Num.format(outstandingData.total)}</div>
                              </Flex>
                            </Flex>
                          </>
                        );
                      }}
                      dataSource={outstandingData.data.map((e, i) => {
                        return { key: i, ...e };
                      })}
                      columns={[
                        {
                          title: "Supplier",
                          dataIndex: "name",
                          minWidth: 60,
                        },
                        {
                          title: "No Hp",
                          dataIndex: "phone",
                          minWidth: 60,
                        },
                        {
                          title: "Belum Lunas",
                          dataIndex: "unpaid",
                          minWidth: 60,
                        },
                        {
                          title: "Lunas",
                          dataIndex: "paid",
                          minWidth: 60,
                        },
                        {
                          title: "Nota",
                          dataIndex: "nota",
                          minWidth: 60,
                        },
                        {
                          title: "Hutang",
                          dataIndex: "total",
                          minWidth: 60,
                          render: (value) => Num.format(value),
                        },
                      ]}
                    />
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
