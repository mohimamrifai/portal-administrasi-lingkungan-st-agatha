"use client";

import { JadwalDoling } from "../types";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  templateLabel: {
    fontSize: 8,
    marginBottom: 20,
    textAlign: "left",
    color: "#888888",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 10,
    textAlign: "left",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureCol: {
    width: "45%",
  },
  signatureLabel: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginTop: 40,
    marginHorizontal: 20,
  },
  signatureText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },
});

interface JadwalDolingPDFProps {
  jadwal: JadwalDoling[];
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}

export function JadwalDolingPDF({
  jadwal,
  startMonth,
  startYear,
  endMonth,
  endYear,
}: JadwalDolingPDFProps) {
  // Filter jadwal berdasarkan rentang tanggal
  const filteredJadwal = jadwal.filter((item) => {
    const itemDate = item.tanggal;
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth - 1, 31);
    return itemDate >= startDate && itemDate <= endDate;
  });

  // Format bulan untuk judul
  const formatPeriode = () => {
    const startMonthName = format(new Date(startYear, startMonth - 1, 1), "MMMM", { locale: id });
    const endMonthName = format(new Date(endYear, endMonth - 1, 1), "MMMM", { locale: id });
    
    if (startYear === endYear && startMonth === endMonth) {
      return `${startMonthName} ${startYear}`;
    } else if (startYear === endYear) {
      return `${startMonthName} s.d. ${endMonthName} ${startYear}`;
    } else {
      return `${startMonthName} ${startYear} s.d. ${endMonthName} ${endYear}`;
    }
  };

  return (
    <PDFViewer style={{ width: "100%", height: "700px" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.templateLabel}>TEMPLATE JADWAL DOLING</Text>
          <Text style={styles.title}>JADWAL TUAN RUMAH DOA LINGKUNGAN ST. AGATHA</Text>
          <Text style={styles.subtitle}>
            {formatPeriode()}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Calon Tuan Rumah</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Tanggal Di Jadwalkan</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Alamat</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Keterangan</Text>
              </View>
            </View>

            {filteredJadwal.length > 0 ? (
              filteredJadwal.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.tuanRumah}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {format(item.tanggal, "dd MMMM yyyy", { locale: id })} {item.waktu} WIB
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.alamat}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.catatan || "-"}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "100%" }]}>
                  <Text style={styles.tableCell}>Tidak ada jadwal di periode ini</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureCol}>
              <Text style={styles.signatureLabel}>Disusun Oleh,</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Ketua / Wakil Ketua Lingkungan</Text>
            </View>
            <View style={styles.signatureCol}>
              <Text style={styles.signatureLabel}>Dipublikasikan Oleh,</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Sekretaris/Wakil Sekretaris Lingkungan</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
} 