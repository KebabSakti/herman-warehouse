import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { useProfitHook } from "./ProfitHook";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#fff",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
    letterSpacing: 6,
  },
  subHeadingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  subHeading: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  table: {
    width: "100%",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    padding: "4px 0px",
    borderBottom: "1px solid #000",
  },
  tableItem: {
    fontSize: 8,
    textAlign: "center",
    width: "100%",
  },
  th: {
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  note: {
    fontSize: 8,
  },
});

export function ProfitPrint() {
  const { auth, profitController } = useContext(Dependency)!;
  const profit = useProfitHook(profitController);
  const { start, end } = useParams();

  useEffect(() => {
    if (
      start &&
      end &&
      auth.state.data &&
      profit.state.action == "idle" &&
      profit.state.status == "idle"
    ) {
      profit.list({ start: start, end: end }, { token: auth.state.data });
    }
  }, [profit.state, auth.state]);

  if (profit.state.status == "complete" && profit.state.data?.data) {
    const profitData = profit.state.data;

    return (
      <PDFViewer
        showToolbar={false}
        style={{ width: "100%", height: "100vh", border: "none" }}
      >
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.container}>
              <Text style={styles.heading}>PROFIT</Text>
              <View style={styles.subHeadingContainer}>
                <Text style={styles.subHeading}>PERIODE</Text>
                <Text style={styles.subHeading}>
                  {dayjs(start).format("DD-MM-YYYY")} /{" "}
                  {dayjs(end).format("DD-MM-YYYY")}
                </Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableItem, styles.th, { textAlign: "left" }]}
                  >
                    NO
                  </Text>
                  <Text
                    style={[styles.tableItem, styles.th, { textAlign: "left" }]}
                  >
                    TANGGAL
                  </Text>
                  <Text
                    style={[
                      styles.tableItem,
                      styles.th,
                      { textAlign: "right" },
                    ]}
                  >
                    TOTAL NOTA
                  </Text>
                  <Text
                    style={[
                      styles.tableItem,
                      styles.th,
                      { textAlign: "right" },
                    ]}
                  >
                    TOTAL PROFIT
                  </Text>
                </View>
                <View>
                  {profitData.data.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {i + 1}
                      </Text>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {dayjs(row.printed).format("DD-MM-YYYY")}
                      </Text>
                      <Text style={[styles.tableItem, { textAlign: "right" }]}>
                        {Num.format(row.total)}
                      </Text>
                      <Text style={[styles.tableItem, { textAlign: "right" }]}>
                        {Num.format(row.profit)}
                      </Text>
                    </View>
                  ))}
                </View>
                <View>
                  <View style={[styles.tableRow, { border: "none" }]}>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "left" },
                      ]}
                    >
                      TOTAL NOTA
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(profitData.total)}
                    </Text>
                  </View>
                  <View style={[styles.tableRow, { border: "none" }]}>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "left" },
                      ]}
                    >
                      TOTAL PROFIT
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(profitData.profit)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  }

  if (profit.state.status == "complete" && profit.state.data?.data) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Data tidak ditemukan
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      LOADING...
    </div>
  );
}
