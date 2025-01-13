import {
  AreaChartOutlined,
  BarChartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  DatePicker,
  Flex,
  notification,
  Row,
  Skeleton,
  Spin,
  Statistic,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { useDashboardHook } from "./DashboardHook";
import { MonthlyChart } from "./MonthlyChart";

export function DashboardPage() {
  const { auth, dashboardController } = useContext(Dependency)!;
  const dashboard = useDashboardHook(dashboardController);
  const { Title } = Typography;
  const { RangePicker } = DatePicker;
  const [search, setSearch] = useSearchParams();

  const initParam = {
    start: dayjs().format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  };
  const param: any =
    search.size == 0 ? initParam : Object.fromEntries(search.entries());

  function rangePickerOnChange(date: any, dateString: any) {
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
  }

  useEffect(() => {
    setSearch(param);
  }, []);

  useEffect(() => {
    if (search.size >= 2) {
      dashboard.read(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (dashboard.state.status == "complete" && dashboard.state.error != null) {
      notification.error({
        message: "Error",
        description: dashboard.state.error.message,
      });
    }
  }, [dashboard.state]);

  return (
    <>
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={4}>Dashboard</Title>
          </Col>
          <Col xs={0} md={6}>
            <RangePicker size="large" onChange={rangePickerOnChange} />
          </Col>
        </Row>
        <Spin spinning={dashboard.state.status == "loading"}>
          <Card>
            {(() => {
              if (dashboard.state.data && !dashboard.state.error) {
                const dashboardData = dashboard.state.data;

                return (
                  <Row gutter={[0, 16]} justify="space-between">
                    <Col xs={24} md={0}>
                      <RangePicker
                        size="large"
                        style={{ width: "100%" }}
                        onChange={rangePickerOnChange}
                      />
                    </Col>
                    <Col>
                      <Statistic
                        prefix={<DollarOutlined />}
                        title="PROFIT"
                        value={`Rp ${Num.format(
                          dashboardData.statistic.profit ?? 0
                        )}`}
                      />
                    </Col>
                    <Col>
                      <Statistic
                        prefix={<BarChartOutlined />}
                        title="NOTA SUPPLIER"
                        value={`Rp ${Num.format(
                          dashboardData.statistic.supplier ?? 0
                        )}`}
                      />
                    </Col>
                    <Col>
                      <Statistic
                        prefix={<AreaChartOutlined />}
                        title="NOTA KUSTOMER"
                        value={`Rp ${Num.format(
                          dashboardData.statistic.customer ?? 0
                        )}`}
                      />
                    </Col>
                    <Col
                      xs={0}
                      md={24}
                      style={{
                        border: "1px solid #ececec",
                        margin: "10px 0px",
                      }}
                    ></Col>
                    <Col xs={0} md={24}>
                      <MonthlyChart dashboard={dashboardData} />
                    </Col>
                  </Row>
                );
              }

              return (
                <>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </>
              );
            })()}
          </Card>
        </Spin>
      </Flex>
    </>
  );
}
