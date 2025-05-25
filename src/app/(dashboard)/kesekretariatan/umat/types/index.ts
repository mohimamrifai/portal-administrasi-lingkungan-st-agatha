import { z } from "zod";
import { StatusKehidupan, StatusPernikahan } from "@prisma/client";
import { FamilyHeadData } from "../actions";

// Re-export FamilyHeadData untuk kompatibilitas
export type { FamilyHeadData } from "../actions";

// Alias untuk FamilyHead (kompatibilitas dengan kode lama)
export type FamilyHead = FamilyHeadData;

export const familyHeadStatuses = [
  { value: StatusKehidupan.HIDUP, label: "Aktif" },
  { value: StatusKehidupan.MENINGGAL, label: "Tidak Aktif" }
] as const;

export const familyHeadFormSchema = z.object({
  namaKepalaKeluarga: z.string().min(3, {
    message: "Nama minimal 3 karakter",
  }),
  alamat: z.string().min(5, {
    message: "Alamat minimal 5 karakter",
  }),
  nomorTelepon: z.string().min(10, {
    message: "Nomor telepon minimal 10 digit",
  }).optional().nullable(),
  tanggalBergabung: z.date({
    required_error: "Tanggal bergabung wajib diisi",
  }),
  jumlahAnakTertanggung: z.number().int().min(0, {
    message: "Jumlah anak tertanggung tidak boleh negatif",
  }),
  jumlahKerabatTertanggung: z.number().int().min(0, {
    message: "Jumlah kerabat tertanggung tidak boleh negatif",
  }),
  jumlahAnggotaKeluarga: z.number().int().min(1, {
    message: "Jumlah anggota keluarga minimal 1",
  }),
  status: z.nativeEnum(StatusKehidupan, {
    required_error: "Status wajib dipilih",
  }),
  statusPernikahan: z.nativeEnum(StatusPernikahan, {
    required_error: "Status pernikahan wajib dipilih",
  }),
  tanggalKeluar: z.date().optional().nullable(),
  tanggalMeninggal: z.date().optional().nullable(),
});

export type FamilyHeadFormValues = z.infer<typeof familyHeadFormSchema>; 