import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PRINT_STYLE } from "../../../common/common";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { useOutstandingHook } from "./OutstandingHook";
import logo from "../../../asset/logo-main.png";

const styles = StyleSheet.create(PRINT_STYLE);

export function OutstandingPrint() {
  const { auth, outstandingController } = useContext(Dependency)!;
  const outstanding = useOutstandingHook(outstandingController);
  const { start, end } = useParams();

  useEffect(() => {
    if (
      start &&
      end &&
      auth.state.data &&
      outstanding.state.action == "idle" &&
      outstanding.state.status == "idle"
    ) {
      outstanding.list({ start: start, end: end }, { token: auth.state.data });
    }
  }, [outstanding.state, auth.state]);

  if (outstanding.state.status == "complete" && outstanding.state.data?.data) {
    const outstandingData = outstanding.state.data;

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
                  <Text style={styles.heading}>HUTANG</Text>
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
                  <Text style={[styles.tableItem, styles.th]}>SUPPLIER</Text>
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
                    HUTANG
                  </Text>
                </View>
                <View>
                  {outstandingData.data?.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {i + 1}
                      </Text>
                      <Text style={[styles.tableItem]}>{row.name}</Text>
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
                      {outstandingData.unpaid}
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
                      {outstandingData.paid}
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
                      {outstandingData.nota}
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
                      TOTAL HUTANG
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(outstandingData.total)}
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

  if (outstanding.state.status == "complete" && outstanding.state.data?.data) {
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
