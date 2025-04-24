import { Publikasi } from "../types/publikasi"

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
    kategori: "Penting"
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
    kategori: "Umum"
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
    kategori: "Umum"
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