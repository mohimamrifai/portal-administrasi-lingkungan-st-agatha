import { Approval } from "@prisma/client"

// Tipe data yang diperluas untuk approval yang mencakup relasi
export type ExtendedApproval = Approval & {
  doaLingkungan?: {
    id: string
    tanggal: Date
    kolekteI: number
    kolekteII: number
    ucapanSyukur: number
    jumlahKKHadir: number
    tuanRumah: {
      id: string
      namaKepalaKeluarga: string
    }
  } | null
  kasLingkungan?: {
    id: string
    tanggal: Date
    debit: number
    kredit: number
    keterangan?: string | null
  } | null
}

// Tipe data untuk statistik approval
export interface ApprovalStats {
  total: number
  pending: number
  approved: number
  rejected: number
  totalAmount: number
  thisMonthApproved: number
  thisMonthAmount: number
} 