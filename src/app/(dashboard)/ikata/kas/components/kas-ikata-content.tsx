'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PeriodFilter } from './period-filter';
import { SummaryCards } from './summary-cards';
import { TransactionsTable } from './transactions-table';
import { TransactionFormDialog } from './transaction-form-dialog';
import { PrintPDFDialog } from './print-pdf-dialog';
import { IKATASummary, IKATATransaction, PeriodFilter as PeriodFilterType } from '../types';

interface KasIKATAContentProps {
  summary: IKATASummary;
  transactions: IKATATransaction[];
  isLoading?: boolean;
}

export function KasIKATAContent({ summary, transactions, isLoading = false }: KasIKATAContentProps) {
  const [period, setPeriod] = useState<PeriodFilterType>({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kas IKATA</h1>
        <div className="flex gap-4">
          <PeriodFilter period={period} onPeriodChange={setPeriod} />
          <Button onClick={() => setIsAddTransactionOpen(true)}>Tambah Transaksi</Button>
          <Button variant="outline" onClick={() => setIsPrintDialogOpen(true)}>Print PDF</Button>
        </div>
      </div>

      <SummaryCards summary={summary} />

      <Card>
        <CardHeader>
          <CardTitle>Data Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable
            transactions={transactions}
            period={period}
            onEdit={(id) => console.log('Edit transaction:', id)}
            onDelete={(id) => console.log('Delete transaction:', id)}
            onToggleLock={(id) => console.log('Toggle lock:', id)}
          />
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onSubmit={(data) => console.log('Submit transaction:', data)}
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