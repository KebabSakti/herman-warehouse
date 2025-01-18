import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { useSaleHook } from "./SaleHook";
import dayjs from "dayjs";
import { PRINT_STYLE } from "../../../common/common";
import logo from "../../../asset/logo-main.png";

const styles = StyleSheet.create(PRINT_STYLE);

export function SalePrint() {
  const { auth, saleController } = useContext(Dependency)!;
  const sale = useSaleHook(saleController);
  const { start, end } = useParams();

  useEffect(() => {
    if (
      start &&
      end &&
      auth.state.data &&
      sale.state.action == "idle" &&
      sale.state.status == "idle"
    ) {
      sale.list({ start: start, end: end }, { token: auth.state.data });
    }
  }, [sale.state, auth.state]);

  if (sale.state.status == "complete" && sale.state.data?.data) {
    const saleData = sale.state.data;

    return (
      <PDFViewer
        showToolbar={false}
        style={{ width: "100%", height: "100vh", border: "none" }}
      >
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.container}>
              <View style={styles.headingContainer}>
                <Image src={logo} style={styles.logo} />
                <View style={styles.container}>
                  <Text style={styles.heading}>PENJUALAN</Text>
                  <View style={styles.subHeadingContainer}>
                    <Text style={styles.subHeading}>PERIODE</Text>
                    <Text style={styles.subHeading}>
                      {dayjs(start).format("DD-MM-YYYY")} /{" "}
                      {dayjs(end).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableItem, styles.th, { textAlign: "left" }]}
                  >
                    NO
                  </Text>
                  <Text style={[styles.tableItem, styles.th]}>KUSTOMER</Text>
                  <Text style={[styles.tableItem, styles.th]}>NOTA</Text>
                  <Text
                    style={[
                      styles.tableItem,
                      styles.th,
                      { textAlign: "right" },
                    ]}
                  >
                    PENJUALAN
                  </Text>
                </View>
                <View>
                  {saleData.data?.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {i + 1}
                      </Text>
                      <Text style={[styles.tableItem]}>{row.name}</Text>
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
                      TOTAL NOTA
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {saleData.nota}
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
                      TOTAL PENJUALAN
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(saleData.total)}
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

  if (sale.state.status == "complete" && sale.state.data?.data) {
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
