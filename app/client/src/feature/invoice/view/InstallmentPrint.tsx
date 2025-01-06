import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import dayjs from "dayjs";
import { useInvoiceHook } from "./InvoiceHook";
import { Invoice, Item } from "../model/invoice_model";

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
    fontSize: 32,
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

export function InstallmentPrint() {
  const { auth, invoiceController } = useContext(Dependency)!;
  const invoice = useInvoiceHook(invoiceController);
  const param = useParams();

  useEffect(() => {
    if (
      auth.state.data &&
      invoice.state.action == "idle" &&
      invoice.state.status == "idle"
    ) {
      invoice.read(param.id!, { token: auth.state.data! });
    }
  }, [invoice.state, auth.state]);

  if (invoice.state.status == "complete" && invoice.state.data != null) {
    const data = invoice.state.data as Invoice;
    const installmentTotal = data.installment?.reduce(
      (a, b) => a + b.amount,
      0
    );

    return (
      <PDFViewer
        showToolbar={false}
        style={{ width: "100%", height: "100vh", border: "none" }}
      >
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.container}>
              <Text style={styles.heading}>NOTA</Text>
              <View style={styles.subHeadingContainer}>
                <Text style={styles.subHeading}>#{data.code}</Text>
                <Text style={styles.subHeading}>
                  {dayjs(data.printed).format("DD-MM-YYYY")}
                </Text>
                <Text style={styles.subHeading}>
                  {data.customerName} - {data.customerPhone}
                </Text>
                <Text
                  style={[styles.subHeading, { fontSize: "16", marginTop: 6 }]}
                >
                  Rp {Num.format(data.total)}
                </Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableItem, styles.th, { textAlign: "left" }]}
                  >
                    NO
                  </Text>
                  <Text style={[styles.tableItem, styles.th]}>TANGGAL</Text>
                  <Text style={[styles.tableItem, styles.th]}>PIUTANG</Text>
                  <Text
                    style={[
                      styles.tableItem,
                      styles.th,
                      { textAlign: "right" },
                    ]}
                  >
                    SETOR
                  </Text>
                </View>
                <View>
                  {data.installment?.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {i + 1}
                      </Text>
                      <Text style={[styles.tableItem]}>
                        {dayjs(data.printed).format("DD-MM-YYYY")}
                      </Text>
                      <Text style={[styles.tableItem]}>
                        {Num.format(row.outstanding)}
                      </Text>
                      <Text style={[styles.tableItem, { textAlign: "right" }]}>
                        {Num.format(row.amount)}
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
                      TOTAL
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(installmentTotal ?? 0)}
                    </Text>
                  </View>
                </View>
              </View>
              {data.note == null ? (
                ""
              ) : (
                <Text style={styles.note}>Catatan : {data.note}</Text>
              )}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  }

  if (invoice.state.status == "complete" && invoice.state.data == null) {
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