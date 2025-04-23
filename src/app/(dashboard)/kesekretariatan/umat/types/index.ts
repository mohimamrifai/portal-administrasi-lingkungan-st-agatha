import { z } from "zod";

export interface FamilyHead {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  status: "active" | "moved" | "deceased";
  createdAt: Date;
  updatedAt: Date;
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
  status: z.enum(["active", "moved", "deceased"], {
    required_error: "Status wajib dipilih",
  }),
});

export type FamilyHeadFormValues = z.infer<typeof familyHeadFormSchema>; 