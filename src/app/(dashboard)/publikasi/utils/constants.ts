// Konstanta role yang ada pada aplikasi
export const ROLES = [
  { id: "all", label: "Semua Pengguna" },
  { id: "umat", label: "Umat" },
  { id: "ketuaLingkungan", label: "Ketua Lingkungan" },
  { id: "sekretaris", label: "Sekretaris" },
  { id: "bendahara", label: "Bendahara" },
  { id: "adminLingkungan", label: "Admin Lingkungan" },
  { id: "pengurus", label: "Pengurus" },
  { id: "superUser", label: "SuperUser" }
];

// Konstanta target penerima untuk publikasi - disesuaikan dengan ROLES
export const TARGET_PENERIMA = [
  { id: "all", label: "Semua Pengguna" },
  { id: "umat", label: "Umat" },
  { id: "ketuaLingkungan", label: "Ketua Lingkungan" },
  { id: "sekretaris", label: "Sekretaris" },
  { id: "bendahara", label: "Bendahara" },
  { id: "adminLingkungan", label: "Admin Lingkungan" },
  { id: "pengurus", label: "Pengurus" },
  { id: "superUser", label: "SuperUser" },
  // Target berdasarkan kategori khusus
  { id: "ketuaKeluarga", label: "Kepala Keluarga" },
  { id: "ikata", label: "Anggota IKATA" },
  { id: "doling", label: "Peserta Doa Lingkungan" }
];

// Konstanta kategori publikasi
export const KATEGORI_PUBLIKASI = [
  { id: "penting", label: "Penting", color: "red" },
  { id: "segera", label: "Segera", color: "orange" },
  { id: "rahasia", label: "Rahasia", color: "purple" },
  { id: "umum", label: "Umum", color: "blue" }
];

// Konstanta status publikasi
export const STATUS_PUBLIKASI = [
  { id: "aktif", label: "Aktif" },
  { id: "kedaluwarsa", label: "Kedaluwarsa" }
];

// Konstanta jenis dokumen untuk laporan
export const JENIS_LAPORAN = [
  { id: "rapat", label: "Notulensi Rapat" },
  { id: "keuangan", label: "Laporan Keuangan" },
  { id: "kegiatan", label: "Laporan Kegiatan" },
  { id: "doling", label: "Laporan Doa Lingkungan" },
  { id: "kunjungan", label: "Laporan Kunjungan" }
]; 