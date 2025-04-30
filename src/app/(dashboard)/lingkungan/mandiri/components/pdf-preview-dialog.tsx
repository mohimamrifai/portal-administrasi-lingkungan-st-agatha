import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DanaMandiriTransaction } from '../types';
import PDFViewerComponent from './pdf-viewer';

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: string;
  documentCategory: "bukti_terima_uang" | "setor_ke_paroki";
  transactions: DanaMandiriTransaction[];
  month?: number;
  year: number;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  documentType,
  documentCategory,
  transactions,
  month,
  year,
}: PDFPreviewDialogProps) {
  // Menentukan judul dialog berdasarkan jenis dokumen
  const getDialogTitle = () => {
    let title = "Pratinjau Dokumen";
    
    switch (documentType) {
      case "payment_receipt":
        title = "Pratinjau Bukti Pembayaran";
        break;
      case "yearly_report":
        title = "Pratinjau Laporan Tahunan";
        break;
      case "debt_report":
        title = "Pratinjau Laporan Tunggakan";
        break;
    }
    
    return title;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[90vw] w-[90vw] max-h-[85vh] h-[85vh] p-4 md:p-6 flex flex-col overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-2 flex-shrink-0">
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <PDFViewerComponent
            documentType={documentType}
            documentCategory={documentCategory}
            transactions={transactions}
            month={month}
            year={year}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 