import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Num } from "../../../helper/num";

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
  subheading: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  table: {
    width: "100%",
  },
  tableHeading: {
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
  tableFooter: {
    display: "flex",
    flexDirection: "row",
    padding: "8px 0px",
  },
  tableBody: {
    display: "flex",
  },
  // head: {
  //   marginTop: 20,
  // },
  // heading: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "flex-start",
  //   width: "230px",
  //   marginBottom: 8,
  // },
  // label: {
  //   fontSize: 10,
  //   fontWeight: "bold",
  //   letterSpacing: 1,
  // },
  // name: {
  //   fontSize: 10,
  //   textTransform: "uppercase",
  // },
  // table: {
  //   margin: "10px 0px",
  //   width: "100%",
  // },
  // tableHead: {
  //   display: "flex",
  //   flexDirection: "row",
  //   borderBottom: "1px solid #000",
  //   padding: "10px 0px",
  //   width: "100%",
  // },
  // tableRow: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   borderBottom: "1px solid #000",
  //   padding: "8 0px",
  //   width: "100%",
  // },
  // tableFoot: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   padding: "10px 0px",
  //   width: "100%",
  // },
  // th: {
  //   fontSize: 10,
  //   fontWeight: "bold",
  //   width: "100%",
  //   textAlign: "center",
  // },
  // td: {
  //   fontSize: 10,
  //   fontWeight: "bold",
  //   width: "100%",
  //   textAlign: "center",
  // },
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

// const Doc = (props: any) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.title}>INVOICE</Text>
//       <Text style={styles.subtitle}>#{props.id}</Text>
//       <Text style={styles.subtitle}>22 Desember 2024</Text>
//       <Text style={styles.subtitle}>Kebab Sakti - 081254982664</Text>
//       <View style={styles.table}>
//         <View style={styles.tableHead}>
//           <Text style={[styles.th, { textAlign: "left" }]}>ITEM</Text>
//           <Text style={styles.th}>QUANTITY</Text>
//           <Text style={styles.th}>HARGA</Text>
//           <Text style={[styles.th, { textAlign: "right" }]}>TOTAL</Text>
//         </View>
//         {tableData.map((row, i) => (
//           <View key={i} style={styles.tableRow}>
//             <Text style={[styles.th, { textAlign: "left" }]}>{row.name}</Text>
//             <Text style={styles.td}>{row.qty}</Text>
//             <Text style={styles.td}>{row.price}</Text>
//             <Text style={[styles.th, { textAlign: "right" }]}>{row.total}</Text>
//           </View>
//         ))}
//         <View style={styles.tableFoot}>
//           <Text style={[styles.th, { textAlign: "left" }]}>TOTAL</Text>
//           <Text style={[styles.th, { textAlign: "right" }]}>
//             {Num.format(100000000)}
//           </Text>
//         </View>
//       </View>
//     </Page>
//   </Document>
// );

const Doc = (props: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.heading}>INVOICE</Text>
        <View style={styles.subHeadingContainer}>
          <Text style={styles.subheading}>#{props.id}</Text>
          <Text style={styles.subheading}>22 Desember 2024</Text>
          <Text style={styles.subheading}>Kebab Sakti - 081254982664</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeading}>
            <Text style={[styles.tableItem, { textAlign: "left" }]}>ITEM</Text>
            <Text style={styles.tableItem}>QUANTITY</Text>
            <Text style={styles.tableItem}>HARGA</Text>
            <Text style={[styles.tableItem, { textAlign: "right" }]}>
              TOTAL
            </Text>
          </View>
          <View style={styles.tableBody}>
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
          <View style={styles.tableFooter}>
            <Text style={[styles.tableItem, { textAlign: "left" }]}>TOTAL</Text>
            <Text style={[styles.tableItem, { textAlign: "right" }]}>
              10.000.000
            </Text>
          </View>
        </View>
      </View>

      {/* <View style={styles.table}>
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
      </View> */}
    </Page>
  </Document>
);

export function PurchasePrint() {
  return (
    <PDFViewer
      showToolbar={false}
      style={{ width: "100%", height: "100vh", border: "none" }}
    >
      <Doc id="SPP276687502" />
    </PDFViewer>
  );
}
