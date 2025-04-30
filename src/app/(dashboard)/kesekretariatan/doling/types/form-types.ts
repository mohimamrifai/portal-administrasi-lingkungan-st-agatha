import { DetilDoling, JadwalDoling } from ".";

export interface DetilDolingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detil?: DetilDoling;
  onSubmit: (values: Omit<DetilDoling, 'id' | 'createdAt' | 'updatedAt'>) => void;
  jadwalDoling: JadwalDoling[];
}

// Enum untuk jenis ibadat
export const jenisIbadatOptions = [
  { value: "doa-lingkungan", label: "Doa Lingkungan" },
  { value: "misa", label: "Misa" },
  { value: "pertemuan", label: "Pertemuan" },
  { value: "bakti-sosial", label: "Bakti Sosial" },
  { value: "kegiatan-lainnya", label: "Kegiatan Lainnya" },
] as const;

export type JenisIbadat = typeof jenisIbadatOptions[number]['value'];

// Sub ibadat berdasarkan jenis ibadat
export const subIbadatOptions: Record<JenisIbadat, Array<{ value: string; label: string }>> = {
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