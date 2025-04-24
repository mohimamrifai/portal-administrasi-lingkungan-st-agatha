export interface Publikasi {
  id: string
  judul: string
  tanggal: string
  waktu: string
  lokasi: string
  targetPenerima: TargetPenerimaType
  status: "aktif" | "kedaluwarsa"
  pembuat: string
  lampiran: boolean
  locked: boolean
  kategori: "Penting" | "Umum" | "Rahasia" | "Segera"
}

export type KategoriPublikasi = "Penting" | "Umum" | "Rahasia" | "Segera"
export type StatusPublikasi = "aktif" | "kedaluwarsa"
export type TargetPenerimaType = 
  | "Semua Pengguna"
  | "Umat"
  | "Ketua Lingkungan"
  | "Sekretaris"
  | "Bendahara"
  | "Admin Lingkungan"
  | "Pengurus"
  | "SuperUser"
  | "Kepala Keluarga"
  | "Anggota IKATA"
  | "Peserta Doa Lingkungan" 