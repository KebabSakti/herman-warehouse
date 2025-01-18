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
import { Dependency } from "../../../component/App";
import { Num } from "../../../helper/num";
import { Invoice } from "../model/invoice_model";
import { useInvoiceHook } from "./InvoiceHook";
import { PRINT_STYLE } from "../../../common/common";
import logo from "../../../asset/logo-main.png";

const styles = StyleSheet.create(PRINT_STYLE);

export function InvoicePrint() {
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
    // const produkTotal = data.item.reduce((a, b) => a + b.total, 0);

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
                  <Text style={styles.heading}>NOTA</Text>
                  <View style={styles.subHeadingContainer}>
                    <Text style={styles.subHeading}>#{data.code}</Text>
                    <Text style={styles.subHeading}>
                      {dayjs(data.printed).format("DD-MM-YYYY")}
                    </Text>
                    <Text style={styles.subHeading}>
                      {data.customerName} - {data.customerPhone}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableItem, styles.th, { textAlign: "left" }]}
                  >
                    ITEM
                  </Text>
                  <Text style={[styles.tableItem, styles.th]}>QUANTITY</Text>
                  <Text style={[styles.tableItem, styles.th]}>HARGA</Text>
                  <Text
                    style={[
                      styles.tableItem,
                      styles.th,
                      { textAlign: "right" },
                    ]}
                  >
                    TOTAL
                  </Text>
                </View>
                <View>
                  {data.item.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {row.productCode} - {row.productName}
                      </Text>
                      <Text style={styles.tableItem}>
                        {row.qty != null ? Num.format(row.qty) : ""}
                      </Text>
                      <Text style={styles.tableItem}>
                        {row.price != null ? Num.format(row.price) : ""}
                      </Text>
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
                      Produk
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(data.totalItem)}
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
                      SETOR
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(data.totalPaid)}
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
                      TOTAL
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(data.total)}
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
