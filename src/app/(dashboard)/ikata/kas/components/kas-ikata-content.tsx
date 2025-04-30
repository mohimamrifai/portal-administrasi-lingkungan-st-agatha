'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PeriodFilter } from './period-filter';
import { SummaryCards } from './summary-cards';
import { TransactionsTable } from './transactions-table';
import { TransactionFormDialog } from './transaction-form-dialog';
import { PrintPDFDialog } from './print-pdf-dialog';
import { IKATASummary, IKATATransaction, PeriodFilter as PeriodFilterType, TransactionFormData } from '../types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { AlertCircle, Printer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
// import { useToast } from '@/components/ui/use-toast';
// import { useTransactions } from '@/contexts/transactions-context';

interface KasIKATAContentProps {
  summary: IKATASummary;
  transactions: IKATATransaction[];
  isLoading?: boolean;
}

export function KasIKATAContent({ summary, transactions: initialTransactions, isLoading = false }: KasIKATAContentProps) {
  const { userRole } = useAuth();
  const router = useRouter();
  // const { toast: useToastToast } = useToast();
  const [period, setPeriod] = useState<PeriodFilterType>({
    bulan: 4, // April (bulan dimulai dari 1)
    tahun: 2024,
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<IKATATransaction | null>(null);
  const [skipConfirmation, setSkipConfirmation] = useState(false);
  const [transactions, setTransactions] = useState<IKATATransaction[]>(initialTransactions);
  
  // Role definition
  const isAdmin = userRole === 'SuperUser' || userRole === 'adminLingkungan';
  const isTreasurer = userRole === 'wakilBendahara';
  const canModifyData = isAdmin || isTreasurer;

  // Filter transaksi berdasarkan periode yang dipilih
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Format tanggal transaksi: '2024-04-01' (tahun-bulan-hari)
      const dateParts = t.tanggal.split('-');
      const txYear = parseInt(dateParts[0], 10);
      const txMonth = parseInt(dateParts[1], 10); // Bulan dalam format 1-12
      
      // Bandingkan dengan period (bulan juga dalam format 1-12)
      return txMonth === period.bulan && txYear === period.tahun;
    });
  }, [transactions, period]);

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
  const hasAccess = [
    'SuperUser',
    'ketuaLingkungan',
    'wakilBendahara',
    'adminLingkungan'
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
    // Hitung ulang summary berdasarkan data transaksi saat ini
    const pemasukan = transactions
      .filter(tx => tx.jenis === 'uang_masuk')
      .reduce((sum, tx) => sum + tx.jumlah, 0);
    
    const pengeluaran = transactions
      .filter(tx => tx.jenis === 'uang_keluar')
      .reduce((sum, tx) => sum + tx.jumlah, 0);
    
    const saldoAkhir = summary.saldoAwal + pemasukan - pengeluaran;
    
    setSummaryData({
      ...summary,
      pemasukan,
      pengeluaran,
      saldoAkhir
    });
  }, [transactions, summary]);

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
      createdBy: userRole,
      updatedBy: userRole,
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
          updatedBy: userRole
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
          updatedBy: userRole
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
    
    // Kunci semua transaksi pada periode yang dipilih jika opsi 'lock' diaktifkan
    if (data.lockTransactions) {
      const updatedTransactions = transactions.map(tx => {
        // Periksa apakah transaksi termasuk dalam periode yang dipilih
        const txDate = new Date(tx.tanggal);
        if (txDate >= data.dateRange.from && txDate <= (data.dateRange.to || data.dateRange.from)) {
          return {
            ...tx,
            locked: true,
            updatedAt: new Date().toISOString(),
            updatedBy: userRole
          };
        }
        return tx;
      });
      
      setTransactions(updatedTransactions);
      toast.success("Transaksi berhasil dikunci");
    }
    
    // Reset konfirmasi
    setSkipConfirmation(false);
    
    // Tutup dialog
    setIsPrintDialogOpen(false);
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCards summary={summaryData} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <PeriodFilter period={period} onPeriodChange={setPeriod} />

        {canModifyData && (
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setEditingTransaction(null);
              setIsAddTransactionOpen(true);
            }}
          >
            Tambah Transaksi
          </Button>
        )}

        <Button
          className="w-full sm:w-auto"
          variant="outline"
          onClick={handleOpenPrintDialog}
        >
          <Printer className="h-4 w-4" /> Print PDF
        </Button>
      </div>

      <TransactionsTable
        transactions={filteredTransactions || []}
        period={period}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onToggleLock={handleToggleLock}
        canModifyData={canModifyData}
      />

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