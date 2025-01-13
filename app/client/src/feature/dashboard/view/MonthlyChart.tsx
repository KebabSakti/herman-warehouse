import Chart from "react-apexcharts";
import { Num } from "../../../helper/num";
import { Dashboard } from "../model/dashboard_model";
import dayjs from "dayjs";

export function MonthlyChart({ dashboard }: { dashboard: Dashboard }) {
  const year = dayjs().format("YYYY");

  return (
    <div>
      <h2>Profit {year}</h2>
      <Chart
        type="line"
        width="100%"
        height={400}
        options={{
          chart: {
            id: `PROFIT-${year}`,
          },
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Des",
            ],
          },
          yaxis: {
            labels: {
              formatter: function (val: any) {
                return `Rp${Num.format(val)}`;
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return `Rp${Num.format(val)}`;
            },
          },
        }}
        series={[
          {
            name: "Profit",
            data: [...Array(12)].map(
              (_, i) => dashboard.monthly?.[i]?.total ?? 0
            ),
          },
        ]}
      />
    </div>
  );
}
