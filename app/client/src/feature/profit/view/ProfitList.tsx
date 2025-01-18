import { PrinterFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
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
import { Num } from "../../../helper/num";
import { useProfitHook } from "./ProfitHook";

export function ProfitList() {
  const { auth, profitController } = useContext(Dependency)!;
  const profit = useProfitHook(profitController);
  const { RangePicker } = DatePicker;
  const [search, setSearch] = useSearchParams();
  const initParam = {
    start: dayjs().format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  };
  const param: any =
    search.size == 0 ? initParam : Object.fromEntries(search.entries());

  useEffect(() => {
    setSearch(param);
  }, []);

  useEffect(() => {
    if (search.size >= 2) {
      profit.list(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (profit.state.status == "complete" && profit.state.error != null) {
      notification.error({
        message: "Error",
        description: profit.state.error.message,
      });
    }
  }, [profit.state]);

  return (
    <>
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Title level={4}>Laporan Profit</Title>
        <Spin spinning={profit.state.status == "loading"}>
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
                        `/print/profit/${param.start}/to/${param.end}`,
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
                  </Row>
                </Col>
              </Row>
              {(() => {
                if (profit.state.data) {
                  const profitData = profit.state.data;

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
                                <div>TOTAL NOTA</div>
                                <div>{Num.format(profitData.total)}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>TOTAL OMZET</div>
                                <div>{Num.format(profitData.profit)}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>TOTAL OPERASIONAL</div>
                                <div>{Num.format(profitData.expense)}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>TOTAL PROFIT</div>
                                <div>{Num.format(profitData.balance)}</div>
                              </Flex>
                            </Flex>
                          </>
                        );
                      }}
                      dataSource={profitData.data.map((e, i) => {
                        return { key: i, ...e };
                      })}
                      columns={[
                        {
                          title: "Tanggal",
                          dataIndex: "printed",
                          minWidth: 60,
                          render: (value) => dayjs(value).format("DD-MM-YYYY"),
                        },
                        {
                          title: "Total Nota",
                          dataIndex: "total",
                          minWidth: 60,
                          render: (value) => Num.format(value),
                        },
                        {
                          title: "Total Profit",
                          dataIndex: "profit",
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
