export type TransactionType = 'iuran' | 'sumbangan' | 'pengeluaran';

export interface IKATATransaction {
  id: string;
  tanggal: string;
  keterangan: string;
  jumlah: number;
  jenis: TransactionType;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  locked: boolean;
}

export interface IKATASummary {
  saldoAwal: number;
  pemasukan: number;
  pengeluaran: number;
  saldoAkhir: number;
}

export interface PeriodFilter {
  bulan: number;
  tahun: number;
}

export interface TransactionFormData {
  tanggal: string;
  keterangan: string;
  jumlah: number;
  jenis: TransactionType;
} 