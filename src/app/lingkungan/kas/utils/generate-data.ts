import { Transaction } from "../types";

// Generate more realistic transactions for current date
export function generateTransactions(): Transaction[] {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const transactions = [
    {
      id: 1,
      date: new Date(currentYear, currentMonth, 5),
      description: "Kolekte Doa Lingkungan",
      debit: 350000,
      credit: 0,
      locked: false,
      transactionType: "debit",
      transactionSubtype: "kolekte_1"
    },
    {
      id: 2,
      date: new Date(currentYear, currentMonth, 8),
      description: "Pembelian Perlengkapan Ibadah",
      debit: 0,
      credit: 75000,
      locked: false,
      transactionType: "credit",
      transactionSubtype: "pembelian"
    },
    {
      id: 3,
      date: new Date(currentYear, currentMonth, 12),
      description: "Transfer dari IKATA",
      debit: 500000,
      credit: 0,
      locked: true,
      transactionType: "debit",
      transactionSubtype: "transfer_ikata"
    },
    {
      id: 4,
      date: new Date(currentYear, currentMonth, 15),
      description: "Kolekte Ibadat Minggu",
      debit: 425000,
      credit: 0,
      locked: false,
      transactionType: "debit",
      transactionSubtype: "kolekte_2"
    },
    {
      id: 5,
      date: new Date(currentYear, currentMonth, 18),
      description: "Konsumsi Pertemuan Pengurus",
      debit: 0,
      credit: 250000,
      locked: false,
      transactionType: "credit",
      transactionSubtype: "kegiatan"
    },
    {
      id: 6,
      date: new Date(currentYear, currentMonth, 20),
      description: "Sumbangan untuk Keluarga Duka",
      debit: 0,
      credit: 300000,
      locked: true,
      transactionType: "credit",
      transactionSubtype: "sosial_duka"
    },
    {
      id: 7,
      date: new Date(currentYear, currentMonth, 22),
      description: "Iuran Bulanan Anggota",
      debit: 750000,
      credit: 0,
      locked: false,
      transactionType: "debit",
      transactionSubtype: "penerimaan_lain"
    },
    {
      id: 8,
      date: new Date(currentYear, currentMonth, 25),
      description: "Biaya Transportasi Kunjungan",
      debit: 0,
      credit: 150000,
      locked: false,
      transactionType: "credit",
      transactionSubtype: "operasional"
    },
    {
      id: 9,
      date: new Date(currentYear, currentMonth, 27),
      description: "Dana Bantuan Sosial",
      debit: 0,
      credit: 500000,
      locked: true,
      transactionType: "credit",
      transactionSubtype: "sosial_duka"
    },
    {
      id: 10,
      date: new Date(currentYear, currentMonth, 29),
      description: "Kolekte Perayaan Santo Pelindung",
      debit: 1250000,
      credit: 0,
      locked: false,
      transactionType: "debit",
      transactionSubtype: "kolekte_1"
    },
  ];
  
  return transactions;
} 