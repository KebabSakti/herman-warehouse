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
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { Installment } from "../../installment/model/installment_model";
import { useInstallmentHook } from "../../installment/view/InstallmentHook";
import { Invoice } from "../model/invoice_model";
import { useInvoiceHook } from "./InvoiceHook";

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
  const { auth, invoiceController, installmentController } =
    useContext(Dependency)!;
  const invoice = useInvoiceHook(invoiceController);
  const installment = useInstallmentHook(installmentController);
  const { invoiceId } = useParams();

  useEffect(() => {
    if (invoiceId && auth.state.data) {
      if (invoice.state.action == "idle" && invoice.state.status == "idle") {
        invoice.read(invoiceId, { token: auth.state.data });
      }

      if (
        installment.state.action == "idle" &&
        installment.state.status == "idle"
      ) {
        installment.list(
          invoiceId,
          { page: 0, limit: 0 },
          { token: auth.state.data }
        );
      }
    }
  }, [invoice.state, installment.state, auth.state]);

  if (
    invoice.state.status == "complete" &&
    invoice.state.data != null &&
    installment.state.status == "complete" &&
    installment.state.data != null
  ) {
    const invoiceData = invoice.state.data as Invoice;
    const installmentData = installment.state.data as Result<Installment[]>;
    const totalPaid =
      installmentData.data?.reduce((a, b) => a + b.amount, 0) ?? 0;

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
                <Text style={styles.subHeading}>#{invoiceData.code}</Text>
                <Text style={styles.subHeading}>
                  {dayjs(invoiceData.printed).format("DD-MM-YYYY")}
                </Text>
                <Text style={styles.subHeading}>
                  {invoiceData.customerName} - {invoiceData.customerPhone}
                </Text>
                <Text
                  style={[styles.subHeading, { fontSize: "16", marginTop: 6 }]}
                >
                  Rp {Num.format(invoiceData.totalItem)}
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
                  <Text style={[styles.tableItem, styles.th]}>SETOR</Text>
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
                  {installmentData.data?.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {i + 1}
                      </Text>
                      <Text style={[styles.tableItem]}>
                        {dayjs(invoiceData.printed).format("DD-MM-YYYY")}
                      </Text>
                      <Text style={[styles.tableItem]}>
                        {Num.format(row.amount)}
                      </Text>
                      <Text style={[styles.tableItem, { textAlign: "right" }]}>
                        {Num.format(row.outstanding)}
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
                      OUTSTANDING
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(invoiceData.outstanding)}
                    </Text>
                  </View>
                </View>
              </View>
              {invoiceData.note == null ? (
                ""
              ) : (
                <Text style={styles.note}>Catatan : {invoiceData.note}</Text>
              )}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  }

  if (
    (invoice.state.status == "complete" && invoice.state.data == null) ||
    (installment.state.status == "complete" && installment.state.data == null)
  ) {
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
