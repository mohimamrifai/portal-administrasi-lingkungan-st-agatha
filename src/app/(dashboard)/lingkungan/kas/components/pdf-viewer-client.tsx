"use client"

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import PDFDocument from './pdf-document';
import { Transaction } from '../types';

interface PDFViewerClientProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  transactions: Transaction[];
  initialBalance: number;
}

const PDFViewerClient: React.FC<PDFViewerClientProps> = ({
  dateRange,
  transactions,
  initialBalance,
}) => {
  // Filter transaksi sesuai dengan rentang tanggal
  const filteredTransactions = transactions.filter(
    (tx) => tx.date >= dateRange.from && tx.date <= dateRange.to
  );

  return (
    <PDFViewer width="100%" height="100%" style={{ height: '100%', minHeight: '75vh', border: 'none' }}>
      <PDFDocument
        dateRange={dateRange}
        transactions={filteredTransactions}
        initialBalance={initialBalance}
      />
    </PDFViewer>
  );
};

export default PDFViewerClient; 