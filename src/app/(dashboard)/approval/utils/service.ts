import { ApprovalItem } from "../types"
import { generateApprovalData, getApprovalHistory, getAdministrators } from "./mock-data"
import { integrateToKasLingkungan } from "./integration"
import { sendApprovalNotification, sendRejectionNotification } from "./notification"

// Data cache untuk simulasi database
let approvalDataCache: ApprovalItem[] | null = null;

/**
 * Mengambil data approval
 * @returns Promise dengan array ApprovalItem
 */
export async function fetchApprovalData(): Promise<ApprovalItem[]> {
  // Simulasi fetching data dari API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Jika data belum di-cache, generate data baru
  if (!approvalDataCache) {
    approvalDataCache = generateApprovalData();
  }
  
  return approvalDataCache;
}

/**
 * Proses persetujuan item
 * @param item ApprovalItem yang akan disetujui
 * @param message Pesan opsional untuk item yang disetujui
 * @returns Promise boolean sukses/gagal
 */
export async function approveItem(item: ApprovalItem, message?: string): Promise<boolean> {
  try {
    // 1. Integrasi ke Kas Lingkungan
    const dolingItem = {
      id: item.id,
      tanggal: item.tanggal,
      kolekte1: item.kolekte1,
      kolekte2: item.kolekte2,
      ucapanSyukur: item.ucapanSyukur,
      keterangan: item.keterangan,
      jumlahHadir: item.jumlahHadir
    }
    const integrationSuccess = await integrateToKasLingkungan(dolingItem)
    if (!integrationSuccess) {
      throw new Error("Gagal mengintegrasikan data ke Kas Lingkungan")
    }
    // 2. Kirim notifikasi ke pengurus
    await sendApprovalNotification(dolingItem)
    // 3. Update cache data
    if (approvalDataCache) {
      approvalDataCache = approvalDataCache.map(i => 
        i.id === item.id ? { ...i, status: 'approved' as const, message } : i
      );
    }
    // 4. Simulasi update data di database
    await new Promise(resolve => setTimeout(resolve, 300))
    return true
  } catch (error) {
    console.error("Error saat proses persetujuan:", error)
    return false
  }
}

/**
 * Proses penolakan item
 * @param item ApprovalItem yang akan ditolak
 * @param reason Alasan penolakan
 * @param message Pesan opsional untuk item yang ditolak
 * @returns Promise boolean sukses/gagal
 */
export async function rejectItem(item: ApprovalItem, reason?: string, message?: string): Promise<boolean> {
  try {
    // 1. Kirim notifikasi penolakan
    await sendRejectionNotification(item, reason, message)
    
    // 2. Update cache data
    if (approvalDataCache) {
      approvalDataCache = approvalDataCache.map(i => 
        i.id === item.id ? { ...i, status: 'rejected' as const, reason, message } : i
      );
    }
    
    // 3. Simulasi update data di database
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return true
  } catch (error) {
    console.error("Error saat proses penolakan:", error)
    return false
  }
}

/**
 * Mendapatkan data riwayat persetujuan
 * @returns Promise dengan array riwayat persetujuan
 */
export async function fetchApprovalHistory() {
  // Simulasi fetching data dari API
  await new Promise(resolve => setTimeout(resolve, 300))
  return getApprovalHistory();
}

/**
 * Mendapatkan data pengurus/administrator
 * @returns Promise dengan array administrator
 */
export async function fetchAdministrators() {
  // Simulasi fetching data dari API
  await new Promise(resolve => setTimeout(resolve, 200))
  return getAdministrators();
}

/**
 * Menghitung statistik approval
 * @param items Array ApprovalItem
 * @returns Statistik approval
 */
export function calculateApprovalStats(items: ApprovalItem[]) {
  const total = items.length
  const pending = items.filter(item => item.status === 'pending').length
  const approved = items.filter(item => item.status === 'approved').length
  const rejected = items.filter(item => item.status === 'rejected').length
  
  const totalAmount = items.reduce((sum, item) => {
    if (item.status === 'approved') {
      return sum + (item.kolekte1 + item.kolekte2 + item.ucapanSyukur)
    }
    return sum
  }, 0)
  
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const thisMonthItems = items.filter(item => {
    const itemMonth = item.tanggal.getMonth();
    const itemYear = item.tanggal.getFullYear();
    return itemMonth === thisMonth && itemYear === thisYear;
  });
  
  const thisMonthApproved = thisMonthItems.filter(item => item.status === 'approved').length;
  const thisMonthAmount = thisMonthItems.reduce((sum, item) => {
    if (item.status === 'approved') {
      return sum + (item.kolekte1 + item.kolekte2 + item.ucapanSyukur)
    }
    return sum
  }, 0);
  
  return {
    total,
    pending,
    approved,
    rejected,
    totalAmount,
    thisMonthApproved,
    thisMonthAmount
  }
} 