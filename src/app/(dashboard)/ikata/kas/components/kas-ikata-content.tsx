'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PeriodFilter } from './period-filter';
import { SummaryCards } from './summary-cards';
import { TransactionsTable } from './transactions-table';
import { TransactionFormDialog } from './transaction-form-dialog';
import { PrintPDFDialog } from './print-pdf-dialog';
import { SaldoAwalFormDialog } from './saldo-awal-form-dialog';
import { SetIkataDuesDialog, SetIkataDuesValues } from './set-ikata-dues-dialog';
import { IKATASummary, IKATATransaction, PeriodFilter as PeriodFilterType, TransactionFormData, SaldoAwalFormData, JenisTransaksi as UIJenisTransaksi, TipeTransaksi as UITipeTransaksi } from '../types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { AlertCircle, Printer, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { setSaldoAwalIkata } from '../utils/kas-ikata-service';
import { createTransaction, updateTransaction, deleteTransaction, setIkataDues, getIkataSetting } from '../utils/actions';
import { JenisTransaksi, TipeTransaksiIkata } from '@prisma/client';

interface KasIKATAContentProps {
  summary: IKATASummary;
  transactions: IKATATransaction[];
  keluargaUmatList: { id: string; namaKepalaKeluarga: string }[];
  isLoading?: boolean;
}

// Helper untuk mengkonversi hasil transaksi dari database ke format UI
const mapDbToUITransaction = (
  dbTransaction: any, 
  uiData: {
    tanggal: string;
    keterangan: string;
    jumlah: number;
    jenis: UIJenisTransaksi;
    tipeTransaksi: UITipeTransaksi;
    anggotaId?: string;
    statusPembayaran?: string;
    periodeBayar?: string[];
    totalIuran?: number;
  },
  userRole?: string
): IKATATransaction => {
  return {
    id: dbTransaction.id || Date.now().toString(),
    tanggal: uiData.tanggal,
    keterangan: uiData.keterangan,
    jumlah: uiData.jumlah,
    jenis: uiData.jenis,
    tipeTransaksi: uiData.tipeTransaksi,
    debit: uiData.jenis === 'uang_masuk' ? uiData.jumlah : 0,
    kredit: uiData.jenis === 'uang_keluar' ? uiData.jumlah : 0,
    anggotaId: uiData.anggotaId,
    statusPembayaran: uiData.statusPembayaran as any,
    periodeBayar: uiData.periodeBayar,
    totalIuran: uiData.totalIuran,
    createdAt: dbTransaction.createdAt 
      ? new Date(dbTransaction.createdAt).toISOString() 
      : new Date().toISOString(),
    updatedAt: dbTransaction.updatedAt 
      ? new Date(dbTransaction.updatedAt).toISOString() 
      : new Date().toISOString(),
    createdBy: userRole || 'Guest',
    updatedBy: userRole || 'Guest',
    locked: dbTransaction.locked || false
  };
};

export function KasIKATAContent({ summary, transactions: initialTransactions, keluargaUmatList, isLoading = false }: KasIKATAContentProps) {
  const { userRole } = useAuth();
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodFilterType>({
    bulan: new Date().getMonth() + 1, // Default ke bulan saat ini
    tahun: new Date().getFullYear() // Default ke tahun saat ini
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isSetDuesDialogOpen, setIsSetDuesDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<IKATATransaction | null>(null);
  const [skipConfirmation, setSkipConfirmation] = useState(false);
  const [transactions, setTransactions] = useState<IKATATransaction[]>(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<IKATATransaction[]>(initialTransactions);
  const [currentDuesAmount, setCurrentDuesAmount] = useState<number>(0);
  
  // State untuk saldo saat ini
  const [currentBalance, setCurrentBalance] = useState<number>(summary.saldoAwal || 0);
  
  // Role definition
  const isAdmin = userRole === 'SUPER_USER' || userRole === 'KETUA';
  const isTreasurer = userRole === 'WAKIL_BENDAHARA';
  const canModifyData = isAdmin || isTreasurer;

  // Filter transaksi berdasarkan periode yang dipilih
  useEffect(() => {
    // Format tanggal transaksi: '2024-04-01' (tahun-bulan-hari)
    const filtered = transactions.filter(tx => {
      const dateParts = tx.tanggal.split('-');
      const txYear = parseInt(dateParts[0], 10);
      const txMonth = parseInt(dateParts[1], 10);
      
      return txMonth === period.bulan && txYear === period.tahun;
    });
    setFilteredTransactions(filtered);
  }, [transactions, period]);

  // Cek apakah pengguna memiliki hak akses ke halaman
  const hasAccess = userRole && [
    'SUPER_USER',
    'KETUA',
    'WAKIL_BENDAHARA'
  ].includes(userRole);

  // Redirect jika tidak memiliki akses
  useEffect(() => {
    if (!hasAccess) {
      toast.error("Anda tidak memiliki akses ke halaman ini");
      router.push("/dashboard");
    }
  }, [hasAccess, router]);

  // Menghitung ulang ringkasan keuangan berdasarkan transaksi yang difilter
  const [summaryData, setSummaryData] = useState<IKATASummary>(summary);

  useEffect(() => {
    // Gunakan data summary langsung dari server, bukan menghitung ulang di sisi klien
    setSummaryData(summary);
  }, [summary]);

  useEffect(() => {
    // Check for URL parameters when component mounts
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const keluargaId = urlParams.get('keluargaId');
      
      if (keluargaId) {
        // Auto-open transaction form dialog with pre-filled data
        setIsAddTransactionOpen(true);
      }
    }
  }, []);

  if (!hasAccess) {
    return <div className="flex justify-center items-center h-64">Memeriksa akses...</div>;
  }

  const handleAddTransaction = async (data: TransactionFormData) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk menambah data");
      return;
    }
    
    try {
      // Parse tanggal dengan benar
      const tanggalParts = data.tanggal.split('-');
      const tanggalObj = new Date(
        parseInt(tanggalParts[0]), 
        parseInt(tanggalParts[1]) - 1, 
        parseInt(tanggalParts[2])
      );
      
      // Tentukan jenis dan tipe transaksi dalam format yang sesuai dengan server
      const jenisTranasksi: JenisTransaksi = 
        data.jenis === 'uang_masuk' ? JenisTransaksi.UANG_MASUK : JenisTransaksi.UANG_KELUAR;
      
      // Map tipe transaksi dari UI ke enum database
      const tipeTransaksiMap: Record<string, TipeTransaksiIkata> = {
        'iuran_anggota': TipeTransaksiIkata.IURAN_ANGGOTA,
        'transfer_dana_lingkungan': TipeTransaksiIkata.TRANSFER_DANA_DARI_LINGKUNGAN,
        'sumbangan_anggota': TipeTransaksiIkata.SUMBANGAN_ANGGOTA,
        'penerimaan_lain': TipeTransaksiIkata.PENERIMAAN_LAIN,
        'uang_duka': TipeTransaksiIkata.UANG_DUKA_PAPAN_BUNGA,
        'kunjungan_kasih': TipeTransaksiIkata.KUNJUNGAN_KASIH,
        'cinderamata_kelahiran': TipeTransaksiIkata.CINDERAMATA_KELAHIRAN,
        'cinderamata_pernikahan': TipeTransaksiIkata.CINDERAMATA_PERNIKAHAN,
        'uang_akomodasi': TipeTransaksiIkata.UANG_AKOMODASI,
        'pembelian': TipeTransaksiIkata.PEMBELIAN,
        'lain_lain': TipeTransaksiIkata.LAIN_LAIN
      };
      
      const tipeTransaksi = tipeTransaksiMap[data.tipeTransaksi];
      
      // Kirim ke server action
      const result = await createTransaction({
        tanggal: tanggalObj,
        jenisTranasksi,
        tipeTransaksi,
        keterangan: data.keterangan,
        jumlah: data.jumlah,
        keluargaId: data.anggotaId,
        totalIuran: data.totalIuran
      });
      
      // Buat transaksi UI baru dari hasil
      const newTransaction = mapDbToUITransaction(
        result,
        data,
        userRole
      );
      
      // Update state dengan transaksi baru
      setTransactions(prev => [...prev, newTransaction]);
      
      // Tampilkan notifikasi sukses
      toast.success("Transaksi berhasil ditambahkan");
      
      // Tutup dialog
      setIsAddTransactionOpen(false);
      
      // Jika ini adalah untuk iuran anggota, tampilkan notifikasi tambahan
      if (data.tipeTransaksi === 'iuran_anggota' && data.anggotaId) {
        const anggota = keluargaUmatList.find(a => a.id === data.anggotaId);
        if (anggota) {
          toast.success(`Notifikasi Terkirim ke ${anggota.namaKepalaKeluarga}`, {
            description: `Iuran sebesar Rp ${data.jumlah.toLocaleString('id-ID')} telah berhasil dibukukan.`
          });
        }
      }
    } catch (error: any) {
      toast.error("Gagal menyimpan transaksi", { 
        description: error.message || "Terjadi kesalahan saat menyimpan transaksi" 
      });
    }
  };

  const handleEditTransaction = (id: string) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengubah data");
      return;
    }
    
    // Cari transaksi yang akan diedit
    const transaction = transactions.find(tx => tx.id === id);
    
    if (transaction) {
      if (transaction.locked) {
        toast.error("Transaksi terkunci tidak dapat diedit");
        return;
      }
      
      // Set transaksi yang sedang diedit
      setEditingTransaction(transaction);
      
      // Buka dialog edit
      setIsAddTransactionOpen(true);
    }
  };

  const handleUpdateTransaction = async (data: TransactionFormData) => {
    if (!editingTransaction) return;
    
    try {
      // Parse tanggal dengan benar
      const tanggalParts = data.tanggal.split('-');
      const tanggalObj = new Date(
        parseInt(tanggalParts[0]), 
        parseInt(tanggalParts[1]) - 1, 
        parseInt(tanggalParts[2])
      );
      
      // Tentukan jenis dan tipe transaksi dalam format yang sesuai dengan server
      const jenisTranasksi: JenisTransaksi = 
        data.jenis === 'uang_masuk' ? JenisTransaksi.UANG_MASUK : JenisTransaksi.UANG_KELUAR;
      
      // Map tipe transaksi dari UI ke enum database
      const tipeTransaksiMap: Record<string, TipeTransaksiIkata> = {
        'iuran_anggota': TipeTransaksiIkata.IURAN_ANGGOTA,
        'transfer_dana_lingkungan': TipeTransaksiIkata.TRANSFER_DANA_DARI_LINGKUNGAN,
        'sumbangan_anggota': TipeTransaksiIkata.SUMBANGAN_ANGGOTA,
        'penerimaan_lain': TipeTransaksiIkata.PENERIMAAN_LAIN,
        'uang_duka': TipeTransaksiIkata.UANG_DUKA_PAPAN_BUNGA,
        'kunjungan_kasih': TipeTransaksiIkata.KUNJUNGAN_KASIH,
        'cinderamata_kelahiran': TipeTransaksiIkata.CINDERAMATA_KELAHIRAN,
        'cinderamata_pernikahan': TipeTransaksiIkata.CINDERAMATA_PERNIKAHAN,
        'uang_akomodasi': TipeTransaksiIkata.UANG_AKOMODASI,
        'pembelian': TipeTransaksiIkata.PEMBELIAN,
        'lain_lain': TipeTransaksiIkata.LAIN_LAIN
      };
      
      const tipeTransaksi = tipeTransaksiMap[data.tipeTransaksi];
      
      // Kirim ke server action
      const result = await updateTransaction(editingTransaction.id, {
        tanggal: tanggalObj,
        jenisTranasksi,
        tipeTransaksi,
        keterangan: data.keterangan,
        jumlah: data.jumlah,
        keluargaId: data.anggotaId,
        totalIuran: data.totalIuran
      });
      
      // Update state dengan data yang diperbarui
      const updatedTransactions: IKATATransaction[] = transactions.map(tx => {
        if (tx.id === editingTransaction.id) {
          return mapDbToUITransaction(
            result,
            data,
            userRole
          );
        }
        return tx;
      });
      
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
      toast.success("Transaksi berhasil diperbarui");
      setIsAddTransactionOpen(false);
    } catch (error: any) {
      toast.error("Gagal memperbarui transaksi", { 
        description: error.message || "Terjadi kesalahan saat memperbarui transaksi" 
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk menghapus data");
      return;
    }
    
    // Cari transaksi yang akan dihapus
    const transaction = transactions.find(tx => tx.id === id);
    
    if (transaction) {
      if (transaction.locked) {
        toast.error("Transaksi terkunci tidak dapat dihapus");
        return;
      }
      
      try {
        // Hapus transaksi dari server
        await deleteTransaction(id);
        
        // Hapus transaksi dari state
        setTransactions(prev => prev.filter(tx => tx.id !== id));
        
        // Tampilkan notifikasi sukses
        toast.success("Transaksi berhasil dihapus");
      } catch (error: any) {
        toast.error("Gagal menghapus transaksi", {
          description: error.message || "Terjadi kesalahan saat menghapus transaksi"
        });
      }
    }
  };

  const handleToggleLock = (id: string) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengunci/membuka data");
      return;
    }
    
    // Update status lock pada transaksi
    const updatedTransactions: IKATATransaction[] = transactions.map(tx => {
      if (tx.id === id) {
        return {
          ...tx,
          locked: !tx.locked,
          updatedAt: new Date().toISOString(),
          updatedBy: userRole || 'Guest'
        };
      }
      return tx;
    });
    
    setTransactions(updatedTransactions);
    
    // Tampilkan notifikasi sukses
    const transaction = updatedTransactions.find(tx => tx.id === id);
    if (transaction) {
      toast.success(`Transaksi berhasil ${transaction.locked ? 'dikunci' : 'dibuka'}`);
    }
  };

  const handleOpenPrintDialog = () => {
    setSkipConfirmation(true);
    setIsPrintDialogOpen(true);
  };

  const handlePrintPDF = (data: any) => {
    // Kunci semua transaksi pada periode yang dipilih saat PDF diunduh
    if (data.lockTransactions) {
      const updatedTransactions: IKATATransaction[] = transactions.map(tx => {
        // Periksa apakah transaksi termasuk dalam periode yang dipilih
        const txDate = new Date(tx.tanggal);
        if (txDate >= data.dateRange.from && txDate <= (data.dateRange.to || data.dateRange.from)) {
          return {
            ...tx,
            locked: true,
            updatedAt: new Date().toISOString(),
            updatedBy: userRole || 'Guest'
          };
        }
        return tx;
      });
      
      setTransactions(updatedTransactions);
      toast.success("Transaksi berhasil dikunci");
    }
    
    // Reset konfirmasi
    setSkipConfirmation(false);
    
    // Tutup dialog setelah unduh selesai jika transaksi dikunci
    if (data.lockTransactions) {
      setIsPrintDialogOpen(false);
    }
  };

  // Handler untuk memfilter transaksi berdasarkan periode
  const handlePeriodChange = (newPeriod: PeriodFilterType) => {
    setPeriod(newPeriod);
  };

  // Fungsi untuk menangani pengaturan saldo awal
  const handleSaveSaldoAwal = async (data: SaldoAwalFormData) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengubah saldo awal");
      return;
    }
    
    try {
      const result = await setSaldoAwalIkata(data.saldoAwal);
      
      if (result.success) {
        toast.success("Saldo awal berhasil disimpan");
        setCurrentBalance(data.saldoAwal);
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menyimpan saldo awal");
      }
    } catch (error) {
      console.error("Error saving saldo awal:", error);
      toast.error("Terjadi kesalahan saat menyimpan saldo awal");
    }
  };

  // Handler untuk pengaturan iuran IKATA
  const handleSetDues = async (values: SetIkataDuesValues) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengatur iuran");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("year", values.year.toString());
      formData.append("amount", values.amount.toString());

      const result = await setIkataDues(formData);
      
      if (result.success) {
        toast.success(`Iuran IKATA tahun ${values.year} berhasil diatur: Rp ${values.amount.toLocaleString('id-ID')}`);
        setCurrentDuesAmount(values.amount);
        router.refresh();
      } else {
        toast.error(result.error || "Gagal mengatur iuran IKATA");
      }
    } catch (error) {
      console.error("Error setting IKATA dues:", error);
      toast.error("Terjadi kesalahan saat mengatur iuran IKATA");
    }
  };

  // Ambil pengaturan iuran saat ini
  useEffect(() => {
    const fetchCurrentDues = async () => {
      try {
        const result = await getIkataSetting(period.tahun);
        if (result.success && result.data) {
          setCurrentDuesAmount((result.data as { year: number; amount: number }).amount);
        }
      } catch (error) {
        console.error("Error fetching current dues:", error);
      }
    };

    fetchCurrentDues();
  }, [period.tahun]);

  return (
    <div className="space-y-6">
      {!canModifyData && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mode Hanya Baca</AlertTitle>
          <AlertDescription>
            Anda hanya dapat melihat data kas IKATA. Untuk menambah, mengubah, atau menghapus data, hubungi Wakil Bendahara atau Admin Lingkungan.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Kas IKATA</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <PeriodFilter period={period} onPeriodChange={handlePeriodChange} />
          
          {/* Tombol Aksi */}
          <div className="flex flex-wrap gap-2">
            {canModifyData && (
              <Button 
                onClick={() => setIsAddTransactionOpen(true)} 
                disabled={isLoading}
              >
                Tambah Transaksi
              </Button>
            )}
            
            <Button 
              onClick={handleOpenPrintDialog} 
              variant="outline"
              disabled={isLoading}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print PDF
            </Button>
            
            {canModifyData && (
              <>
                <SaldoAwalFormDialog
                  onSubmit={handleSaveSaldoAwal}
                  currentBalance={currentBalance}
                />
                
                <Button 
                  onClick={() => setIsSetDuesDialogOpen(true)} 
                  variant="outline"
                  disabled={isLoading}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Atur Iuran
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <SummaryCards summary={summaryData} />

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable 
            transactions={filteredTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onToggleLock={handleToggleLock}
            canModifyData={canModifyData}
          />
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={isAddTransactionOpen}
        onOpenChange={(open) => {
          setIsAddTransactionOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        onSubmit={(data) => {
          if (!canModifyData) {
            toast.error("Anda tidak memiliki izin untuk menambah data");
            return;
          }
          
          if (editingTransaction) {
            handleUpdateTransaction(data);
          } else {
            handleAddTransaction(data);
          }
        }}
        editTransaction={editingTransaction}
        keluargaUmatList={keluargaUmatList}
      />

      <PrintPDFDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        period={period}
        summary={summaryData}
        skipConfirmation={skipConfirmation}
        transactions={filteredTransactions}
        onPrint={handlePrintPDF}
      />

      <SetIkataDuesDialog
        open={isSetDuesDialogOpen}
        onOpenChange={setIsSetDuesDialogOpen}
        onSubmit={handleSetDues}
        currentAmount={currentDuesAmount}
      />
    </div>
  );
} 