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
import { usePurchaseHook } from "./PurchaseHook";
import { Purchase } from "../model/purchase_model";
import { ReceiptTableItem, ReceiptTableTag } from "./ReceiptTableHook";
import dayjs from "dayjs";

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

export function PurchasePrint() {
  const { auth, purchaseController } = useContext(Dependency)!;
  const purchase = usePurchaseHook(purchaseController);
  const param = useParams();

  useEffect(() => {
    if (
      auth.state.data &&
      purchase.state.action == "idle" &&
      purchase.state.status == "idle"
    ) {
      purchase.read(param.id!, { token: auth.state.data! });
    }
  }, [purchase.state, auth.state]);

  if (purchase.state.status == "complete" && purchase.state.data != null) {
    const data = purchase.state.data as Purchase;
    const inventories: ReceiptTableItem[] = data.inventory!.map((e) => {
      return {
        key: e.id,
        id: e.id,
        name: e.productName,
        tag: ReceiptTableTag.Inventory,
        qty: e.qty,
        price: e.price,
        total: e.total,
      };
    });
    const payments: ReceiptTableItem[] | undefined = data.payment?.map((e) => {
      return {
        key: e.id,
        id: e.id,
        name: e.note,
        tag: ReceiptTableTag.Payment,
        total: e.amount,
      };
    });
    const inventoryTotal = inventories.reduce((a, b) => a + b.total, 0);
    const paymentTotal = payments?.reduce((a, b) => a + b.total, 0);
    const tableData = inventories.concat(payments ?? []);

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
                  {data.supplierName} - {data.supplierPhone}
                </Text>
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
                  {tableData.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {row.name}
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
                      Total Produk
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(inventoryTotal)}
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
                      Fee {data.fee}%
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(data.margin)}
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
                      Biaya Lain
                    </Text>
                    <Text
                      style={[
                        styles.tableItem,
                        styles.th,
                        { textAlign: "right" },
                      ]}
                    >
                      {Num.format(paymentTotal ?? 0)}
                    </Text>
                  </View>
                  {data.outstanding == 0 ? (
                    ""
                  ) : (
                    <View style={[styles.tableRow, { border: "none" }]}>
                      <Text
                        style={[
                          styles.tableItem,
                          styles.th,
                          { textAlign: "left" },
                        ]}
                      >
                        Sisa Hutang ({data.supplierName})
                      </Text>
                      <Text
                        style={[
                          styles.tableItem,
                          styles.th,
                          { textAlign: "right" },
                        ]}
                      >
                        {Num.format(data.outstanding)}
                      </Text>
                    </View>
                  )}
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
                      {Num.format(data.balance)}
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
