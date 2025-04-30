import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Download, Lock } from 'lucide-react';
import { DanaMandiriTransaction } from '../types';
import BuktiTerimaUangPDF from './bukti-terima-uang-pdf';
import SetorKeParokiPDF from './setor-ke-paroki-pdf';

interface PDFViewerComponentProps {
  documentType: string;
  documentCategory: "bukti_terima_uang" | "setor_ke_paroki";
  transactions: DanaMandiriTransaction[];
  month?: number;
  year: number;
}

export default function PDFViewerComponent({
  documentType,
  documentCategory,
  transactions,
  month,
  year
}: PDFViewerComponentProps) {
  // Filter transactions by month and year
  let filteredTransactions = transactions;
  
  // Filter by year first
  filteredTransactions = transactions.filter(tx => tx.year === year);
  
  // Then by month if specified
  if (month) {
    filteredTransactions = filteredTransactions.filter(tx => {
      // Get month of the transaction payment date (1-12)
      const txMonth = tx.paymentDate.getMonth() + 1;
      return txMonth === month;
    });
  }
  
  // Sort transactions by payment date
  filteredTransactions = filteredTransactions.sort((a, b) => {
    return a.paymentDate.getTime() - b.paymentDate.getTime();
  });

  // Handle document download success
  const handleDownloadSuccess = () => {
    let documentName = "";
    switch (documentType) {
      case "payment_receipt":
        documentName = "Bukti Pembayaran";
        break;
      case "yearly_report":
        documentName = "Laporan Tahunan";
        break;
      case "debt_report":
        documentName = "Laporan Tunggakan";
        break;
      default:
        documentName = "Dokumen";
    }
    
    let categoryName = "";
    switch (documentCategory) {
      case "bukti_terima_uang":
        categoryName = "Bukti Terima Uang";
        break;
      case "setor_ke_paroki":
        categoryName = "Setor ke Paroki";
        break;
      default:
        categoryName = "";
    }
    
    const formattedYear = year ? ` tahun ${year}` : "";
    const formattedMonth = month ? ` bulan ${new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(year, month - 1, 1))}` : "";
    
    // Tampilkan notifikasi berhasil unduh
    toast.success(`${documentName} ${categoryName}${formattedMonth}${formattedYear} berhasil diunduh`);
    
    // Jika dokumen adalah laporan tahunan, tambahkan notifikasi tentang status lock
    if (documentType === "yearly_report") {
      toast.info(
        `Transaksi Dana Mandiri${formattedYear} telah dikunci secara otomatis`,
        {
          icon: <Lock className="h-4 w-4" />
        }
      );
    }
  };
  
  const getPdfDocument = () => {
    if (documentCategory === "bukti_terima_uang") {
      return (
        <BuktiTerimaUangPDF 
          transactions={filteredTransactions} 
          month={month} 
          year={year} 
        />
      );
    } else {
      return (
        <SetorKeParokiPDF 
          transactions={filteredTransactions} 
          month={month} 
          year={year} 
        />
      );
    }
  };
  
  const getFileName = () => {
    const docPrefix = documentType === "payment_receipt" ? "Bukti_Pembayaran" : 
                     (documentType === "yearly_report" ? "Laporan_Tahunan" : "Laporan_Tunggakan");
    const categoryPrefix = documentCategory === "bukti_terima_uang" ? "BTU" : "SKP";
    const monthStr = month ? `_Bulan_${month}` : "";
    return `${docPrefix}_${categoryPrefix}${monthStr}_Tahun_${year}.pdf`;
  };
  
  // Check if document has transactions
  const hasTransactions = filteredTransactions.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          {hasTransactions ? 
            `${filteredTransactions.length} transaksi ditemukan` : 
            'Tidak ada transaksi dalam periode yang dipilih'}
        </div>
        {hasTransactions ? (
          <PDFDownloadLink 
            document={getPdfDocument()} 
            fileName={getFileName()}
            className="no-underline"
          >
            {({ loading, error }) => (
              <Button 
                variant="outline" 
                disabled={loading || !!error}
                onClick={loading ? undefined : handleDownloadSuccess}
              >
                <Download className="mr-2 h-4 w-4" />
                {loading ? "Mempersiapkan Dokumen..." : 
                 error ? "Error" : "Unduh PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        ) : (
          <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" />
            Tidak Ada Data
          </Button>
        )}
      </div>
      <div className="overflow-auto flex-1" style={{ height: "calc(100% - 50px)" }}>
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          {getPdfDocument()}
        </PDFViewer>
      </div>
    </div>
  );
} 