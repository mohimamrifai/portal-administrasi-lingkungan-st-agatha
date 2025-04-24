import { z } from "zod";
import { DateRange } from "react-day-picker";

// Tipe data untuk filter periode
export const periodFilterSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "Tanggal awal wajib diisi",
    }),
    to: z.date({
      required_error: "Tanggal akhir wajib diisi",
    }),
  }),
});

export type PeriodFilterValues = z.infer<typeof periodFilterSchema>;

// Tipe data untuk Resume Keuangan Lingkungan
export interface KeuanganLingkunganSummary {
  saldoAwal: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoAkhir: number;
}

// Tipe data untuk Resume Keuangan IKATA
export interface KeuanganIkataSummary {
  saldoAwal: number;
  pemasukan: number;
  pengeluaran: number;
  saldoAkhir: number;
}

// Tipe data untuk Resume Kesekretariatan
export interface KesekretariatanSummary {
  totalKepalaKeluarga: number;
  jumlahJiwa: number;
  kkBergabung: number;
  kkPindah: number;
  umatMeninggalDunia: number;
  tingkatPartisipasiUmat: number;
}

// Tipe data untuk Kepala Keluarga Penunggak
export interface PenunggakDanaMandiri {
  id: number;
  nama: string;
  periodeTunggakan: string;
  jumlahTunggakan: number;
}

// Tipe data untuk Kepala Keluarga Penunggak IKATA
export interface PenunggakIkata {
  id: number;
  nama: string;
  periodeTunggakan: string;
  jumlahTunggakan: number;
}

// Mock data untuk Kepala Keluarga
export const familyHeads = [
  { id: 1, name: "Budi Santoso" },
  { id: 2, name: "Agus Wijaya" },
  { id: 3, name: "Hendra Gunawan" },
  { id: 4, name: "Bambang Sutrisno" },
  { id: 5, name: "Joko Susilo" },
  { id: 6, name: "Ahmad Hidayat" },
  { id: 7, name: "Dedi Purnomo" },
  { id: 8, name: "Eko Prasetyo" },
  { id: 9, name: "Yusuf Wibowo" },
  { id: 10, name: "Andi Setiawan" }
]; 