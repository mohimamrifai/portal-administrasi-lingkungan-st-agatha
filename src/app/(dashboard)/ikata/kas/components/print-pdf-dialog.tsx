'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PeriodFilter as PeriodFilterType } from '../types';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { KasIKATAPDF } from './kas-ikata-pdf';
import { IKATASummary, IKATATransaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Download } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PrintPDFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: PeriodFilterType;
  summary: IKATASummary;
  skipConfirmation?: boolean;
  transactions?: IKATATransaction[];
  onPrint: (data: { dateRange: { from: Date; to: Date }; lockTransactions: boolean }) => void;
}

export function PrintPDFDialog({ 
  open, 
  onOpenChange, 
  period, 
  summary, 
  skipConfirmation = false,
  transactions = [],
  onPrint 
}: PrintPDFDialogProps) {
  const [isPDFReady, setIsPDFReady] = useState(false);
  const [lockTransactions, setLockTransactions] = useState(false);
  
  // Jika skipConfirmation, tampilkan PDF langsung saat dialog dibuka
  useEffect(() => {
    if (open && skipConfirmation && !isPDFReady) {
      handlePrint();
    }
  }, [open, skipConfirmation]);
  
  const handlePrint = () => {
    // Tanggal awal dan akhir bulan
    const firstDay = new Date(period.tahun, period.bulan - 1, 1);
    const lastDay = new Date(period.tahun, period.bulan, 0);
    
    onPrint({ 
      dateRange: { 
        from: firstDay, 
        to: lastDay 
      }, 
      lockTransactions 
    });
    setIsPDFReady(true);
  };

  const handleClose = () => {
    setIsPDFReady(false);
    setLockTransactions(false);
    onOpenChange(false);
  };
  
  // Format bulan dalam bahasa Indonesia
  const bulanText = format(new Date(period.tahun, period.bulan - 1, 1), 'MMMM', { locale: id });
  const fileName = `Laporan_Kas_IKATA_${bulanText}_${period.tahun}.pdf`;
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleClose();
      else onOpenChange(open);
    }}>
      <DialogContent className={isPDFReady ? "sm:max-w-[750px] w-full max-h-[90vh]" : ""}>
        <DialogHeader>
          <DialogTitle>
            {isPDFReady 
              ? `Laporan Kas IKATA - ${bulanText} ${period.tahun}`
              : "Print PDF"
            }
          </DialogTitle>
        </DialogHeader>
        
        {!isPDFReady ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pilih opsi print PDF untuk periode {format(new Date(period.tahun, period.bulan - 1, 1), 'MMMM yyyy', { locale: id })}
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lock-transactions" 
                checked={lockTransactions}
                onCheckedChange={(checked) => setLockTransactions(!!checked)}
              />
              <Label 
                htmlFor="lock-transactions" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Kunci semua transaksi saat cetak
              </Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button onClick={handlePrint}>Lihat PDF</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <PDFViewer width="100%" height="500px" className="border">
              <KasIKATAPDF 
                period={period} 
                summary={summary} 
                transactions={transactions}
              />
            </PDFViewer>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Tutup
              </Button>
              <PDFDownloadLink
                document={
                  <KasIKATAPDF 
                    period={period} 
                    summary={summary} 
                    transactions={transactions}
                  />
                }
                fileName={fileName}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    <Download className="h-4 w-4 mr-2" /> 
                    {loading ? 'Menyiapkan...' : 'Download'}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 