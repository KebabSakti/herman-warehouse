export const SERVER = "http://192.168.10.28:1000"; //http://192.168.10.28:1000 // https://api.cvhmtkarya.my.id
export const FILE_SIZE = 2 * 1024 * 1024; // 2 MB
export const IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
export const PRINT_STYLE: any = {
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
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  logo: {
    width: "270px",
  },
  subHeadingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "flex-end",
  },
  subHeading: {
    fontSize: 14,
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
    fontSize: 12,
    textAlign: "center",
    width: "100%",
  },
  th: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  note: {
    fontSize: 12,
  },
};
