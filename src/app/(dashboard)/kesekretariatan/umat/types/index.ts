import { z } from "zod";

export interface FamilyHead {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  joinDate: Date;
  childrenCount: number;
  relativesCount: number;
  familyMembersCount: number;
  status: "active" | "moved" | "deceased";
  createdAt: Date;
  updatedAt: Date;
  // Jika status pindah, kapan data akan dihapus otomatis
  scheduledDeleteDate?: Date;
  // Jika status meninggal, siapa anggota keluarga yang meninggal
  deceasedMemberName?: string;
}

export const familyHeadStatuses = [
  { value: "active", label: "Aktif" },
  { value: "moved", label: "Pindah" },
  { value: "deceased", label: "Meninggal" }
] as const;

export const familyHeadFormSchema = z.object({
  name: z.string().min(3, {
    message: "Nama minimal 3 karakter",
  }),
  address: z.string().min(5, {
    message: "Alamat minimal 5 karakter",
  }),
  phoneNumber: z.string().min(10, {
    message: "Nomor telepon minimal 10 digit",
  }),
  joinDate: z.date({
    required_error: "Tanggal bergabung wajib diisi",
  }),
  childrenCount: z.number().int().min(0, {
    message: "Jumlah anak tertanggung tidak boleh negatif",
  }),
  relativesCount: z.number().int().min(0, {
    message: "Jumlah kerabat tertanggung tidak boleh negatif",
  }),
  familyMembersCount: z.number().int().min(1, {
    message: "Jumlah anggota keluarga minimal 1",
  }),
  status: z.enum(["active", "moved", "deceased"], {
    required_error: "Status wajib dipilih",
  }),
  // Opsional, hanya diisi jika status adalah deceased
  deceasedMemberName: z.string().optional(),
});

export type FamilyHeadFormValues = z.infer<typeof familyHeadFormSchema>; 