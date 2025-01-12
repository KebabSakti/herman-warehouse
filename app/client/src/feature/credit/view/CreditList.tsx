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
import { useCreditHook } from "./CreditHook";

export function CreditList() {
  const { auth, creditController } = useContext(Dependency)!;
  const credit = useCreditHook(creditController);
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
      credit.list(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (credit.state.status == "complete" && credit.state.error != null) {
      notification.error({
        message: "Error",
        description: credit.state.error.message,
      });
    }
  }, [credit.state]);

  return (
    <>
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Title level={4}>Laporan Piutang</Title>
        <Spin spinning={credit.state.status == "loading"}>
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
                        `/print/credit/${param.start}/to/${param.end}`,
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
                if (credit.state.data) {
                  const CreditData = credit.state.data;

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
                                <div>{CreditData.unpaid}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>NOTA LUNAS</div>
                                <div>{CreditData.paid}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>TOTAL NOTA</div>
                                <div>{CreditData.nota}</div>
                              </Flex>
                              <Flex justify="space-between">
                                <div>TOTAL PIUTANG</div>
                                <div>{Num.format(CreditData.total)}</div>
                              </Flex>
                            </Flex>
                          </>
                        );
                      }}
                      dataSource={CreditData.data.map((e, i) => {
                        return { key: i, ...e };
                      })}
                      columns={[
                        {
                          title: "Kustomer",
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
                          title: "Piutang",
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
