import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  PDFViewer,
} from "@react-pdf/renderer";
import { Num } from "../../../helper/num";
import { useParams } from "react-router-dom";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 20,
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 6,
  },
  head: {
    marginTop: 20,
  },
  heading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "230px",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  name: {
    fontSize: 10,
    textTransform: "uppercase",
  },
  table: {
    margin: "10px 0px",
    width: "100%",
  },
  tableHead: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #000",
    padding: "10px 0px",
    width: "100%",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #000",
    padding: "8 0px",
    width: "100%",
  },
  tableFoot: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "10px 0px",
    width: "100%",
  },
  th: {
    fontSize: 10,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  td: {
    fontSize: 10,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
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

export const Doc = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>INVOICE</Text>
      <Text style={styles.subtitle}>#SPP276687502</Text>
      <Text style={styles.subtitle}>22 Desember 2024</Text>
      <Text style={styles.subtitle}>Kebab Sakti - 081254982664</Text>
      <View style={styles.table}>
        <View style={styles.tableHead}>
          <Text style={[styles.th, { textAlign: "left" }]}>ITEM</Text>
          <Text style={styles.th}>QUANTITY</Text>
          <Text style={styles.th}>HARGA</Text>
          <Text style={[styles.th, { textAlign: "right" }]}>TOTAL</Text>
        </View>
        {tableData.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.th, { textAlign: "left" }]}>{row.name}</Text>
            <Text style={styles.td}>{row.qty}</Text>
            <Text style={styles.td}>{row.price}</Text>
            <Text style={[styles.th, { textAlign: "right" }]}>{row.total}</Text>
          </View>
        ))}
        <View style={styles.tableFoot}>
          <Text style={[styles.th, { textAlign: "left" }]}>TOTAL</Text>
          <Text style={[styles.th, { textAlign: "right" }]}>
            {Num.format(100000000)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export function Print() {
  return (
    <PDFViewer
      showToolbar={false}
      style={{ width: "100%", height: "100vh", border: "none" }}
    >
      <Doc />
    </PDFViewer>
  );
}
