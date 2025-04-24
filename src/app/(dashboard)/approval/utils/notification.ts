// Tipe untuk notifikasi
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  isRead: boolean
  recipientId?: string
  senderId?: string
  relatedItemId?: number
  relatedItemType?: string
}

// Data contoh untuk penerima notifikasi (pengurus)
export const administrators = [
  { id: '1', name: 'Admin Bendahara', role: 'bendahara' },
  { id: '2', name: 'Admin Sekretariat', role: 'sekretaris' },
  { id: '3', name: 'Admin Ketua', role: 'ketua' },
]

/**
 * Membuat notifikasi baru
 * @param title Judul notifikasi
 * @param message Isi pesan notifikasi
 * @param type Tipe notifikasi
 * @param recipientId ID penerima notifikasi (opsional)
 * @param relatedItemId ID item terkait (opsional)
 * @param relatedItemType Tipe item terkait (opsional)
 * @returns Objek notifikasi yang dibuat
 */
export function createNotification(
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  recipientId?: string,
  relatedItemId?: number,
  relatedItemType?: string
): Notification {
  return {
    id: Date.now().toString(),
    title,
    message,
    type,
    timestamp: new Date(),
    isRead: false,
    recipientId,
    relatedItemId,
    relatedItemType,
  }
}

/**
 * Mengirim notifikasi ke pengurus
 * @param notification Objek notifikasi untuk dikirim
 * @returns Promise yang menyelesaikan setelah notifikasi dikirim
 */
export async function sendNotification(notification: Notification): Promise<boolean> {
  // Simulasi pengiriman notifikasi
  // Dalam aplikasi sebenarnya, ini akan mengirim ke API notifikasi
  console.log('Notifikasi dikirim:', notification)
  
  // Simulasi delay 500ms
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return sukses
  return true
}

/**
 * Mengirim notifikasi persetujuan Doling ke bendahara
 * @param dolingData Data Detil Doling yang disetujui
 * @param message Pesan tambahan (opsional)
 * @returns Promise yang menyelesaikan setelah notifikasi dikirim
 */
export async function sendApprovalNotification(dolingData: any, message?: string): Promise<boolean> {
  const bendaharaId = administrators.find(admin => admin.role === 'bendahara')?.id
  
  if (!bendaharaId) {
    console.error('Bendahara tidak ditemukan')
    return false
  }
  
  let notificationMessage = `Detil Doling untuk "${dolingData.tuanRumah}" pada tanggal ${dolingData.tanggal.toLocaleDateString('id-ID')} telah disetujui dan siap diintegrasikan ke Kas Lingkungan.`;
  
  // Tambahkan pesan jika ada
  if (message) {
    notificationMessage += ` Pesan: ${message}`;
  }
  
  const notification = createNotification(
    'Persetujuan Doling',
    notificationMessage,
    'success',
    bendaharaId,
    dolingData.id,
    'doling'
  )
  
  return sendNotification(notification)
}

/**
 * Mengirim notifikasi penolakan Doling
 * @param dolingData Data Detil Doling yang ditolak
 * @param reason Alasan penolakan (opsional)
 * @param message Pesan tambahan (opsional)
 * @returns Promise yang menyelesaikan setelah notifikasi dikirim
 */
export async function sendRejectionNotification(dolingData: any, reason?: string, message?: string): Promise<boolean> {
  const sekretarisId = administrators.find(admin => admin.role === 'sekretaris')?.id
  
  if (!sekretarisId) {
    console.error('Sekretaris tidak ditemukan')
    return false
  }
  
  let notificationMessage = reason 
    ? `Detil Doling untuk "${dolingData.tuanRumah}" pada tanggal ${dolingData.tanggal.toLocaleDateString('id-ID')} ditolak dengan alasan: ${reason}.`
    : `Detil Doling untuk "${dolingData.tuanRumah}" pada tanggal ${dolingData.tanggal.toLocaleDateString('id-ID')} ditolak.`
  
  // Tambahkan pesan jika ada
  if (message) {
    notificationMessage += ` Pesan: ${message}`;
  }
  
  const notification = createNotification(
    'Penolakan Doling',
    notificationMessage,
    'warning',
    sekretarisId,
    dolingData.id,
    'doling'
  )
  
  return sendNotification(notification)
} 