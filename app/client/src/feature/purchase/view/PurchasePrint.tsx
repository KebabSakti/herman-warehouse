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
import { Purchase } from "../model/purchase_model";
import { usePurchaseHook } from "./PurchaseHook";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#fff",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
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

    const summaries = [
      {
        item: "Total Produk",
        total: data.totalItem,
      },
    ];

    if (data.fee > 0) {
      summaries.push({
        item: `Fee ${data.fee}%`,
        total: data.margin,
      });
    }

    if (data.other ?? 0 > 0) {
      summaries.push({
        item: "Biaya Lain",
        total: data.other ?? 0,
      });
    }

    if (data.dp ?? 0 > 0) {
      summaries.push({
        item: "Panjar",
        total: data.dp ?? 0,
      });
    }

    if (data.outstanding ?? 0 > 0) {
      summaries.push({
        item: "Sisa Hutang",
        total: data.outstanding ?? 0,
      });
    }

    summaries.push({
      item: "TOTAL",
      total: data.total,
    });

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
                  {data.inventory.map((e) => (
                    <View key={e.id} style={styles.tableRow}>
                      <Text style={[styles.tableItem, { textAlign: "left" }]}>
                        {e.productName}
                      </Text>
                      <Text style={styles.tableItem}>
                        {e.qty != null ? Num.format(e.qty) : ""}
                      </Text>
                      <Text style={styles.tableItem}>
                        {e.price != null ? Num.format(e.price) : ""}
                      </Text>
                      <Text style={[styles.tableItem, { textAlign: "right" }]}>
                        {Num.format(e.total)}
                      </Text>
                    </View>
                  ))}
                  {(() => {
                    if (data.payment && data.payment.length > 0) {
                      return (
                        <>
                          {data.payment.map((e) => (
                            <View key={e.id} style={styles.tableRow}>
                              <Text
                                style={[
                                  styles.tableItem,
                                  { textAlign: "left" },
                                ]}
                              >
                                {e.note}
                              </Text>
                              <Text style={styles.tableItem}></Text>
                              <Text style={styles.tableItem}></Text>
                              <Text
                                style={[
                                  styles.tableItem,
                                  { textAlign: "right" },
                                ]}
                              >
                                {Num.format(e.amount)}
                              </Text>
                            </View>
                          ))}
                        </>
                      );
                    }
                  })()}
                </View>
                <View>
                  {summaries.map((e, i) => {
                    return (
                      <View
                        key={i}
                        style={[styles.tableRow, { border: "none" }]}
                      >
                        <Text
                          style={[
                            styles.tableItem,
                            styles.th,
                            { textAlign: "left" },
                          ]}
                        >
                          {e.item}
                        </Text>
                        <Text
                          style={[
                            styles.tableItem,
                            styles.th,
                            { textAlign: "right" },
                          ]}
                        >
                          {Num.format(e.total)}
                        </Text>
                      </View>
                    );
                  })}
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
