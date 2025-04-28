export interface JadwalDoling {
  id: number
  tanggal: Date
  waktu: string
  tuanRumahId?: number
  tuanRumah: string
  alamat: string
  noTelepon?: string
  catatan?: string
  status: 'terjadwal' | 'selesai' | 'dibatalkan'
  createdAt: Date
  updatedAt: Date
}

export interface DetilDoling {
  id: number
  jadwalId?: number
  tanggal: Date
  tuanRumah: string
  jumlahHadir: number
  kegiatan: string
  biaya?: number
  koleksi?: number
  keterangan?: string
  status: 'selesai' | 'dibatalkan'
  sudahDiapprove?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AbsensiDoling {
  id: number
  nama: string
  kepalaKeluarga: boolean
  kehadiran: 'hadir' | 'tidak-hadir'
  keterangan?: string
  createdAt: Date
  updatedAt: Date
}

export interface RiwayatDoling {
  nama: string
  totalHadir: number
  persentase: number
}

export interface RekapitulasiKegiatan {
  bulan: string
  jumlahKegiatan: number
  rataRataHadir: number
}

export interface KaleidoskopData {
  totalKegiatan: number
  rataRataKehadiran: number
  totalKKAktif: number
} 