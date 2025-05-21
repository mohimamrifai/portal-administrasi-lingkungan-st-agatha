'use client';

import { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { IKATASummary, IKATATransaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Styles for PDF component
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  period: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: 'bold',
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
    width: '35%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  tableColHeaderType: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  tableColHeaderNominal: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  // Sel tabel untuk jenis
  tableColJenis: {
    width: '35%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  // Sel tabel untuk tipe
  tableColTipe: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'left',
  },
  // Sel tabel untuk jumlah
  tableColNominal: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'right',
  },
  // Sel tabel kosong dengan pesan
  tableColEmpty: {
    width: '65%', // Gabungan dari lebar jenis dan tipe
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  // Untuk debit (warna hijau)
  tableColDebit: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'right',
    color: '#22c55e',
  },
  // Untuk kredit (warna merah)
  tableColKredit: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'right',
    color: '#e11d48',
  },
  summary: {
    marginTop: 10,
    fontSize: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    width: '50%',
  },
  summaryLabelBold: {
    width: '50%',
    fontWeight: 'bold',
  },
  summaryValue: {
    width: '50%',
  },
  summaryValueBold: {
    width: '50%',
    fontWeight: 'bold',
  },
  signature: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureCol: {
    width: '45%',
    fontSize: 10,
    textAlign: 'center',
  },
  signatureTitle: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000',
    marginTop: 50,
    marginBottom: 5,
    width: '80%',
    alignSelf: 'center',
  },
  signatureRole: {
    fontSize: 9,
  },
});

interface KasIKATAPDFProps {
  period: {
    bulan: number;
    tahun: number;
  };
  summary: IKATASummary;
  transactions?: IKATATransaction[];
}

export const KasIKATAPDF = ({ period, summary, transactions = [] }: KasIKATAPDFProps) => {
  // Format bulan dalam bahasa Indonesia
  const bulanText = useMemo(() => {
    return format(new Date(period.tahun, period.bulan - 1, 1), 'MMMM', { locale: id });
  }, [period]);

  // Format tanggal awal dan akhir bulan
  const tanggalAwal = useMemo(() => {
    return format(new Date(period.tahun, period.bulan - 1, 1), 'd MMMM yyyy', { locale: id });
  }, [period]);

  const tanggalAkhir = useMemo(() => {
    const lastDay = new Date(period.tahun, period.bulan, 0).getDate();
    return format(new Date(period.tahun, period.bulan - 1, lastDay), 'd MMMM yyyy', { locale: id });
  }, [period]);

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };
  
  // Format tipe transaksi
  const formatTipeTransaksi = (tipe: string) => {
    const tipeMap: Record<string, string> = {
      // Tipe Uang Masuk
      'iuran_anggota': 'Iuran Anggota',
      'transfer_dana_lingkungan': 'Transfer Dana dari Lingkungan',
      'sumbangan_anggota': 'Sumbangan Anggota',
      'penerimaan_lain': 'Penerimaan Lain-Lain',
      
      // Tipe Uang Keluar
      'uang_duka': 'Uang Duka / Papan Bunga',
      'kunjungan_kasih': 'Kunjungan Kasih',
      'cinderamata_kelahiran': 'Cinderamata Kelahiran',
      'cinderamata_pernikahan': 'Cinderamata Pernikahan',
      'uang_akomodasi': 'Uang Akomodasi',
      'pembelian': 'Pembelian',
      'lain_lain': 'Lain-Lain',
    };
    
    return tipeMap[tipe] || tipe;
  };
  
  // Filter transaksi untuk bulan dan tahun yang dipilih
  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter(t => {
      // Format tanggal transaksi: '2024-04-01' (tahun-bulan-hari)
      const dateParts = t.tanggal.split('-');
      const txYear = parseInt(dateParts[0], 10);
      const txMonth = parseInt(dateParts[1], 10); // Bulan dalam format 1-12
      
      // Bandingkan dengan period (bulan juga dalam format 1-12)
      const result = txMonth === period.bulan && txYear === period.tahun;
      return result;
    });
    
    // Sortir berdasarkan tanggal
    return filtered.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  }, [transactions, period]);
  
  // Kelompokkan transaksi berdasarkan jenis
  const pemasukanTransaksi = useMemo(() => {
    return filteredTransactions.filter(t => t.jenis === 'uang_masuk');
  }, [filteredTransactions]);
  
  const pengeluaranTransaksi = useMemo(() => {
    return filteredTransactions.filter(t => t.jenis === 'uang_keluar');
  }, [filteredTransactions]);
  
  // Kelompokkan berdasarkan tipe transaksi
  const groupByTipeTransaksi = (transaksi: IKATATransaction[]) => {
    const groups: Record<string, number> = {};
    
    transaksi.forEach(t => {
      if (t.tipeTransaksi) {
        const tipeKey = formatTipeTransaksi(t.tipeTransaksi);
        if (groups[tipeKey]) {
          groups[tipeKey] += t.jumlah;
        } else {
          groups[tipeKey] = t.jumlah;
        }
      }
    });
    
    return Object.entries(groups).map(([tipe, jumlah]) => ({
      tipe,
      jumlah
    }));
  };
  
  // Hitung total untuk pemasukan dan pengeluaran
  const totalPemasukan = pemasukanTransaksi.reduce((sum, tx) => sum + tx.jumlah, 0);
  const totalPengeluaran = pengeluaranTransaksi.reduce((sum, tx) => sum + tx.jumlah, 0);
  
  const pemasukanGroups = useMemo(() => groupByTipeTransaksi(pemasukanTransaksi), [pemasukanTransaksi]);
  const pengeluaranGroups = useMemo(() => groupByTipeTransaksi(pengeluaranTransaksi), [pengeluaranTransaksi]);

  // Format tanggal untuk PDF
  const formatTanggalPDF = (tanggal: string) => {
    const date = new Date(tanggal);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>LAPORAN KAS IKATA LINGKUNGAN ST. AGATHA</Text>
        <Text style={styles.period}>{tanggalAwal} s.d. {tanggalAkhir}</Text>

        {/* Rangkuman Berdasarkan Tipe Transaksi */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Jenis Transaksi</Text>
            <Text style={styles.tableColHeaderType}>Tipe Transaksi</Text>
            <Text style={styles.tableColHeaderNominal}>Jumlah</Text>
          </View>
          
          {/* Pemasukan */}
          {pemasukanGroups.length > 0 ? (
            pemasukanGroups.map((group, index) => (
              <View style={styles.tableRow} key={`pemasukan-${index}`}>
                {index === 0 ? (
                  <Text style={styles.tableColJenis}>Uang Masuk</Text>
                ) : (
                  <Text style={styles.tableColJenis}></Text>
                )}
                <Text style={styles.tableColTipe}>{group.tipe}</Text>
                <Text style={styles.tableColDebit}>Rp. {formatCurrency(group.jumlah)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableColJenis}>Uang Masuk</Text>
              <Text style={styles.tableColEmpty}>Tidak ada transaksi uang masuk pada periode ini</Text>
            </View>
          )}
          
          {/* Pengeluaran */}
          {pengeluaranGroups.length > 0 ? (
            pengeluaranGroups.map((group, index) => (
              <View style={styles.tableRow} key={`pengeluaran-${index}`}>
                {index === 0 ? (
                  <Text style={styles.tableColJenis}>Uang Keluar</Text>
                ) : (
                  <Text style={styles.tableColJenis}></Text>
                )}
                <Text style={styles.tableColTipe}>{group.tipe}</Text>
                <Text style={styles.tableColKredit}>Rp. {formatCurrency(group.jumlah)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableColJenis}>Uang Keluar</Text>
              <Text style={styles.tableColEmpty}>Tidak ada transaksi uang keluar pada periode ini</Text>
            </View>
          )}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Saldo, Awal 1 {bulanText} {period.tahun}</Text>
            <Text style={styles.summaryValue}>Rp. {formatCurrency(summary.saldoAwal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Pemasukan</Text>
            <Text style={styles.summaryValue}>Rp. {formatCurrency(summary.pemasukan)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
            <Text style={styles.summaryValue}>Rp. {formatCurrency(summary.pengeluaran)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBold}>Saldo Akhir, {new Date(period.tahun, period.bulan, 0).getDate()} {bulanText} {period.tahun}</Text>
            <Text style={styles.summaryValueBold}>Rp. {formatCurrency(summary.saldoAkhir)}</Text>
          </View>
        </View>

        <View style={styles.signature}>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureTitle}>Dicetak oleh,</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureRole}>Wakil Bendahara Lingkungan</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureTitle}>Disahkan Oleh,</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureRole}>Ketua Lingkungan</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}; 