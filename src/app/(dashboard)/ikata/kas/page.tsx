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
    tanggal: '2024-04-01',
    keterangan: 'Iuran Anggota',
    jumlah: 500000,
    jenis: 'iuran',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '2',
    tanggal: '2024-04-05',
    keterangan: 'Sumbangan Anggota',
    jumlah: 1000000,
    jenis: 'sumbangan',
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
    locked: false,
  },
  {
    id: '3',
    tanggal: '2024-04-10',
    keterangan: 'Pembelian Perlengkapan',
    jumlah: 2000000,
    jenis: 'pengeluaran',
    createdAt: '2024-04-10T00:00:00Z',
    updatedAt: '2024-04-10T00:00:00Z',
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