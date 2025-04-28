'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PeriodFilter } from './period-filter';
import { SummaryCards } from './summary-cards';
import { TransactionsTable } from './transactions-table';
import { TransactionFormDialog } from './transaction-form-dialog';
import { PrintPDFDialog } from './print-pdf-dialog';
import { IKATASummary, IKATATransaction, PeriodFilter as PeriodFilterType } from '../types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
// import { useToast } from '@/components/ui/use-toast';
// import { useTransactions } from '@/contexts/transactions-context';

interface KasIKATAContentProps {
  summary: IKATASummary;
  transactions: IKATATransaction[];
  isLoading?: boolean;
}

export function KasIKATAContent({ summary, transactions, isLoading = false }: KasIKATAContentProps) {
  const { userRole } = useAuth();
  const router = useRouter();
  // const { toast: useToastToast } = useToast();
  const [period, setPeriod] = useState<PeriodFilterType>({
    bulan: new Date().getMonth(),
    tahun: new Date().getFullYear(),
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<IKATATransaction | null>(null);
  // Role definition
  const isAdmin = userRole === 'SuperUser' || userRole === 'adminLingkungan';
  const isTreasurer = userRole === 'wakilBendahara';
  const canModifyData = isAdmin || isTreasurer;

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

  if (!hasAccess) {
    return <div className="flex justify-center items-center h-64">Memeriksa akses...</div>;
  }

  const handleEditTransaction = (id: string) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengubah data");
      return;
    }
    console.log('Edit transaction:', id);
  };

  const handleDeleteTransaction = (id: string) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk menghapus data");
      return;
    }
    console.log('Delete transaction:', id);
  };

  const handleToggleLock = (id: string) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengunci/membuka data");
      return;
    }
    console.log('Toggle lock:', id);
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
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <PeriodFilter period={period} onPeriodChange={setPeriod} />
          
          {canModifyData && (
            <Button 
              className="w-full sm:w-auto" 
              onClick={() => setIsAddTransactionOpen(true)}
            >
              Tambah Transaksi
            </Button>
          )}
          
          <Button 
            className="w-full sm:w-auto" 
            variant="outline" 
            onClick={() => setIsPrintDialogOpen(true)}
          >
            Print PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCards summary={summary} />
      </div>

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Data Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable
            transactions={transactions || []}
            period={period}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onToggleLock={handleToggleLock}
            canModifyData={canModifyData}
          />
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onSubmit={(data) => {
          if (!canModifyData) {
            toast.error("Anda tidak memiliki izin untuk menambah data");
            return;
          }
          console.log('Submit transaction:', data);
          setIsAddTransactionOpen(false);
        }}
      />

      <PrintPDFDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        period={period}
        onPrint={(data) => console.log('Print PDF:', data)}
      />
    </div>
  );
} 