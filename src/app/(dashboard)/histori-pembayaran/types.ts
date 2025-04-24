export type PaymentStatus = "Lunas" | "Menunggu" | "Belum Bayar";

export interface PaymentHistory {
  id: number;
  userId: number;
  familyHeadName: string;
  type: "Dana Mandiri" | "IKATA";
  description: string;
  amount: number;
  status: PaymentStatus;
  year: number;
  paymentDate: Date | null;
} 