import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Transaction } from '../types';

// Definisi properti untuk komponen PDFDocument
interface PDFDocumentProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  transactions: Transaction[];
  initialBalance: number;
}

// Styles untuk PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableColBold: {
    width: '33.33%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    width: '60%',
  },
  summaryValue: {
    width: '40%',
  },
  bold: {
    fontWeight: 'bold',
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureItem: {
    width: '45%',
  },
  signatureTitle: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signatureName: {
    textAlign: 'center',
    marginTop: 50,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#000',
    paddingTop: 5,
    fontWeight: 'bold',
  },
});

// Komponen PDFDocument
const PDFDocument: React.FC<PDFDocumentProps> = ({ dateRange, transactions, initialBalance }) => {
  // Hitung total pemasukan dan pengeluaran
  const totalIncome = transactions.reduce((sum, transaction) => sum + transaction.debit, 0);
  const totalExpense = transactions.reduce((sum, transaction) => sum + transaction.credit, 0);
  const finalBalance = initialBalance + totalIncome - totalExpense;

  // Kelompokkan transaksi berdasarkan subtipe
  const debitBySubtype: Record<string, number> = {};
  const creditBySubtype: Record<string, number> = {};

  transactions.forEach(transaction => {
    const subtype = transaction.transactionSubtype || 'lain_lain';
    if (transaction.debit > 0) {
      debitBySubtype[subtype] = (debitBySubtype[subtype] || 0) + transaction.debit;
    } else if (transaction.credit > 0) {
      creditBySubtype[subtype] = (creditBySubtype[subtype] || 0) + transaction.credit;
    }
  });

  // Fungsi untuk menampilkan label subtype
  const getSubtypeLabel = (key: string): string => {
    const subtypeLabels: Record<string, string> = {
      kolekte_1: 'Kolekte I',
      kolekte_2: 'Kolekte II',
      sumbangan_umat: 'Sumbangan Umat',
      penerimaan_lain: 'Penerimaan Lain-Lain',
      operasional: 'Biaya Operasional',
      kegiatan: 'Penyelenggaraan Kegiatan',
      pembelian: 'Pembelian',
      sosial_duka: 'Sosial-Duka',
      lain_lain: 'Lain-Lain',
    };
    return subtypeLabels[key] || key;
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `Rp. ${amount.toLocaleString('id-ID')}`;
  };

  // Format tanggal
  const fromDate = format(dateRange.from, 'dd MMMM yyyy', { locale: id });
  const toDate = format(dateRange.to, 'dd MMMM yyyy', { locale: id });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>LAPORAN KAS LINGKUNGAN ST. AGATHA</Text>
        <Text style={styles.subTitle}>{fromDate} s.d. {toDate}</Text>

        {/* Tabel Transaksi */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Jenis Transaksi</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Tipe Transaksi</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Nominal</Text>
            </View>
          </View>

          {/* Uang Masuk */}
          <View style={styles.tableRow}>
            <View style={styles.tableColBold}>
              <Text>Uang Masuk</Text>
            </View>
            <View style={styles.tableCol}></View>
            <View style={styles.tableCol}></View>
          </View>

          {/* Detail Uang Masuk */}
          {Object.entries(debitBySubtype).map(([key, amount], index) => (
            <View style={styles.tableRow} key={`debit-${index}`}>
              <View style={styles.tableCol}></View>
              <View style={styles.tableCol}>
                <Text>{getSubtypeLabel(key)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{formatCurrency(amount)}</Text>
              </View>
            </View>
          ))}

          {/* Uang Keluar */}
          <View style={styles.tableRow}>
            <View style={styles.tableColBold}>
              <Text>Uang Keluar</Text>
            </View>
            <View style={styles.tableCol}></View>
            <View style={styles.tableCol}></View>
          </View>

          {/* Detail Uang Keluar */}
          {Object.entries(creditBySubtype).map(([key, amount], index) => (
            <View style={styles.tableRow} key={`credit-${index}`}>
              <View style={styles.tableCol}></View>
              <View style={styles.tableCol}>
                <Text>{getSubtypeLabel(key)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{formatCurrency(amount)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Ringkasan */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Saldo, Awal {format(dateRange.from, 'd MMMM yyyy', { locale: id })}</Text>
            <Text style={[styles.summaryValue, styles.bold]}>{formatCurrency(initialBalance)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Pemasukan</Text>
            <Text style={[styles.summaryValue, styles.bold]}>{formatCurrency(totalIncome)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
            <Text style={[styles.summaryValue, styles.bold]}>{formatCurrency(totalExpense)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Saldo Akhir, {format(dateRange.to, 'd MMMM yyyy', { locale: id })}</Text>
            <Text style={[styles.summaryValue, styles.bold]}>{formatCurrency(finalBalance)}</Text>
          </View>
        </View>

        {/* Tanda Tangan */}
        <View style={styles.signature}>
          <View style={styles.signatureItem}>
            <Text style={styles.signatureTitle}>Dibuat oleh,</Text>
            <Text style={styles.signatureName}>Bendahara Lingkungan</Text>
          </View>
          <View style={styles.signatureItem}>
            <Text style={styles.signatureTitle}>Disetujui Oleh,</Text>
            <Text style={styles.signatureName}>Ketua / Wakil Ketua Lingkungan</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument; 