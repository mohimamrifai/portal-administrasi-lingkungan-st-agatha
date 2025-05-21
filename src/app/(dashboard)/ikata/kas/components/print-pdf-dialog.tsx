'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PeriodFilter as PeriodFilterType } from '../types';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { KasIKATAPDF } from './kas-ikata-pdf';
import { IKATASummary, IKATATransaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Download, X } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

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
  
  // Jika skipConfirmation, tampilkan PDF langsung saat dialog dibuka
  useEffect(() => {
    if (open && skipConfirmation && !isPDFReady) {
      handleViewPDF();
    }
  }, [open, skipConfirmation]);
  
  const handleViewPDF = () => {
    setIsPDFReady(true);
  };

  const handleClose = () => {
    setIsPDFReady(false);
    onOpenChange(false);
  };
  
  // Function to handle PDF download and lock transactions
  const handleDownloadPDF = () => {
    // Tanggal awal dan akhir periode cetak
    // Jika bulan = 0 (filter reset/semua data), maka ambil semua data
    let dateRange;
    
    if (period.bulan === 0) {
      // Untuk menampilkan semua data, kita bisa menggunakan tanggal yang sangat lama hingga saat ini
      const pastDate = new Date(2000, 0, 1); // 1 Januari 2000
      const futureDate = new Date(2100, 11, 31); // 31 Desember 2100
      dateRange = { from: pastDate, to: futureDate };
    } else {
      // Tanggal awal dan akhir bulan spesifik
      const firstDay = new Date(period.tahun, period.bulan - 1, 1);
      const lastDay = new Date(period.tahun, period.bulan, 0);
      dateRange = { from: firstDay, to: lastDay };
    }
    
    // Lock transactions when downloading
    onPrint({ 
      dateRange, 
      lockTransactions: true 
    });
  };
  
  // Format bulan dalam bahasa Indonesia
  const bulanText = period.bulan === 0 
    ? "Semua Data" 
    : format(new Date(period.tahun, period.bulan - 1, 1), 'MMMM', { locale: id });
    
  const tahunText = period.bulan === 0 
    ? "" 
    : period.tahun.toString();
    
  const fileName = `Laporan_Kas_IKATA_${period.bulan === 0 ? "Semua_Data" : `${bulanText}_${period.tahun}`}.pdf`;
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleClose();
      else onOpenChange(open);
    }}>
      <DialogContent className={isPDFReady ? "sm:max-w-[700px] max-h-[90vh] p-6" : "sm:max-w-[500px] p-6"}>
        <DialogHeader className="flex flex-row items-center justify-between pb-2">
          <DialogTitle>
            {isPDFReady 
              ? `Laporan Kas IKATA - ${bulanText} ${tahunText}`
              : "Cetak Laporan PDF"
            }
          </DialogTitle>
        </DialogHeader>
        
        {!isPDFReady ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {period.bulan === 0 
                ? "Cetak laporan untuk semua data transaksi" 
                : `Cetak laporan untuk periode ${format(new Date(period.tahun, period.bulan - 1, 1), 'MMMM yyyy', { locale: id })}`
              }
            </p>
            
            <Alert variant="default" className="mt-2">
              <p className="text-xs text-muted-foreground">
                Perhatian: Melihat PDF tidak akan mengunci transaksi. Penguncian transaksi hanya terjadi saat Anda mengklik tombol "Unduh PDF dan Kunci Data". Setelah dikunci, transaksi tidak dapat diedit atau dihapus kecuali oleh superuser.
              </p>
            </Alert>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button onClick={handleViewPDF}>Lihat PDF</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <PDFViewer width="100%" height="450px" className="border rounded-md shadow-sm">
              <KasIKATAPDF 
                period={period} 
                summary={summary} 
                transactions={transactions}
              />
            </PDFViewer>
            <DialogFooter className="flex flex-col md:flex-row gap-2">
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
                className="flex"
                onClick={handleDownloadPDF}
              >
                {({ loading, url }) => (
                  <Button disabled={loading}>
                    <Download className="h-4 w-4 mr-2" /> 
                    {loading ? 'Menyiapkan...' : 'Unduh PDF dan Kunci Data'}
                  </Button>
                )}
              </PDFDownloadLink>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 