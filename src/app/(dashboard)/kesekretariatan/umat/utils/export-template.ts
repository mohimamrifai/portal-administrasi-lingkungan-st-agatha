import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export function exportFamilyHeadTemplate() {
  try {
    // Template data untuk diunduh
    const template = [
      {
        'Nama Kepala Keluarga': 'Contoh: Budi Santoso',
        'Tanggal Bergabung (DD/MM/YYYY)': '01/01/2023',
        'Alamat': 'Contoh: Jl. Merdeka No. 123',
        'No. Telepon': 'Contoh: 081234567890',
        'Jumlah Anak Tertanggung': '2',
        'Jumlah Kerabat Tertanggung': '1',
        'Jumlah Anggota Keluarga': '4'
      },
      {
        'Nama Kepala Keluarga': '',
        'Tanggal Bergabung (DD/MM/YYYY)': '',
        'Alamat': '',
        'No. Telepon': '',
        'Jumlah Anak Tertanggung': '',
        'Jumlah Kerabat Tertanggung': '',
        'Jumlah Anggota Keluarga': ''
      }
    ];

    // Buat workbook baru
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    
    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Template Data Umat');
    
    // Ekspor ke file Excel
    XLSX.writeFile(wb, 'template_data_umat.xlsx');
    
    toast.success('Template berhasil diunduh');
    return true;
  } catch (error) {
    console.error('Error exporting template:', error);
    toast.error('Terjadi kesalahan saat mengunduh template');
    return false;
  }
} 