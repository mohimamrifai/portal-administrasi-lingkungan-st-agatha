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
  jenisIbadat?: string
  subIbadat?: string
  temaIbadat?: string
  kegiatan: string
  biaya?: number
  koleksi?: number
  keterangan?: string
  status: 'selesai' | 'dibatalkan'
  sudahDiapprove?: boolean
  createdAt: Date
  updatedAt: Date
  // Data kehadiran
  jumlahBapak?: number
  jumlahIbu?: number
  jumlahOMK?: number
  jumlahBIA?: number
  jumlahBIR?: number
  // Data kolekte
  kolekte1?: number
  kolekte2?: number
  ucapanSyukur?: number
  // Data petugas
  pemimpinLiturgi?: string
  petugasRosario?: string
  petugasLagu?: string
  petugasBacaan?: string
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