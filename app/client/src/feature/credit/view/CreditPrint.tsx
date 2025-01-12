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
import { useCreditHook } from "./CreditHook";

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

export function CreditPrint() {
  const { auth, creditController } = useContext(Dependency)!;
  const credit = useCreditHook(creditController);
  const { start, end } = useParams();

  useEffect(() => {
    if (
      start &&
      end &&
      auth.state.data &&
      credit.state.action == "idle" &&
      credit.state.status == "idle"
    ) {
      credit.list({ start: start, end: end }, { token: auth.state.data });
    }
  }, [credit.state, auth.state]);

  if (credit.state.status == "complete" && credit.state.data?.data) {
    const creditData = credit.state.data;

    return (
      <PDFViewer
        showToolbar={false}
        style={{ width: "100%", height: "100vh", border: "none" }}
      >
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.container}>
              <Text style={styles.heading}>PIUTANG</Text>
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
                    KUSTOMER
                  </Text>
                  <Text
                    style={[styles.tableItem, styles.th, { textAlign: "left" }]}
                  >
                    NO HP
                  </Text>
                  <Text style={[styles.tableItem, styles.th]}>BELUM LUNAS</Text>
                  <Text style={[styles.tableItem, styles.th]}>LUNAS</Text>
                  <Text style={[styles.tableItem, styles.th]}>NOTA</Text>
                  <Text
                    style={[
                      styles.tableItem,
                      styles.th,
                      { textAlign: "right" },
                    ]}
                  >
                    PIUTANG
                  </Text>
                </View>
                <View>
                  {creditData.data?.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {i + 1}
                      </Text>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {row.name}
                      </Text>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {row.phone}
                      </Text>
                      <Text style={[styles.tableItem]}>{row.unpaid}</Text>
                      <Text style={[styles.tableItem]}>{row.paid}</Text>
                      <Text style={[styles.tableItem]}>{row.nota}</Text>
                      <Text style={[styles.tableItem, { textAlign: "right" }]}>
                        {Num.format(row.total)}
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
                      NOTA BELUM LUNAS
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {creditData.unpaid}
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
                      NOTA LUNAS
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {creditData.paid}
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
                      TOTAL NOTA
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {creditData.nota}
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
                      TOTAL PIUTANG
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(creditData.total)}
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

  if (credit.state.status == "complete" && credit.state.data?.data) {
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
