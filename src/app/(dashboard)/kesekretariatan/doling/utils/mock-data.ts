import { JadwalDoling, DetilDoling, AbsensiDoling, RiwayatDoling, RekapitulasiKegiatan, KaleidoskopData } from "../types";

// Data kepala keluarga
export const kepalaKeluargaData = [
  { id: 101, nama: "Budi Santoso", sudahTerpilih: true },
  { id: 102, nama: "Ahmad Wijaya", sudahTerpilih: true },
  { id: 103, nama: "Siti Rahayu", sudahTerpilih: true },
  { id: 104, nama: "Hendra Gunawan", sudahTerpilih: false },
  { id: 105, nama: "Dewi Lestari", sudahTerpilih: false },
  { id: 106, nama: "Agus Salim", sudahTerpilih: false },
  { id: 107, nama: "Rina Wati", sudahTerpilih: false },
  { id: 108, nama: "Eko Prasetyo", sudahTerpilih: false },
  { id: 109, nama: "Bambang Suprapto", sudahTerpilih: false },
  { id: 110, nama: "Ratna Sari", sudahTerpilih: false },
  { id: 111, nama: "Joko Widodo", sudahTerpilih: false },
  { id: 112, nama: "Ani Yudhoyono", sudahTerpilih: false },
  { id: 113, nama: "Megawati Soekarnoputri", sudahTerpilih: false },
  { id: 114, nama: "Susilo Bambang", sudahTerpilih: false },
  { id: 115, nama: "Prabowo Subianto", sudahTerpilih: false },
];

// Data jadwal doling
export const jadwalDolingData: JadwalDoling[] = [
  {
    id: 1,
    tanggal: new Date(2024, 4, 15), // 15 Mei 2024
    waktu: "19:00",
    tuanRumahId: 101,
    tuanRumah: "Budi Santoso",
    alamat: "Jl. Merdeka No. 123, RT 05/RW 03",
    noTelepon: "081234567890",
    status: "terjadwal",
    createdAt: new Date(2024, 3, 1),
    updatedAt: new Date(2024, 3, 1)
  },
  {
    id: 2,
    tanggal: new Date(2024, 4, 22), // 22 Mei 2024
    waktu: "19:00",
    tuanRumahId: 102,
    tuanRumah: "Ahmad Wijaya",
    alamat: "Jl. Sudirman No. 45, RT 02/RW 07",
    noTelepon: "082345678901",
    status: "terjadwal",
    createdAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5)
  },
  {
    id: 3,
    tanggal: new Date(2024, 3, 30), // 30 April 2024
    waktu: "19:00",
    tuanRumahId: 103,
    tuanRumah: "Siti Rahayu",
    alamat: "Jl. Diponegoro No. 78, RT 10/RW 03",
    noTelepon: "083456789012",
    status: "selesai",
    catatan: "Persiapkan perlengkapan liturgi",
    createdAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 4, 1)
  },
  {
    id: 4,
    tanggal: new Date(2024, 3, 15), // 15 April 2024
    waktu: "19:30",
    tuanRumahId: 104,
    tuanRumah: "Hendra Gunawan",
    alamat: "Jl. Pemuda No. 22, RT 03/RW 05",
    noTelepon: "081987654321",
    status: "dibatalkan",
    catatan: "Dibatalkan karena tuan rumah sakit",
    createdAt: new Date(2024, 2, 10),
    updatedAt: new Date(2024, 3, 14)
  },
  {
    id: 5,
    tanggal: new Date(2024, 3, 8), // 8 April 2024
    waktu: "19:00",
    tuanRumahId: 105,
    tuanRumah: "Dewi Lestari",
    alamat: "Jl. Pahlawan No. 15, RT 04/RW 02",
    noTelepon: "089876543210",
    status: "selesai",
    createdAt: new Date(2024, 2, 5),
    updatedAt: new Date(2024, 3, 9)
  },
  {
    id: 6,
    tanggal: new Date(2024, 5, 5), // 5 Juni 2024
    waktu: "19:00",
    tuanRumahId: 106,
    tuanRumah: "Agus Salim",
    alamat: "Jl. Veteran No. 33, RT 07/RW 04",
    noTelepon: "087654321098",
    status: "terjadwal",
    createdAt: new Date(2024, 4, 10),
    updatedAt: new Date(2024, 4, 10)
  },
  {
    id: 7,
    tanggal: new Date(2024, 5, 12), // 12 Juni 2024
    waktu: "19:00",
    tuanRumahId: 107,
    tuanRumah: "Rina Wati",
    alamat: "Jl. Gatot Subroto No. 55, RT 01/RW 08",
    noTelepon: "081122334455",
    status: "terjadwal",
    createdAt: new Date(2024, 4, 15),
    updatedAt: new Date(2024, 4, 15)
  },
  {
    id: 8,
    tanggal: new Date(2024, 5, 19), // 19 Juni 2024
    waktu: "19:00",
    tuanRumahId: 108,
    tuanRumah: "Eko Prasetyo",
    alamat: "Jl. Ahmad Yani No. 67, RT 06/RW 03",
    noTelepon: "082233445566",
    status: "terjadwal",
    createdAt: new Date(2024, 4, 20),
    updatedAt: new Date(2024, 4, 20)
  },
  // Tambahan data untuk kondisi yang berbeda
  {
    id: 9,
    tanggal: new Date(), // Hari ini
    waktu: "19:00",
    tuanRumahId: 109,
    tuanRumah: "Bambang Suprapto",
    alamat: "Jl. Cendrawasih No. 45, RT 08/RW 02",
    noTelepon: "081234567899",
    status: "terjadwal",
    catatan: "Pertemuan doa lingkungan hari ini",
    createdAt: new Date(2024, 4, 1),
    updatedAt: new Date(2024, 4, 1)
  },
  {
    id: 10,
    tanggal: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 hari dari sekarang
    waktu: "19:30",
    tuanRumahId: 110,
    tuanRumah: "Ratna Sari",
    alamat: "Jl. Mawar No. 12, RT 04/RW 06",
    noTelepon: "089876543211",
    status: "terjadwal",
    catatan: "Jadwal doling mendatang dalam minggu ini",
    createdAt: new Date(2024, 4, 5),
    updatedAt: new Date(2024, 4, 5)
  },
  {
    id: 11,
    tanggal: new Date(2023, 11, 25), // 25 Desember 2023
    waktu: "19:00",
    tuanRumahId: 111,
    tuanRumah: "Joko Widodo",
    alamat: "Jl. Pemuda No. 17, RT 02/RW 01",
    noTelepon: "081234512345",
    status: "selesai",
    catatan: "Doa Lingkungan Perayaan Natal",
    createdAt: new Date(2023, 11, 1),
    updatedAt: new Date(2023, 11, 26)
  },
  {
    id: 12,
    tanggal: new Date(2023, 0, 1), // 1 Januari 2023
    waktu: "19:00",
    tuanRumahId: 112,
    tuanRumah: "Ani Yudhoyono",
    alamat: "Jl. Kenanga No. 5, RT 07/RW 02",
    noTelepon: "089812345678",
    status: "selesai",
    catatan: "Doa Lingkungan Awal Tahun",
    createdAt: new Date(2022, 11, 15),
    updatedAt: new Date(2023, 0, 2)
  },
  {
    id: 13,
    tanggal: new Date(2023, 3, 7), // 7 April 2023
    waktu: "19:00",
    tuanRumahId: 113,
    tuanRumah: "Megawati Soekarnoputri",
    alamat: "Jl. Kebun Raya No. 21, RT 09/RW 03",
    noTelepon: "081298765432",
    status: "selesai",
    catatan: "Doa Lingkungan Jumat Agung",
    createdAt: new Date(2023, 2, 20),
    updatedAt: new Date(2023, 3, 8)
  },
  {
    id: 14,
    tanggal: new Date(2023, 10, 30), // 30 November 2023
    waktu: "19:30",
    tuanRumahId: 114,
    tuanRumah: "Susilo Bambang",
    alamat: "Jl. Melati No. 8, RT 05/RW 04",
    noTelepon: "082198765432",
    status: "dibatalkan",
    catatan: "Dibatalkan karena bencana alam",
    createdAt: new Date(2023, 10, 15),
    updatedAt: new Date(2023, 10, 29)
  },
  {
    id: 15,
    tanggal: new Date(2023, 6, 15), // 15 Juli 2023
    waktu: "19:00",
    tuanRumahId: 115,
    tuanRumah: "Prabowo Subianto",
    alamat: "Jl. Anggrek No. 10, RT 06/RW 05",
    noTelepon: "081234543210",
    status: "dibatalkan",
    catatan: "Dibatalkan karena tuan rumah ada keperluan mendadak",
    createdAt: new Date(2023, 5, 30),
    updatedAt: new Date(2023, 6, 14)
  }
];

// Data detil doling
export const detilDolingData: DetilDoling[] = [
  {
    id: 1,
    jadwalId: 1,
    tanggal: new Date(2024, 4, 15),
    tuanRumah: "Agus Budiman",
    temaIbadat: "Kasih dan Pengampunan",
    jenisIbadat: "Misa",
    kegiatan: "Yohanes 15:12-17",
    jumlahHadir: 25,
    koleksi: 350000,
    keterangan: "Misa berjalan lancar",
    status: "selesai",
    createdAt: new Date(2024, 4, 16),
    updatedAt: new Date(2024, 4, 16)
  },
  {
    id: 2,
    jadwalId: 3,
    tanggal: new Date(2024, 3, 30),
    tuanRumah: "Budi Santoso",
    temaIbadat: "Berkat dalam Kesusahan",
    jenisIbadat: "Doa Rosario",
    kegiatan: "Matius 5:3-12",
    jumlahHadir: 18,
    koleksi: 275000,
    keterangan: "",
    status: "selesai",
    createdAt: new Date(2024, 4, 1),
    updatedAt: new Date(2024, 4, 1)
  },
  {
    id: 3,
    jadwalId: 5,
    tanggal: new Date(2024, 3, 8),
    tuanRumah: "Maria Handayani",
    temaIbadat: "Hidup dalam Roh Kudus",
    jenisIbadat: "Adorasi",
    kegiatan: "Kisah Para Rasul 2:1-13",
    jumlahHadir: 15,
    koleksi: 225000,
    keterangan: "Adorasi berjalan dengan khidmat",
    status: "selesai",
    createdAt: new Date(2024, 3, 9),
    updatedAt: new Date(2024, 3, 9)
  },
  // Tambahan data dengan berbagai jenis ibadat
  {
    id: 4,
    jadwalId: 11,
    tanggal: new Date(2023, 11, 25),
    tuanRumah: "Stefanus Wijaya",
    temaIbadat: "Kelahiran Juru Selamat",
    jenisIbadat: "Misa",
    kegiatan: "Lukas 2:1-20",
    jumlahHadir: 45,
    koleksi: 850000,
    keterangan: "Misa Natal yang meriah",
    status: "selesai",
    createdAt: new Date(2023, 11, 26),
    updatedAt: new Date(2023, 11, 26)
  },
  {
    id: 5,
    jadwalId: 12,
    tanggal: new Date(2023, 0, 1),
    tuanRumah: "Antonius Sugianto",
    temaIbadat: "Awal yang Baru dalam Kristus",
    jenisIbadat: "Doa Rosario",
    kegiatan: "Filipi 3:12-14",
    jumlahHadir: 30,
    koleksi: 500000,
    keterangan: "Doa bersama tahun baru",
    status: "selesai",
    createdAt: new Date(2023, 0, 2),
    updatedAt: new Date(2023, 0, 2)
  },
  {
    id: 6,
    jadwalId: 13,
    tanggal: new Date(2023, 3, 7),
    tuanRumah: "Paulus Santoso",
    temaIbadat: "Sengsara Kristus",
    jenisIbadat: "Jalan Salib",
    kegiatan: "Matius 27:32-56",
    jumlahHadir: 40,
    koleksi: 600000,
    keterangan: "Jalan salib yang penuh makna di Jumat Agung",
    status: "selesai",
    createdAt: new Date(2023, 3, 8),
    updatedAt: new Date(2023, 3, 8)
  },
  {
    id: 7,
    jadwalId: 2,
    tanggal: new Date(2024, 4, 22),
    tuanRumah: "Petrus Hartono",
    temaIbadat: "Berbuah dalam Kristus",
    jenisIbadat: "Ibadat Sabda",
    kegiatan: "Yohanes 15:1-8",
    jumlahHadir: 22,
    koleksi: 320000,
    keterangan: "Ibadat Sabda sebagai pengganti Misa",
    status: "selesai",
    createdAt: new Date(2024, 4, 23),
    updatedAt: new Date(2024, 4, 23)
  },
  {
    id: 8,
    jadwalId: 9,
    tanggal: new Date(),
    tuanRumah: "Markus Wijaya",
    temaIbadat: "Kasih yang Melayani",
    jenisIbadat: "Ibadat Sabda",
    kegiatan: "Yohanes 13:1-17",
    jumlahHadir: 0, // belum dilaksanakan
    koleksi: 0, // belum dilaksanakan
    keterangan: "Pertemuan doa hari ini",
    status: "selesai",
    createdAt: new Date(new Date().setHours(8, 0, 0, 0)), // pagi hari ini
    updatedAt: new Date(new Date().setHours(8, 0, 0, 0))
  },
  {
    id: 9,
    jadwalId: 10,
    tanggal: new Date(new Date().setDate(new Date().getDate() + 3)),
    tuanRumah: "Theresia Handayani",
    temaIbadat: "Kesetiaan dalam Iman",
    jenisIbadat: "Doa Rosario",
    kegiatan: "Ibrani 11:1-6",
    jumlahHadir: 0, // belum dilaksanakan
    koleksi: 0, // belum dilaksanakan
    keterangan: "Persiapan doa rosario bersama keluarga",
    status: "selesai",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 7))
  },
  {
    id: 10,
    jadwalId: 6,
    tanggal: new Date(2024, 5, 5),
    tuanRumah: "Thomas Sanjaya",
    temaIbadat: "Iman dan Pengharapan",
    jenisIbadat: "Adorasi",
    kegiatan: "Roma 5:1-5",
    jumlahHadir: 0, // belum dilaksanakan
    koleksi: 0, // belum dilaksanakan
    keterangan: "Persiapan adorasi pekan depan",
    status: "selesai",
    createdAt: new Date(2024, 4, 11),
    updatedAt: new Date(2024, 4, 11)
  }
];

// Data absensi doling
export const absensiDolingData: AbsensiDoling[] = [
  {
    id: 1,
    nama: "Budi Santoso",
    kepalaKeluarga: true,
    kehadiran: "hadir",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 2,
    nama: "Ani Wijaya",
    kepalaKeluarga: false,
    kehadiran: "hadir",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 3,
    nama: "Ahmad Hidayat",
    kepalaKeluarga: true,
    kehadiran: "tidak-hadir",
    keterangan: "Sakit",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 4,
    nama: "Siti Rahayu",
    kepalaKeluarga: true,
    kehadiran: "hadir",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 5,
    nama: "Hendra Gunawan",
    kepalaKeluarga: true,
    kehadiran: "hadir",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 6,
    nama: "Maria Gunawan",
    kepalaKeluarga: false,
    kehadiran: "hadir",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 7,
    nama: "Eko Prasetyo",
    kepalaKeluarga: true,
    kehadiran: "tidak-hadir",
    keterangan: "Tugas luar kota",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 8,
    nama: "Dewi Lestari",
    kepalaKeluarga: true,
    kehadiran: "hadir",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 9,
    nama: "Bambang Suprapto",
    kepalaKeluarga: true,
    kehadiran: "tidak-hadir",
    keterangan: "Ada acara keluarga",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  },
  {
    id: 10,
    nama: "Ratna Sari",
    kepalaKeluarga: false,
    kehadiran: "hadir",
    createdAt: new Date(2024, 3, 30),
    updatedAt: new Date(2024, 3, 30)
  }
];

// Data riwayat doling
export const riwayatDolingData: RiwayatDoling[] = [
  { nama: "Budi Santoso", totalHadir: 10, persentase: 83 },
  { nama: "Ahmad Wijaya", totalHadir: 8, persentase: 67 },
  { nama: "Siti Rahayu", totalHadir: 12, persentase: 100 },
  { nama: "Agus Salim", totalHadir: 6, persentase: 50 },
  { nama: "Dewi Lestari", totalHadir: 9, persentase: 75 },
  { nama: "Hendra Gunawan", totalHadir: 7, persentase: 58 },
  { nama: "Rina Wati", totalHadir: 11, persentase: 92 },
  { nama: "Eko Prasetyo", totalHadir: 5, persentase: 42 },
  { nama: "Bambang Suprapto", totalHadir: 10, persentase: 83 },
  { nama: "Ratna Sari", totalHadir: 8, persentase: 67 }
];

// Data rekapitulasi kegiatan
export const rekapitulasiData: RekapitulasiKegiatan[] = [
  { bulan: "Januari 2024", jumlahKegiatan: 4, rataRataHadir: 28 },
  { bulan: "Februari 2024", jumlahKegiatan: 4, rataRataHadir: 32 },
  { bulan: "Maret 2024", jumlahKegiatan: 5, rataRataHadir: 35 },
  { bulan: "April 2024", jumlahKegiatan: 4, rataRataHadir: 30 },
  { bulan: "Mei 2024", jumlahKegiatan: 3, rataRataHadir: 27 },
  { bulan: "Juni 2024", jumlahKegiatan: 4, rataRataHadir: 33 }
];

// Data kaleidoskop
export const kaleidoskopData: KaleidoskopData = {
  totalKegiatan: 48,
  rataRataKehadiran: 75,
  totalKKAktif: 35
}; 