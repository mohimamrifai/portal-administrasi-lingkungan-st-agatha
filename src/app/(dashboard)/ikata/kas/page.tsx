'use client';

import { KasIKATAContent } from './components/kas-ikata-content';
import { IKATASummary, IKATATransaction } from './types';

// Mock data for demonstration
const mockSummary: IKATASummary = {
  saldoAwal: 10000000,
  pemasukan: 5000000,
  pengeluaran: 2000000,
  saldoAkhir: 13000000,
};

const mockTransactions: IKATATransaction[] = [
  {
    id: '1',
    tanggal: '2024-04-01', // 1 April 2024
    keterangan: 'Iuran Anggota Bulan April - Keluarga John Doe',
    jumlah: 500000,
    jenis: 'uang_masuk',
    tipeTransaksi: 'iuran_anggota',
    debit: 500000,
    kredit: 0,
    anggotaId: '1',
    statusPembayaran: 'lunas',
    periodeBayar: ['2024-04'],
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '2',
    tanggal: '2024-04-05', // 5 April 2024
    keterangan: 'Sumbangan Anggota - Keluarga Jane Smith',
    jumlah: 1000000,
    jenis: 'uang_masuk',
    tipeTransaksi: 'sumbangan_anggota',
    debit: 1000000,
    kredit: 0,
    anggotaId: '2',
    statusPembayaran: undefined,
    periodeBayar: undefined,
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '3',
    tanggal: '2024-04-10', // 10 April 2024
    keterangan: 'Pembelian Alat Tulis dan Perlengkapan IKATA',
    jumlah: 2000000,
    jenis: 'uang_keluar',
    tipeTransaksi: 'pembelian',
    debit: 0,
    kredit: 2000000,
    anggotaId: undefined,
    statusPembayaran: undefined,
    periodeBayar: undefined,
    createdAt: '2024-04-10T00:00:00Z',
    updatedAt: '2024-04-10T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '4',
    tanggal: '2024-04-15', // 15 April 2024
    keterangan: 'Transfer Dana dari Lingkungan St. Agatha',
    jumlah: 3500000,
    jenis: 'uang_masuk',
    tipeTransaksi: 'transfer_dana_lingkungan',
    debit: 3500000,
    kredit: 0,
    anggotaId: undefined,
    statusPembayaran: undefined,
    periodeBayar: undefined,
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: true,
  },
  {
    id: '5',
    tanggal: '2024-04-18', // 18 April 2024
    keterangan: 'Kunjungan Kasih ke Anggota yang Sakit',
    jumlah: 750000,
    jenis: 'uang_keluar',
    tipeTransaksi: 'kunjungan_kasih',
    debit: 0,
    kredit: 750000,
    anggotaId: undefined,
    statusPembayaran: undefined,
    periodeBayar: undefined,
    createdAt: '2024-04-18T00:00:00Z',
    updatedAt: '2024-04-18T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '6',
    tanggal: '2024-04-20', // 20 April 2024
    keterangan: 'Iuran Anggota Bulan Januari-Maret - Keluarga Bob Johnson',
    jumlah: 1500000,
    jenis: 'uang_masuk',
    tipeTransaksi: 'iuran_anggota',
    debit: 1500000,
    kredit: 0,
    anggotaId: '3',
    statusPembayaran: 'sebagian_bulan',
    periodeBayar: ['2024-01', '2024-02', '2024-03'],
    createdAt: '2024-04-20T00:00:00Z',
    updatedAt: '2024-04-20T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '7',
    tanggal: '2024-04-22', // 22 April 2024
    keterangan: 'Cinderamata Pernikahan untuk Thomas Wilson',
    jumlah: 500000,
    jenis: 'uang_keluar',
    tipeTransaksi: 'cinderamata_pernikahan',
    debit: 0,
    kredit: 500000,
    anggotaId: undefined,
    statusPembayaran: undefined,
    periodeBayar: undefined,
    createdAt: '2024-04-22T00:00:00Z',
    updatedAt: '2024-04-22T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '8',
    tanggal: '2024-04-25', // 25 April 2024
    keterangan: 'Uang Duka untuk Keluarga Miller',
    jumlah: 1000000,
    jenis: 'uang_keluar',
    tipeTransaksi: 'uang_duka',
    debit: 0,
    kredit: 1000000,
    anggotaId: undefined,
    statusPembayaran: undefined,
    periodeBayar: undefined,
    createdAt: '2024-04-25T00:00:00Z',
    updatedAt: '2024-04-25T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '9',
    tanggal: '2024-04-27', // 27 April 2024
    keterangan: 'Penerimaan Lain-lain - Hibah dari Donatur Anonim',
    jumlah: 2500000,
    jenis: 'uang_masuk',
    tipeTransaksi: 'penerimaan_lain',
    debit: 2500000,
    kredit: 0,
    anggotaId: undefined,
    statusPembayaran: undefined,
    periodeBayar: undefined,
    createdAt: '2024-04-27T00:00:00Z',
    updatedAt: '2024-04-27T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '10',
    tanggal: '2024-04-29', // 29 April 2024
    keterangan: 'Uang Akomodasi untuk Kegiatan Bakti Sosial',
    jumlah: 1250000,
    jenis: 'uang_keluar',
    tipeTransaksi: 'uang_akomodasi',
    debit: 0,
    kredit: 1250000,
    anggotaId: undefined,
    statusPembayaran: undefined,
    periodeBayar: undefined,
    createdAt: '2024-04-29T00:00:00Z',
    updatedAt: '2024-04-29T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
];

export default function KasIKATAPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <KasIKATAContent
        summary={mockSummary}
        transactions={mockTransactions}
      />
    </div>
  );
} 