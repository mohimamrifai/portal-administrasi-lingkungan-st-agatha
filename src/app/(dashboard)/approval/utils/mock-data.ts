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
      tuanRumah: "Budi Santoso",
      jumlahHadir: 25,
      biaya: 350000,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 6, 9, 30, 0),
      message: "Mohon disetujui karena kegiatannya berjalan dengan lancar"
    },
    {
      id: 2,
      tanggal: new Date(currentYear, currentMonth, 12),
      tuanRumah: "Ani Wijaya",
      jumlahHadir: 18,
      biaya: 250000,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 13, 10, 15, 0),
    },
    {
      id: 3,
      tanggal: new Date(currentYear, currentMonth, 19),
      tuanRumah: "Citra Dewi",
      jumlahHadir: 22,
      biaya: 300000,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 20, 8, 45, 0),
      message: "Ada beberapa tambahan biaya konsumsi untuk tamu undangan"
    },
    
    // Bulan ini - sudah disetujui
    {
      id: 4,
      tanggal: new Date(currentYear, currentMonth, 3),
      tuanRumah: "Dedi Sukamto",
      jumlahHadir: 30,
      biaya: 400000,
      status: 'approved',
      createdAt: new Date(currentYear, currentMonth, 4, 11, 20, 0),
      message: "Disetujui tanpa catatan tambahan"
    },
    {
      id: 5,
      tanggal: new Date(currentYear, currentMonth, 10),
      tuanRumah: "Eko Prasetyo",
      jumlahHadir: 20,
      biaya: 280000,
      status: 'approved',
      createdAt: new Date(currentYear, currentMonth, 11, 14, 30, 0),
    },
    
    // Bulan ini - ditolak
    {
      id: 6,
      tanggal: new Date(currentYear, currentMonth, 7),
      tuanRumah: "Feri Kurniawan",
      jumlahHadir: 15,
      biaya: 200000,
      status: 'rejected',
      createdAt: new Date(currentYear, currentMonth, 8, 9, 10, 0),
      message: "Data tidak lengkap, jumlah peserta tidak sesuai dengan daftar hadir"
    },
    
    // Bulan sebelumnya - menunggu persetujuan
    {
      id: 7,
      tanggal: new Date(previousYear, previousMonth, 28),
      tuanRumah: "Gunawan Wibisono",
      jumlahHadir: 27,
      biaya: 375000,
      status: 'pending',
      createdAt: new Date(previousYear, previousMonth, 29, 15, 45, 0),
    },
    
    // Bulan sebelumnya - sudah disetujui
    {
      id: 8,
      tanggal: new Date(previousYear, previousMonth, 15),
      tuanRumah: "Hendra Setiawan",
      jumlahHadir: 24,
      biaya: 320000,
      status: 'approved',
      createdAt: new Date(previousYear, previousMonth, 16, 10, 30, 0),
      message: "Terima kasih atas pelaksanaan kegiatan yang lancar"
    },
    {
      id: 9,
      tanggal: new Date(previousYear, previousMonth, 21),
      tuanRumah: "Indra Jaya",
      jumlahHadir: 19,
      biaya: 260000,
      status: 'approved',
      createdAt: new Date(previousYear, previousMonth, 22, 13, 15, 0),
    },
    
    // Bulan sebelumnya - ditolak
    {
      id: 10,
      tanggal: new Date(previousYear, previousMonth, 8),
      tuanRumah: "Joko Susilo",
      jumlahHadir: 12,
      biaya: 180000,
      status: 'rejected',
      createdAt: new Date(previousYear, previousMonth, 9, 11, 45, 0),
      message: "Bukti pengeluaran tidak valid"
    },
    
    // Bulan berikutnya - sudah dijadwalkan
    {
      id: 11,
      tanggal: new Date(nextYear, nextMonth, 5),
      tuanRumah: "Kartini Sari",
      jumlahHadir: 28,
      biaya: 385000,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 25, 9, 0, 0),
      message: "Pengajuan ini untuk kegiatan bulan depan"
    },
    {
      id: 12,
      tanggal: new Date(nextYear, nextMonth, 12),
      tuanRumah: "Lukman Hakim",
      jumlahHadir: 23,
      biaya: 310000,
      status: 'pending',
      createdAt: new Date(currentYear, currentMonth, 26, 10, 30, 0),
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