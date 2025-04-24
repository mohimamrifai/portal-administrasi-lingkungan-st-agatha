import { z } from "zod";

// Status pembayaran
export type PaymentStatus = "Lunas" | "Menunggu" | "Belum Bayar";

// Interface untuk data pembayaran
export interface PaymentHistory {
  id: number;
  userId?: number;
  familyHeadName?: string;
  year: number;
  paymentDate: Date | null;
  amount: number;
  status: PaymentStatus;
  type: "Dana Mandiri" | "IKATA";
  description?: string;
}

// Filter form schema
export const filterFormSchema = z.object({
  year: z.number().min(2000).max(new Date().getFullYear() + 1),
});

export type FilterFormValues = z.infer<typeof filterFormSchema>; 