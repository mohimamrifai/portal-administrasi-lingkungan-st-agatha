"use client"

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import PDFDocument from './pdf-document';
import { TransactionData } from '../types/schema';

interface PDFButtonClientProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  transactions: TransactionData[];
  summary: {
    initialBalance: number;
    totalIncome: number;
    totalExpense: number;
    finalBalance: number;
  };
}

const PDFButtonClient: React.FC<PDFButtonClientProps> = ({
  dateRange,
  transactions,
  summary,
}) => {
  // Filter transaksi sesuai dengan rentang tanggal
  const filteredTransactions = transactions.filter(
    (tx) => tx.tanggal >= dateRange.from && tx.tanggal <= dateRange.to
  );

  // Format nama file untuk download
  const fileName = `Laporan_Kas_Lingkungan_${dateRange.from.toISOString().split('T')[0]}_${dateRange.to.toISOString().split('T')[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <PDFDocument
          dateRange={dateRange}
          transactions={filteredTransactions}
          summary={summary}
        />
      }
      fileName={fileName}
      className="inline-block"
    >
      {({ loading, error }) => (
        <Button disabled={loading}>
          {loading ? 'Mempersiapkan dokumen...' : 'Unduh PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFButtonClient; 