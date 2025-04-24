// Tipe data untuk item approval
export interface ApprovalItem {
  id: number
  tanggal: Date
  tuanRumah: string
  jumlahHadir: number
  biaya: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  reason?: string
  message?: string
}

// Tipe data untuk kepala keluarga
export interface FamilyHead {
  id: number
  name: string
  lingkungan: string
}

// Tipe data untuk administrator/pengurus
export interface Administrator {
  id: string
  name: string
  role: 'bendahara' | 'sekretaris' | 'ketua' | 'wakil_ketua'
  email: string
}

// Tipe data untuk riwayat approval
export interface ApprovalHistory {
  id: number
  approvalDate: Date
  approvedBy: string
  itemId: number
  tuanRumah: string
  biaya: number
  status: 'approved' | 'rejected'
  reason?: string
}

// Status approval
export const approvalStatus = [
  { value: 'pending', label: 'Menunggu Persetujuan' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' }
] as const;

// Role pengurus
export const administratorRoles = [
  { value: 'ketua', label: 'Ketua' },
  { value: 'wakil_ketua', label: 'Wakil Ketua' },
  { value: 'sekretaris', label: 'Sekretaris' },
  { value: 'bendahara', label: 'Bendahara' }
] as const; 