import React from 'react';
import { Button } from '@/components/ui/button';
import { Transaction } from '../types';
import dynamic from 'next/dynamic';

// Import komponen client secara dinamis
const PDFButtonClient = dynamic(
  () => import('./pdf-button-client'),
  { ssr: false }
);

const PDFViewerClient = dynamic(
  () => import('./pdf-viewer-client'),
  { ssr: false }
);

interface PDFViewerComponentProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  transactions: Transaction[];
  initialBalance: number;
  onClose: () => void;
}

const PDFViewerComponent: React.FC<PDFViewerComponentProps> = ({
  dateRange,
  transactions,
  initialBalance,
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Preview Laporan Kas</h2>
        <div className="flex gap-2">
          <PDFButtonClient
            dateRange={dateRange}
            transactions={transactions}
            initialBalance={initialBalance}
          />
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <PDFViewerClient
          dateRange={dateRange}
          transactions={transactions}
          initialBalance={initialBalance}
        />
      </div>
    </div>
  );
};

export default PDFViewerComponent; 