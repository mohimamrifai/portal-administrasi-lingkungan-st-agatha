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
  jumlahKKHadir?: number // Jumlah KK yang hadir
  jumlahBapak?: number
  jumlahIbu?: number
  jumlahOMK?: number
  jumlahBIAKecil?: number  // BIA (0-6 tahun)
  jumlahBIABesar?: number  // BIA (7-13 tahun)
  jumlahBIR?: number
  jumlahPeserta?: number   // Jumlah peserta (khusus Misa)
  // Data kolekte
  kolekte1?: number
  kolekte2?: number
  ucapanSyukur?: number
  // Data petugas untuk Doa Lingkungan
  pemimpinLiturgi?: string
  petugasRosario?: string
  pembawaRenungan?: string  // Tambahan sesuai brief
  petugasLagu?: string
  petugasDoaUmat?: string   // Tambahan sesuai brief
  petugasBacaan?: string
  // Data petugas untuk Misa
  pemimpinMisa?: string     // Tambahan sesuai brief
  bacaanPertama?: string    // Tambahan sesuai brief
  pemazmur?: string         // Tambahan sesuai brief
}

export interface AbsensiDoling {
  id: number
  jadwalId: number        // ID jadwal doling terkait
  detilDolingId?: number  // ID detail doling jika diperlukan
  tanggalKehadiran: Date  // Tanggal kehadiran
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