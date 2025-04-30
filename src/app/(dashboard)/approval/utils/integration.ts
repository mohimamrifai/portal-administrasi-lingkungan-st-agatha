/**
 * Tipe data untuk item Doling yang disetujui
 */
export interface ApprovedDolingItem {
  id: number
  tanggal: Date
  kolekte1: number
  kolekte2: number
  ucapanSyukur: number
  keterangan?: string
  jumlahHadir: number
}

/**
 * Integrasi data Detil Doling ke Kas Lingkungan
 * @param dolingData Data Detil Doling yang disetujui
 * @returns Promise yang menyelesaikan setelah integrasi berhasil
 */
export async function integrateToKasLingkungan(dolingData: ApprovedDolingItem): Promise<boolean> {
  try {
    // Simulasi delay integrasi
    await new Promise(resolve => setTimeout(resolve, 800))

    // Format data untuk kas lingkungan (masing-masing pemasukan)
    const kasTransaksi: any[] = [];
    if (dolingData.kolekte1 > 0) {
      kasTransaksi.push({
        date: dolingData.tanggal,
        description: `Kolekte I - ${dolingData.keterangan || ''}`,
        type: "debit", // pemasukan
        subtype: "Kolekte I",
        amount: dolingData.kolekte1,
        fromIkata: false,
      });
    }
    if (dolingData.kolekte2 > 0) {
      kasTransaksi.push({
        date: dolingData.tanggal,
        description: `Kolekte II - ${dolingData.keterangan || ''}`,
        type: "debit",
        subtype: "Kolekte II",
        amount: dolingData.kolekte2,
        fromIkata: false,
      });
    }
    if (dolingData.ucapanSyukur > 0) {
      kasTransaksi.push({
        date: dolingData.tanggal,
        description: `Ucapan Syukur - ${dolingData.keterangan || ''}`,
        type: "debit",
        subtype: "Ucapan Syukur",
        amount: dolingData.ucapanSyukur,
        fromIkata: false,
      });
    }

    kasTransaksi.forEach(trx => {
      console.log('Data pemasukan berhasil diintegrasikan ke Kas Lingkungan:', trx)
    });

    return true
  } catch (error) {
    console.error('Gagal mengintegrasikan data ke Kas Lingkungan:', error)
    return false
  }
}

/**
 * Memeriksa apakah data Doling sudah terintegrasi ke Kas Lingkungan
 * @param dolingId ID Detil Doling
 * @returns Promise yang menyelesaikan dengan boolean hasil pemeriksaan
 */
export async function checkIntegrationStatus(dolingId: number): Promise<boolean> {
  // Simulasi pengecekan ke database
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Dalam implementasi nyata, ini akan mencari di database kas
  // apakah transaksi dengan dolingId sudah ada
  const isIntegrated = Math.random() > 0.2 // 80% sudah terintegrasi (untuk simulasi)
  
  return isIntegrated
}

/**
 * Mendapatkan riwayat integrasi data Doling ke Kas Lingkungan
 * @returns Promise yang menyelesaikan dengan array riwayat integrasi
 */
export async function getIntegrationHistory(): Promise<{
  dolingId: number
  tanggal: Date
  tuanRumah: string
  biaya: number
  integrationDate: Date
  status: 'success' | 'failed'
}[]> {
  // Simulasi delay pengambilan data
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Data contoh untuk riwayat integrasi
  return [
    {
      dolingId: 1,
      tanggal: new Date(2024, 3, 15),
      tuanRumah: "Budi Santoso",
      biaya: 350000,
      integrationDate: new Date(2024, 3, 16),
      status: 'success'
    },
    {
      dolingId: 3,
      tanggal: new Date(2024, 3, 8),
      tuanRumah: "Joko Susilo",
      biaya: 400000,
      integrationDate: new Date(2024, 3, 10),
      status: 'success'
    },
    {
      dolingId: 5,
      tanggal: new Date(2024, 2, 18),
      tuanRumah: "Agus Wijaya",
      biaya: 275000,
      integrationDate: new Date(2024, 2, 20),
      status: 'failed'
    }
  ]
} 