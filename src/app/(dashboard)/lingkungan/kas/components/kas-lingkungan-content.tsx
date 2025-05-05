"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { JenisTransaksi, TipeTransaksiLingkungan } from "@prisma/client"
import { Button } from "@/components/ui/button"

// Import types dan schemas baru
import { 
  TransactionData,
  TransactionFormValues, 
  PrintPdfFormValues,
  transactionFormSchema, 
  printPdfSchema,
} from "../types"

// Import actions server
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  approveTransaction
} from "../utils/actions"

// Import utilities
import {
  getMonthDateRange,
  filterTransactionsByMonth,
} from "../utils/date-utils"

// Import components
import { SummaryCards } from "./summary-cards"
import { PeriodFilter } from "./period-filter"
import { PrintPdfDialog } from "./print-pdf-dialog"
import { CreateTransactionDialog, EditTransactionDialog } from "./transaction-form-dialog"
import { TransactionsTable } from "./transactions-table"

// Definisikan props dari server component
interface KasLingkunganContentProps {
  initialTransactions: TransactionData[];
  initialSummary: {
    initialBalance: number;
    totalIncome: number;
    totalExpense: number;
    finalBalance: number;
  };
}

export default function KasLingkunganContent({ 
  initialTransactions, 
  initialSummary 
}: KasLingkunganContentProps) {
  const { userRole } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<TransactionData[]>(initialTransactions)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  const [summary, setSummary] = useState(initialSummary)

  // Memoize filteredTransactions untuk mencegah re-renders yang tidak perlu
  const filteredTransactions = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      const from = dateRange.from;
      const to = dateRange.to;
      
      return transactions.filter(tx => 
        tx.tanggal >= from && 
        tx.tanggal <= to
      );
    }
    // Jika tidak ada rentang tanggal, tampilkan semua transaksi
    return transactions;
  }, [transactions, dateRange]);

  // Memoize summary untuk mencegah re-renders
  useEffect(() => {
    // Jika ada filter rentang tanggal aktif, hitung summary berdasarkan transaksi terfilter
    if (dateRange?.from && dateRange?.to) {
      const totalIncome = filteredTransactions.reduce((sum, tx) => sum + tx.debit, 0);
      const totalExpense = filteredTransactions.reduce((sum, tx) => sum + tx.kredit, 0);
      const finalBalance = initialSummary.initialBalance + totalIncome - totalExpense;
      
      setSummary({
        initialBalance: initialSummary.initialBalance,
        totalIncome,
        totalExpense,
        finalBalance
      });
    } else {
      // Jika tidak ada filter aktif, gunakan summary dari semua transaksi
      const totalIncome = transactions.reduce((sum, tx) => sum + tx.debit, 0);
      const totalExpense = transactions.reduce((sum, tx) => sum + tx.kredit, 0);
      const finalBalance = initialSummary.initialBalance + totalIncome - totalExpense;
      
      setSummary({
        initialBalance: initialSummary.initialBalance,
        totalIncome,
        totalExpense,
        finalBalance
      });
    }
  }, [filteredTransactions, transactions, initialSummary.initialBalance, dateRange]);

  // Cek apakah pengguna memiliki hak akses ke halaman
  const hasAccess = userRole ? [
    'SUPER_USER',
    'KETUA',
    'BENDAHARA',
    'WAKIL_BENDAHARA'
  ].includes(userRole) : false

  // Cek apakah pengguna memiliki hak untuk memodifikasi data
  const canModifyData = userRole ? [
    'SUPER_USER',
    'BENDAHARA',
    'WAKIL_BENDAHARA'
  ].includes(userRole) : false

  // Redirect jika tidak memiliki akses
  useEffect(() => {
    if (!hasAccess) {
      toast.error("Anda tidak memiliki akses ke halaman ini")
      router.push("/dashboard")
    }
  }, [hasAccess, router])

  // Form untuk transaksi baru
  const createForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      tanggal: new Date(),
      keterangan: "",
      jenisTransaksi: JenisTransaksi.UANG_MASUK,
      tipeTransaksi: TipeTransaksiLingkungan.KOLEKTE_I,
      jumlah: 0,
    },
  })

  // Form untuk transaksi yang diedit
  const editForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      tanggal: new Date(),
      keterangan: "",
      jenisTransaksi: JenisTransaksi.UANG_MASUK,
      tipeTransaksi: TipeTransaksiLingkungan.KOLEKTE_I,
      jumlah: 0,
    },
  })

  // Form untuk PDF
  const pdfForm = useForm<PrintPdfFormValues>({
    resolver: zodResolver(printPdfSchema),
    defaultValues: {
      dateRange: getMonthDateRange(new Date()),
    },
  })

  // Submit transaksi baru
  async function onCreateTransactionSubmit(values: TransactionFormValues) {
    // Validasi hak akses modifikasi
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk melakukan perubahan data")
      return
    }

    try {
      // Panggil server action untuk membuat transaksi
      const result = await createTransaction({
        tanggal: values.tanggal,
        jenisTranasksi: values.jenisTransaksi,
        tipeTransaksi: values.tipeTransaksi,
        keterangan: values.keterangan,
        jumlah: values.jumlah
      });

      if (result.success) {
        toast.success("Transaksi berhasil ditambahkan");
        setCreateDialogOpen(false);
        
        // Refresh data dari server (dengan cara sederhana merefresh halaman)
        router.refresh();
        
        // Reset form
        createForm.reset({
          tanggal: new Date(),
          keterangan: "",
          jenisTransaksi: JenisTransaksi.UANG_MASUK,
          tipeTransaksi: TipeTransaksiLingkungan.KOLEKTE_I,
          jumlah: 0,
        });
      } else {
        toast.error(result.error || "Gagal menambahkan transaksi");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast.error("Terjadi kesalahan saat menambahkan transaksi");
    }
  }

  // Submit edit transaksi
  async function onEditTransactionSubmit(values: TransactionFormValues) {
    // Validasi hak akses modifikasi
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk melakukan perubahan data")
      return
    }

    if (!isEditing) return;

    try {
      // Panggil server action untuk update transaksi
      const result = await updateTransaction(isEditing, {
        tanggal: values.tanggal,
        jenisTranasksi: values.jenisTransaksi,
        tipeTransaksi: values.tipeTransaksi,
        keterangan: values.keterangan,
        jumlah: values.jumlah
      });

      if (result.success) {
        toast.success("Transaksi berhasil diperbarui");
        setEditDialogOpen(false);
        setIsEditing(null);
        
        // Refresh data dari server
        router.refresh();
      } else {
        toast.error(result.error || "Gagal memperbarui transaksi");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Terjadi kesalahan saat memperbarui transaksi");
    }
  }

  // Cetak PDF
  function onPrintPdf(values: PrintPdfFormValues) {
    // Implementasi cetak PDF tidak berubah
    toast.success("Cetak PDF berhasil");
  }

  // Handle functions dengan useCallback untuk mengurangi re-render
  const handleEditTransaction = useCallback((id: string) => {
    // Cari transaksi yang akan diedit
    const transaction = transactions.find(tx => tx.id === id);
    if (!transaction) {
      toast.error("Transaksi tidak ditemukan");
      return;
    }

    // Atur isEditing dan set form values
    setIsEditing(id);
    
    // Set form values
    editForm.reset({
      tanggal: transaction.tanggal,
      keterangan: transaction.keterangan || "",
      jenisTransaksi: transaction.jenisTransaksi,
      tipeTransaksi: transaction.tipeTransaksi,
      jumlah: transaction.jenisTransaksi === JenisTransaksi.UANG_MASUK 
        ? transaction.debit 
        : transaction.kredit,
    });
    
    setEditDialogOpen(true);
  }, [transactions, editForm]);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    // Validasi hak akses modifikasi
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk menghapus data");
      return;
    }

    try {
      const result = await deleteTransaction(id);
      
      if (result.success) {
        toast.success("Transaksi berhasil dihapus");
        
        // Refresh data dari server
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menghapus transaksi");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Terjadi kesalahan saat menghapus transaksi");
    }
  }, [canModifyData, router]);

  const handleApproveTransaction = useCallback(async (id: string) => {
    try {
      const result = await approveTransaction(id, 'APPROVED');
      
      if (result.success) {
        toast.success("Transaksi berhasil disetujui");
        
        // Refresh data dari server
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menyetujui transaksi");
      }
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast.error("Terjadi kesalahan saat menyetujui transaksi");
    }
  }, [router]);

  const handleRejectTransaction = useCallback(async (id: string) => {
    try {
      const result = await approveTransaction(id, 'REJECTED');
      
      if (result.success) {
        toast.success("Transaksi berhasil ditolak");
        
        // Refresh data dari server
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menolak transaksi");
      }
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      toast.error("Terjadi kesalahan saat menolak transaksi");
    }
  }, [router]);

  // Fungsi untuk membuka kunci transaksi yang telah diapprove (untuk SuperUser)
  const handleUnlockTransaction = useCallback(async (id: string) => {
    try {
      const result = await approveTransaction(id, 'PENDING');
      
      if (result.success) {
        toast.success("Transaksi berhasil dibuka kuncinya");
        
        // Refresh data dari server
        router.refresh();
      } else {
        toast.error(result.error || "Gagal membuka kunci transaksi");
      }
    } catch (error) {
      console.error("Error unlocking transaction:", error);
      toast.error("Terjadi kesalahan saat membuka kunci transaksi");
    }
  }, [router]);

  // Filter by date range - useCallback untuk mencegah re-render
  const handleDateRangeChange = useCallback((date: DateRange | undefined) => {
    setDateRange(date);
  }, []);

  return (
    <div className="space-y-4">
      {!hasAccess && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Anda tidak memiliki akses ke halaman ini
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <SummaryCards 
        initialBalance={summary.initialBalance}
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
        finalBalance={summary.finalBalance}
      />
      
      {/* Filter dan Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-auto">
          <PeriodFilter 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          {dateRange && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange(undefined)}
              className="h-10"
            >
              Tampilkan Semua Data
            </Button>
          )}
          
          {canModifyData && (
            <CreateTransactionDialog
              form={createForm}
              onSubmit={onCreateTransactionSubmit}
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
            />
          )}
          
          <PrintPdfDialog
            form={pdfForm}
            onSubmit={onPrintPdf}
            transactions={filteredTransactions}
            summary={summary}
          />
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="mt-6">
        <TransactionsTable
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onApprove={handleApproveTransaction}
          onReject={handleRejectTransaction}
          onUnlock={handleUnlockTransaction}
          canModifyData={canModifyData}
          canApprove={userRole === 'KETUA'}
          showPagination={true}
        />
      </div>
      
      {/* Edit Dialog */}
      {isEditing && (
        <EditTransactionDialog
          form={editForm}
          onSubmit={onEditTransactionSubmit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  )
} 