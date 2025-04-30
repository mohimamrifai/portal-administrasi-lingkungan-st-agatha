import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
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
  // Menentukan judul dialog berdasarkan kategori
  const getDialogTitle = () => {
    let catTitle = "";
    
    // Tambahkan kategori dokumen
    switch (documentCategory) {
      case "bukti_terima_uang":
        catTitle = "Bukti Terima Uang";
        break;
      case "setor_ke_paroki":
        catTitle = "Setor ke Paroki";
        break;
    }
    
    // Format bulan jika ada
    const monthName = month 
      ? new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(year, month - 1, 1))
      : "";
    
    // Bentuk judul lengkap
    return `Bukti Pembayaran - ${catTitle} - ${monthName} ${year}`;
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
        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 