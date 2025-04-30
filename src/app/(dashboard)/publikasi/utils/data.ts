import { Publikasi, Laporan } from "../types/publikasi"

// Data dummy untuk simulasi
export const dummyPublikasi: Publikasi[] = [
  { 
    id: "1", 
    judul: "Persiapan Natalan 2023",
    tanggal: "2023-12-10", 
    waktu: "19:30", 
    lokasi: "Gereja St. Agatha",
    targetPenerima: "Semua Pengguna", 
    status: "aktif",
    pembuat: "Admin Lingkungan",
    lampiran: true,
    locked: false,
    kategori: "Penting",
    laporan: [
      {
        id: "lap-1",
        judul: "Laporan Persiapan Dekorasi",
        jenis: "Evaluasi",
        tanggal: "2023-12-15",
        keterangan: "Laporan tentang persiapan dekorasi untuk acara Natal 2023 di Gereja St. Agatha",
        lampiran: "laporan-dekorasi.pdf",
        publikasiId: "1"
      },
      {
        id: "lap-2",
        judul: "Laporan Penggunaan Dana",
        jenis: "Keuangan",
        tanggal: "2023-12-20",
        keterangan: "Rincian penggunaan dana untuk keperluan acara Natal 2023",
        lampiran: "laporan-keuangan.xlsx",
        publikasiId: "1"
      }
    ]
  },
  { 
    id: "2", 
    judul: "Jadwal Misa Paskah",
    tanggal: "2023-04-05", 
    waktu: "15:00", 
    lokasi: "Gereja St. Agatha",
    targetPenerima: "Umat", 
    status: "aktif",
    pembuat: "Admin Lingkungan",
    lampiran: true,
    locked: true,
    kategori: "Umum",
    laporan: [
      {
        id: "lap-3",
        judul: "Laporan Kehadiran Umat",
        jenis: "Evaluasi",
        tanggal: "2023-04-10",
        keterangan: "Laporan jumlah kehadiran umat pada Misa Paskah 2023",
        lampiran: "kehadiran-paskah.pdf",
        publikasiId: "2"
      }
    ]
  },
  { 
    id: "3", 
    judul: "Pengumpulan Dana Bantuan Bencana",
    tanggal: "2023-02-12", 
    waktu: "09:00", 
    lokasi: "Aula Paroki",
    targetPenerima: "Ketua Lingkungan", 
    status: "kedaluwarsa",
    pembuat: "Ketua Lingkungan",
    lampiran: false,
    locked: true,
    kategori: "Segera"
  },
  { 
    id: "4", 
    judul: "Perubahan Jadwal Doa Rosario",
    tanggal: "2023-05-16", 
    waktu: "16:00", 
    lokasi: "Rumah Ketua Lingkungan",
    targetPenerima: "Bendahara", 
    status: "aktif",
    pembuat: "Sekretaris",
    lampiran: true,
    locked: false,
    kategori: "Umum",
    laporan: [
      {
        id: "lap-4",
        judul: "Laporan Partisipasi Doa Rosario",
        jenis: "Partisipasi",
        tanggal: "2023-05-30",
        keterangan: "Laporan tentang partisipasi umat dalam kegiatan doa rosario dengan jadwal yang baru",
        lampiran: "partisipasi-rosario.pdf",
        publikasiId: "4"
      }
    ]
  },
  { 
    id: "5", 
    judul: "Rapat Evaluasi Kegiatan Tahunan",
    tanggal: "2023-11-25", 
    waktu: "10:00", 
    lokasi: "Aula Paroki",
    targetPenerima: "Pengurus", 
    status: "aktif",
    pembuat: "Admin Lingkungan",
    lampiran: false,
    locked: false,
    kategori: "Rahasia"
  },
  { 
    id: "6", 
    judul: "Pembagian Sembako untuk Lansia",
    tanggal: "2023-08-05", 
    waktu: "08:00", 
    lokasi: "Depan Gereja",
    targetPenerima: "SuperUser", 
    status: "kedaluwarsa",
    pembuat: "Ketua Lingkungan",
    lampiran: true,
    locked: true,
    kategori: "Penting"
  },
] 