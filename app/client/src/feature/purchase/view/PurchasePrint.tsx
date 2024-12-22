import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Num } from "../../../helper/num";
import { Purchase } from "../model/purchase_model";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#fff",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
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
    padding: "8px 0px",
    borderBottom: "1px solid #000",
  },
  tableItem: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
});

const tableData = [
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
  {
    name: "John Doe",
    qty: 28,
    price: Num.format(120000),
    total: Num.format(20000),
  },
];

const Doc = (props: Purchase) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.heading}>NOTA</Text>
        <View style={styles.subHeadingContainer}>
          <Text style={styles.subHeading}>#{props.id}</Text>
          <Text style={styles.subHeading}>22 Desember 2024</Text>
          <Text style={styles.subHeading}>Kebab Sakti - 081254982664</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableItem, { textAlign: "left" }]}>ITEM</Text>
            <Text style={styles.tableItem}>QUANTITY</Text>
            <Text style={styles.tableItem}>HARGA</Text>
            <Text style={[styles.tableItem, { textAlign: "right" }]}>
              TOTAL
            </Text>
          </View>
          <View>
            {tableData.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableItem, { textAlign: "left" }]}>
                  {row.name}
                </Text>
                <Text style={styles.tableItem}>{row.qty}</Text>
                <Text style={styles.tableItem}>{row.price}</Text>
                <Text style={[styles.tableItem, { textAlign: "right" }]}>
                  {row.total}
                </Text>
              </View>
            ))}
          </View>
          <View style={[styles.tableRow, { border: "none" }]}>
            <Text style={[styles.tableItem, { textAlign: "left" }]}>TOTAL</Text>
            <Text style={[styles.tableItem, { textAlign: "right" }]}>
              {Num.format(100000000)}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export function PurchasePrint() {
  return (
    <PDFViewer
      showToolbar={false}
      style={{ width: "100%", height: "100vh", border: "none" }}
    >
      <Doc />
    </PDFViewer>
  );
}
