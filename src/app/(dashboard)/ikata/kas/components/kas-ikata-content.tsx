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
import { IKATASummary, IKATATransaction, PeriodFilter as PeriodFilterType, TransactionFormData, SaldoAwalFormData } from '../types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { AlertCircle, Printer, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { setSaldoAwalIkata } from '../utils/kas-ikata-service';
// import { useToast } from '@/components/ui/use-toast';
// import { useTransactions } from '@/contexts/transactions-context';

interface KasIKATAContentProps {
  summary: IKATASummary;
  transactions: IKATATransaction[];
  keluargaUmatList: { id: string; namaKepalaKeluarga: string }[];
  isLoading?: boolean;
}

export function KasIKATAContent({ summary, transactions: initialTransactions, keluargaUmatList, isLoading = false }: KasIKATAContentProps) {
  const { userRole } = useAuth();
  const router = useRouter();
  // const { toast: useToastToast } = useToast();
  const [period, setPeriod] = useState<PeriodFilterType>({
    bulan: new Date().getMonth() + 1, // Default ke bulan saat ini
    tahun: new Date().getFullYear() // Default ke tahun saat ini
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<IKATATransaction | null>(null);
  const [skipConfirmation, setSkipConfirmation] = useState(false);
  const [transactions, setTransactions] = useState<IKATATransaction[]>(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<IKATATransaction[]>(initialTransactions);
  
  // State untuk menentukan apakah filter aktif atau tidak
  const [filterActive, setFilterActive] = useState(false);
  
  // Role definition
  const isAdmin = userRole === 'SUPER_USER' || userRole === 'KETUA';
  const isTreasurer = userRole === 'WAKIL_BENDAHARA';
  const canModifyData = isAdmin || isTreasurer;

  // Filter transaksi berdasarkan periode yang dipilih
  useEffect(() => {
    if (filterActive) {
      // Format tanggal transaksi: '2024-04-01' (tahun-bulan-hari)
      const filtered = transactions.filter(tx => {
        const dateParts = tx.tanggal.split('-');
        const txYear = parseInt(dateParts[0], 10);
        const txMonth = parseInt(dateParts[1], 10);
        
        return txMonth === period.bulan && txYear === period.tahun;
      });
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [transactions, period, filterActive]);

  // const { 
  //   transactions: filteredTransactions, 
  //   summaryData, 
  //   addTransaction, 
  //   updateTransaction, 
  //   deleteTransaction,
  //   toggleLockTransaction,
  //   isLoading: transactionsLoading 
  // } = useTransactions(period);

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

  if (!hasAccess) {
    return <div className="flex justify-center items-center h-64">Memeriksa akses...</div>;
  }

  const handleAddTransaction = (data: TransactionFormData) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk menambah data");
      return;
    }
    
    // Buat ID unik untuk transaksi baru
    const newId = Date.now().toString();
    
    // Tentukan nilai debit dan kredit berdasarkan jenis transaksi
    const debit = data.jenis === 'uang_masuk' ? data.jumlah : 0;
    const kredit = data.jenis === 'uang_keluar' ? data.jumlah : 0;
    
    // Buat objek transaksi baru
    const newTransaction: IKATATransaction = {
      id: newId,
      tanggal: data.tanggal,
      keterangan: data.keterangan,
      jumlah: data.jumlah,
      jenis: data.jenis,
      tipeTransaksi: data.tipeTransaksi,
      debit: debit,
      kredit: kredit,
      anggotaId: data.anggotaId,
      statusPembayaran: data.statusPembayaran,
      periodeBayar: data.periodeBayar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userRole || 'Guest',
      updatedBy: userRole || 'Guest',
      locked: false
    };
    
    // Update state dengan transaksi baru
    setTransactions(prev => [...prev, newTransaction]);
    
    // Tampilkan notifikasi sukses
    toast.success("Transaksi berhasil ditambahkan");
    
    // Tutup dialog
    setIsAddTransactionOpen(false);
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

  const handleUpdateTransaction = (data: TransactionFormData) => {
    if (!editingTransaction) return;
    
    // Tentukan nilai debit dan kredit berdasarkan jenis transaksi
    const debit = data.jenis === 'uang_masuk' ? data.jumlah : 0;
    const kredit = data.jenis === 'uang_keluar' ? data.jumlah : 0;
    
    const updatedTransactions = transactions.map(tx => {
      if (tx.id === editingTransaction.id) {
        return {
          ...tx,
          tanggal: data.tanggal,
          keterangan: data.keterangan,
          jumlah: data.jumlah,
          jenis: data.jenis,
          tipeTransaksi: data.tipeTransaksi,
          debit: debit,
          kredit: kredit,
          anggotaId: data.anggotaId,
          statusPembayaran: data.statusPembayaran,
          periodeBayar: data.periodeBayar,
          updatedAt: new Date().toISOString(),
          updatedBy: userRole || 'Guest'
        };
      }
      return tx;
    });
    
    setTransactions(updatedTransactions);
    setEditingTransaction(null);
    toast.success("Transaksi berhasil diperbarui");
    setIsAddTransactionOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
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
      
      // Hapus transaksi dari state
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      
      // Tampilkan notifikasi sukses
      toast.success("Transaksi berhasil dihapus");
    }
  };

  const handleToggleLock = (id: string) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengunci/membuka data");
      return;
    }
    
    // Update status lock pada transaksi
    const updatedTransactions = transactions.map(tx => {
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
    console.log('Print PDF:', data);
    
    // Kunci semua transaksi pada periode yang dipilih saat PDF diunduh
    if (data.lockTransactions) {
      const updatedTransactions = transactions.map(tx => {
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
    setFilterActive(true);
  };
  
  // Handler untuk mereset filter
  const handleResetFilter = () => {
    setPeriod({
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear()
    });
    setFilterActive(false);
  };

  // Fungsi untuk menangani pengaturan saldo awal
  const handleSaveSaldoAwal = async (data: SaldoAwalFormData) => {
    try {
      // Panggil API untuk menyimpan saldo awal
      const result = await setSaldoAwalIkata(data.saldoAwal);
      
      if (result.success) {
        // Update local state
        setSummaryData({
          ...summaryData,
          saldoAwal: data.saldoAwal,
          saldoAkhir: data.saldoAwal + summaryData.pemasukan - summaryData.pengeluaran
        });
        
        // Tampilkan notifikasi sukses
        toast.success(result.message || "Saldo awal berhasil disimpan");
        
        // Refresh data dengan router.refresh
        router.refresh();
      } else {
        toast.error(result.message || "Gagal menyimpan saldo awal");
      }
    } catch (error) {
      console.error("Error saving saldo awal:", error);
      toast.error("Gagal menyimpan saldo awal");
    }
  };

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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterActive}
              onChange={(e) => setFilterActive(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Filter Periode</span>
          </label>
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
    </div>
  );
} 