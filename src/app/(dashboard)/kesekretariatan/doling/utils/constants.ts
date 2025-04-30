// Constants untuk opsi filter
export const tahunOptions = [
  { value: "all", label: "Semua Tahun" },
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
];

export const bulanOptions = [
  { value: "all", label: "Semua Bulan" },
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

export const statusJadwalOptions = [
  { value: "all", label: "Semua Status" },
  { value: "terjadwal", label: "Terjadwal" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export const statusDetilOptions = [
  { value: "all", label: "Semua Status" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export const approvalOptions = [
  { value: "all", label: "Semua" },
  { value: "approved", label: "Sudah Diapprove" },
  { value: "notApproved", label: "Belum Diapprove" },
];

export const jenisIbadatOptions = [
  { value: "doa-lingkungan", label: "Doa Lingkungan" },
  { value: "misa", label: "Misa" },
  { value: "pertemuan", label: "Pertemuan" },
  { value: "bakti-sosial", label: "Bakti Sosial" },
  { value: "kegiatan-lainnya", label: "Kegiatan Lainnya" },
];

// Sub ibadat berdasarkan jenis ibadat
export const subIbadatOptions: Record<string, Array<{ value: string; label: string }>> = {
  "doa-lingkungan": [
    { value: "umum", label: "Umum" },
    { value: "app", label: "APP (Aksi Puasa Pembangunan)" },
    { value: "bksn", label: "BKSN (Bulan Kitab Suci Nasional)" },
    { value: "novena", label: "Novena" },
    { value: "rosario", label: "Doa Rosario" },
  ],
  "misa": [
    { value: "mingguan", label: "Misa Mingguan" },
    { value: "requiem", label: "Misa Requiem" },
    { value: "perkawinan", label: "Misa Perkawinan" },
    { value: "khusus", label: "Misa Khusus" },
  ],
  "pertemuan": [
    { value: "rapat", label: "Rapat Lingkungan" },
    { value: "evaluasi", label: "Evaluasi Kegiatan" },
    { value: "koordinasi", label: "Koordinasi" },
  ],
  "bakti-sosial": [
    { value: "sumbangan", label: "Pengumpulan Sumbangan" },
    { value: "kunjungan", label: "Kunjungan Kasih" },
    { value: "kerja-bakti", label: "Kerja Bakti" },
  ],
  "kegiatan-lainnya": [
    { value: "perayaan", label: "Perayaan" },
    { value: "seminar", label: "Seminar/Workshop" },
    { value: "lainnya", label: "Lainnya" },
  ],
}; 