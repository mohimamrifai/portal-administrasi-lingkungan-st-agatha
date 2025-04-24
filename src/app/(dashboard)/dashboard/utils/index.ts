import { DateRange } from "react-day-picker";
import {
  KeuanganLingkunganSummary,
  KeuanganIkataSummary,
  KesekretariatanSummary,
  PenunggakDanaMandiri,
  PenunggakIkata,
} from "../types";
import { format, startOfMonth, endOfMonth, isSameMonth } from "date-fns";

// Mendapatkan rentang tanggal untuk bulan tertentu
export function getMonthDateRange(date: Date): DateRange {
  return {
    from: startOfMonth(date),
    to: endOfMonth(date),
  };
}

// Fungsi untuk menghasilkan data dummy Keuangan Lingkungan
export function generateKeuanganLingkunganData(month: Date): KeuanganLingkunganSummary {
  // Implementasi dummy
  const baseAmount = 5000000;
  const monthNumber = month.getMonth() + 1;
  
  return {
    saldoAwal: baseAmount + (monthNumber * 100000),
    totalPemasukan: 1500000 + (monthNumber * 25000),
    totalPengeluaran: 1000000 + (monthNumber * 15000),
    saldoAkhir: baseAmount + (monthNumber * 100000) + 1500000 + (monthNumber * 25000) - (1000000 + (monthNumber * 15000)),
  };
}

// Fungsi untuk menghasilkan data dummy Keuangan IKATA
export function generateKeuanganIkataData(month: Date): KeuanganIkataSummary {
  // Implementasi dummy
  const baseAmount = 3000000;
  const monthNumber = month.getMonth() + 1;
  
  return {
    saldoAwal: baseAmount + (monthNumber * 75000),
    pemasukan: 1200000 + (monthNumber * 20000),
    pengeluaran: 800000 + (monthNumber * 12000),
    saldoAkhir: baseAmount + (monthNumber * 75000) + 1200000 + (monthNumber * 20000) - (800000 + (monthNumber * 12000)),
  };
}

// Fungsi untuk menghasilkan data dummy Kesekretariatan
export function generateKesekretariatanData(month: Date): KesekretariatanSummary {
  // Implementasi dummy
  const monthNumber = month.getMonth() + 1;
  
  return {
    totalKepalaKeluarga: 150 + (monthNumber % 3),
    jumlahJiwa: 450 + (monthNumber * 2),
    kkBergabung: monthNumber,
    kkPindah: Math.max(0, monthNumber - 2),
    umatMeninggalDunia: Math.floor(monthNumber / 3),
    tingkatPartisipasiUmat: 65 + (monthNumber * 1.5),
  };
}

// Fungsi untuk menghasilkan data dummy Penunggak Dana Mandiri
export function generatePenunggakDanaMandiriData(): PenunggakDanaMandiri[] {
  return [
    { id: 2, nama: "Agus Wijaya", periodeTunggakan: "Jan 2023 - Jun 2023", jumlahTunggakan: 600000 },
    { id: 5, nama: "Joko Susilo", periodeTunggakan: "Mar 2023 - Jun 2023", jumlahTunggakan: 400000 },
    { id: 7, nama: "Dedi Purnomo", periodeTunggakan: "Apr 2023 - Jun 2023", jumlahTunggakan: 300000 },
    { id: 9, nama: "Yusuf Wibowo", periodeTunggakan: "May 2023 - Jun 2023", jumlahTunggakan: 200000 },
  ];
}

// Fungsi untuk menghasilkan data dummy Penunggak IKATA
export function generatePenunggakIkataData(): PenunggakIkata[] {
  return [
    { id: 3, nama: "Hendra Gunawan", periodeTunggakan: "Feb 2023 - Jun 2023", jumlahTunggakan: 500000 },
    { id: 6, nama: "Ahmad Hidayat", periodeTunggakan: "Jan 2023 - Jun 2023", jumlahTunggakan: 600000 },
    { id: 8, nama: "Eko Prasetyo", periodeTunggakan: "Apr 2023 - Jun 2023", jumlahTunggakan: 300000 },
    { id: 10, nama: "Andi Setiawan", periodeTunggakan: "May 2023 - Jun 2023", jumlahTunggakan: 200000 },
  ];
}

// Format angka menjadi format Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format persentase
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Format tanggal
export function formatDate(date: Date): string {
  return format(date, "d MMMM yyyy");
} 