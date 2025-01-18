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
import { Purchase } from "../../purchase/model/purchase_model";
import { usePurchaseHook } from "../../purchase/view/PurchaseHook";
import logo from "../../../asset/logo-main.png";

const styles = StyleSheet.create(PRINT_STYLE);

export function LedgerPrint() {
  const { auth, purchaseController } = useContext(Dependency)!;
  const purchase = usePurchaseHook(purchaseController);
  const { purchaseId } = useParams();

  useEffect(() => {
    if (
      purchaseId &&
      auth.state.data &&
      purchase.state.action == "idle" &&
      purchase.state.status == "idle"
    ) {
      purchase.read(purchaseId, { token: auth.state.data });
    }
  }, [purchase.state, auth.state]);

  if (purchase.state.status == "complete" && purchase.state.data != null) {
    const purchaseData = purchase.state.data as Purchase;
    const ledgerData = purchaseData.ledger?.sort(
      (a, b) => dayjs(b.printed).valueOf() - dayjs(a.printed).valueOf()
    );
    const ledgerTotal = ledgerData?.reduce((a, b) => a + b.amount, 0);

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
                  <Text style={styles.heading}>LAPORAN</Text>
                  <View style={styles.subHeadingContainer}>
                    <Text style={styles.subHeading}>#{purchaseData.code}</Text>
                    <Text style={styles.subHeading}>
                      {dayjs(purchaseData.printed).format("DD-MM-YYYY")}
                    </Text>
                    <Text style={styles.subHeading}>
                      {purchaseData.supplierName} {purchaseData.supplierPhone}
                    </Text>
                    <Text
                      style={[
                        styles.subHeading,
                        {
                          fontSize: "16",
                          marginTop: 6,
                        },
                      ]}
                    >
                      Rp {Num.format(purchaseData.total)}
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
                  <Text style={[styles.tableItem, styles.th]}>TANGGAL</Text>
                  <Text style={[styles.tableItem, styles.th]}>SETOR</Text>
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
                  {ledgerData?.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {i + 1}
                      </Text>
                      <Text style={[styles.tableItem]}>
                        {dayjs(purchaseData.printed).format("DD-MM-YYYY")}
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
                      SISA HUTANG
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(purchaseData.balance)}
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
                      TOTAL SETORAN
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(ledgerTotal ?? 0)}
                    </Text>
                  </View>
                </View>
              </View>
              {purchaseData.note == null ? (
                ""
              ) : (
                <Text style={styles.note}>Catatan : {purchaseData.note}</Text>
              )}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  }

  if (purchase.state.status == "complete" && purchase.state.data == null) {
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
