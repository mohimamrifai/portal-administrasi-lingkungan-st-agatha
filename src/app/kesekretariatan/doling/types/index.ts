export interface JadwalDoling {
  id: number
  tanggal: Date
  waktu: string
  tuanRumah: string
  alamat: string
  status: 'terjadwal' | 'selesai' | 'dibatalkan'
  createdAt: Date
  updatedAt: Date
}

export interface DetilDoling {
  id: number
  tanggal: Date
  tuanRumah: string
  jumlahHadir: number
  kegiatan: string
  status: 'selesai' | 'dibatalkan'
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