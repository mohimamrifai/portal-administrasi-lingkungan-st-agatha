import { ApprovalItem } from "../types"

/**
 * Fungsi untuk membuat data approval contoh
 * @returns Array dari item approval
 */
export function generateApprovalData(): ApprovalItem[] {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const currentYear = currentDate.getFullYear();
  const previousYear = previousMonth === 11 ? currentYear - 1 : currentYear;
  const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;
  
  return [
    // Bulan ini - menunggu persetujuan
    {
      id: 1,
      tanggal: new Date(currentYear, currentMonth, 5),
      kolekte1: 200000,
      kolekte2: 100000,
      ucapanSyukur: 50000,
      keterangan: "Kegiatan berjalan lancar",
      jumlahHadir: 25,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 6, 9, 30, 0),
      message: "Mohon disetujui karena kegiatannya berjalan dengan lancar",
      total: 350000
    },
    {
      id: 2,
      tanggal: new Date(currentYear, currentMonth, 12),
      kolekte1: 150000,
      kolekte2: 75000,
      ucapanSyukur: 25000,
      keterangan: "",
      jumlahHadir: 18,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 13, 10, 15, 0),
      total: 250000
    },
    {
      id: 3,
      tanggal: new Date(currentYear, currentMonth, 19),
      kolekte1: 180000,
      kolekte2: 90000,
      ucapanSyukur: 30000,
      keterangan: "Tambahan konsumsi untuk tamu",
      jumlahHadir: 22,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 20, 8, 45, 0),
      message: "Ada beberapa tambahan biaya konsumsi untuk tamu undangan",
      total: 300000
    },
    
    // Bulan ini - sudah disetujui
    {
      id: 4,
      tanggal: new Date(currentYear, currentMonth, 3),
      kolekte1: 250000,
      kolekte2: 100000,
      ucapanSyukur: 50000,
      keterangan: "Disetujui tanpa catatan tambahan",
      jumlahHadir: 30,
      status: 'approved',
      createdAt: new Date(currentYear, currentMonth, 4, 11, 20, 0),
      message: "Disetujui tanpa catatan tambahan",
      total: 400000
    },
    {
      id: 5,
      tanggal: new Date(currentYear, currentMonth, 10),
      kolekte1: 180000,
      kolekte2: 80000,
      ucapanSyukur: 22000,
      keterangan: "",
      jumlahHadir: 20,
      status: 'approved',
      createdAt: new Date(currentYear, currentMonth, 11, 14, 30, 0),
      total: 282000
    },
    
    // Bulan ini - ditolak
    {
      id: 6,
      tanggal: new Date(currentYear, currentMonth, 7),
      kolekte1: 100000,
      kolekte2: 70000,
      ucapanSyukur: 30000,
      keterangan: "Jumlah peserta tidak sesuai daftar hadir",
      jumlahHadir: 15,
      status: 'rejected',
      createdAt: new Date(currentYear, currentMonth, 8, 9, 10, 0),
      message: "Data tidak lengkap, jumlah peserta tidak sesuai dengan daftar hadir",
      total: 200000
    },
    
    // Bulan sebelumnya - menunggu persetujuan
    {
      id: 7,
      tanggal: new Date(previousYear, previousMonth, 28),
      kolekte1: 200000,
      kolekte2: 120000,
      ucapanSyukur: 55000,
      keterangan: "",
      jumlahHadir: 27,
      status: 'pending',
      createdAt: new Date(previousYear, previousMonth, 29, 15, 45, 0),
      total: 375000
    },
    
    // Bulan sebelumnya - sudah disetujui
    {
      id: 8,
      tanggal: new Date(previousYear, previousMonth, 15),
      kolekte1: 200000,
      kolekte2: 90000,
      ucapanSyukur: 30000,
      keterangan: "Pelaksanaan lancar",
      jumlahHadir: 24,
      status: 'approved',
      createdAt: new Date(previousYear, previousMonth, 16, 10, 30, 0),
      message: "Terima kasih atas pelaksanaan kegiatan yang lancar",
      total: 320000
    },
    {
      id: 9,
      tanggal: new Date(previousYear, previousMonth, 21),
      kolekte1: 120000,
      kolekte2: 100000,
      ucapanSyukur: 40000,
      keterangan: "",
      jumlahHadir: 19,
      status: 'approved',
      createdAt: new Date(previousYear, previousMonth, 22, 13, 15, 0),
      total: 260000
    },
    
    // Bulan sebelumnya - ditolak
    {
      id: 10,
      tanggal: new Date(previousYear, previousMonth, 8),
      kolekte1: 80000,
      kolekte2: 70000,
      ucapanSyukur: 30000,
      keterangan: "Bukti pengeluaran tidak valid",
      jumlahHadir: 12,
      status: 'rejected',
      createdAt: new Date(previousYear, previousMonth, 9, 11, 45, 0),
      message: "Bukti pengeluaran tidak valid",
      total: 180000
    },
    
    // Bulan berikutnya - sudah dijadwalkan
    {
      id: 11,
      tanggal: new Date(nextYear, nextMonth, 5),
      kolekte1: 200000,
      kolekte2: 150000,
      ucapanSyukur: 35000,
      keterangan: "Pengajuan untuk bulan depan",
      jumlahHadir: 28,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 25, 9, 0, 0),
      message: "Pengajuan ini untuk kegiatan bulan depan",
      total: 385000
    },
    {
      id: 12,
      tanggal: new Date(nextYear, nextMonth, 12),
      kolekte1: 120000,
      kolekte2: 150000,
      ucapanSyukur: 40000,
      keterangan: "",
      jumlahHadir: 23,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 26, 10, 30, 0),
      total: 310000
    },
  ];
}

/**
 * Fungsi untuk mengambil data semua kepala keluarga
 * @returns Array data kepala keluarga
 */
export const getFamilyHeads = () => [
  { id: 1, name: "Budi Santoso", lingkungan: "St. Yohanes" },
  { id: 2, name: "Ani Wijaya", lingkungan: "St. Maria" },
  { id: 3, name: "Citra Dewi", lingkungan: "St. Yohanes" },
  { id: 4, name: "Dedi Sukamto", lingkungan: "St. Petrus" },
  { id: 5, name: "Eko Prasetyo", lingkungan: "St. Maria" },
  { id: 6, name: "Feri Kurniawan", lingkungan: "St. Petrus" },
  { id: 7, name: "Gunawan Wibisono", lingkungan: "St. Yohanes" },
  { id: 8, name: "Hendra Setiawan", lingkungan: "St. Petrus" },
  { id: 9, name: "Indra Jaya", lingkungan: "St. Maria" },
  { id: 10, name: "Joko Susilo", lingkungan: "St. Yohanes" },
  { id: 11, name: "Kartini Sari", lingkungan: "St. Petrus" },
  { id: 12, name: "Lukman Hakim", lingkungan: "St. Maria" },
];

/**
 * Fungsi untuk mengambil data semua administator/pengurus
 * @returns Array data administrator
 */
export const getAdministrators = () => [
  { id: '1', name: 'Ahmad Rizal', role: 'bendahara', email: 'ahmad.rizal@gmail.com' },
  { id: '2', name: 'Siti Fatimah', role: 'sekretaris', email: 'siti.fatimah@gmail.com' },
  { id: '3', name: 'Budi Hartono', role: 'ketua', email: 'budi.hartono@gmail.com' },
  { id: '4', name: 'Dewi Sartika', role: 'wakil_ketua', email: 'dewi.sartika@gmail.com' },
];

/**
 * Fungsi untuk mengambil histori approval
 * @returns Array histori approval
 */
export const getApprovalHistory = () => [
  {
    id: 1,
    approvalDate: new Date(2024, 0, 15),
    approvedBy: 'Budi Hartono',
    itemId: 4,
    tuanRumah: "Dedi Sukamto",
    biaya: 400000,
    status: 'approved',
    message: "Disetujui tanpa catatan tambahan"
  },
  {
    id: 2,
    approvalDate: new Date(2024, 0, 16),
    approvedBy: 'Budi Hartono',
    itemId: 5,
    tuanRumah: "Eko Prasetyo",
    biaya: 280000,
    status: 'approved'
  },
  {
    id: 3,
    approvalDate: new Date(2024, 0, 10),
    approvedBy: 'Budi Hartono',
    itemId: 6,
    tuanRumah: "Feri Kurniawan",
    biaya: 200000,
    status: 'rejected',
    message: "Data tidak lengkap, jumlah peserta tidak sesuai dengan daftar hadir"
  },
  {
    id: 4,
    approvalDate: new Date(2023, 11, 17),
    approvedBy: 'Dewi Sartika',
    itemId: 8,
    tuanRumah: "Hendra Setiawan",
    biaya: 320000,
    status: 'approved',
    message: "Terima kasih atas pelaksanaan kegiatan yang lancar"
  },
  {
    id: 5,
    approvalDate: new Date(2023, 11, 23),
    approvedBy: 'Dewi Sartika',
    itemId: 9,
    tuanRumah: "Indra Jaya",
    biaya: 260000,
    status: 'approved'
  },
  {
    id: 6,
    approvalDate: new Date(2023, 11, 10),
    approvedBy: 'Budi Hartono',
    itemId: 10,
    tuanRumah: "Joko Susilo",
    biaya: 180000,
    status: 'rejected',
    message: "Bukti pengeluaran tidak valid"
  },
]; 