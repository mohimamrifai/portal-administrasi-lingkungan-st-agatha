'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PeriodFilter as PeriodFilterType } from '../types';

interface PrintPDFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: PeriodFilterType;
  onPrint: (data: { period: PeriodFilterType; lockTransactions: boolean }) => void;
}

export function PrintPDFDialog({ open, onOpenChange, period, onPrint }: PrintPDFDialogProps) {
  const handlePrint = (lockTransactions: boolean) => {
    onPrint({ period, lockTransactions });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Print PDF</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pilih opsi print PDF untuk periode {new Date(2000, period.bulan - 1).toLocaleString('id-ID', { month: 'long' })} {period.tahun}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={() => handlePrint(false)}>Print Tanpa Lock</Button>
            <Button onClick={() => handlePrint(true)}>Print & Lock Transaksi</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 