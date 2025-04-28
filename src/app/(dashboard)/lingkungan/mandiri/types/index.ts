import { z } from "zod";

// Dana Mandiri Transaction interface
export interface DanaMandiriTransaction {
  id: number;
  familyHeadId: number;
  year: number;
  amount: number;
  status: "pending" | "paid" | "submitted";
  paymentDate: Date;
  isLocked: boolean;
  notes?: string;
  paymentStatus: "Lunas" | "Belum Lunas";
}

// Interface for Arrears data (Tab 2)
export interface DanaMandiriArrears {
  id: number;
  familyHeadId: number;
  periods: number[]; // Array of years with arrears
  totalAmount: number;
  lastNotificationDate?: Date;
}

// Family Head data
export interface FamilyHead {
  id: number;
  name: string;
  address?: string;
  phoneNumber?: string;
}

// Payment Status options
export const paymentStatusOptions = [
  { value: "Lunas", label: "Lunas" },
  { value: "Belum Lunas", label: "Belum Lunas" },
];

// Form schemas
export const transactionFormSchema = z.object({
  familyHeadId: z.number({
    required_error: "Kepala keluarga wajib dipilih",
  }),
  year: z.coerce.number({
    required_error: "Tahun wajib diisi",
  }).min(2000).max(2100),
  amount: z.coerce.number().positive({
    message: "Jumlah harus lebih dari 0",
  }),
  paymentDate: z.date({
    required_error: "Tanggal pembayaran wajib diisi",
  }),
  notes: z.string().optional(),
  paymentStatus: z.enum(["Lunas", "Belum Lunas"], {
    required_error: "Status pembayaran wajib dipilih",
  }),
});

export const printPdfSchema = z.object({
  documentType: z.enum(["payment_receipt", "yearly_report", "debt_report"]),
  year: z.number(),
  fileFormat: z.literal("pdf")
});

export const setDuesSchema = z.object({
  year: z.number({
    required_error: "Tahun wajib diisi",
  }),
  amount: z.coerce.number().positive({
    message: "Jumlah iuran harus lebih dari 0",
  }),
});

export const submitToParokiSchema = z.object({
  transactionIds: z.array(z.number()),
  submissionDate: z.date({
    required_error: "Tanggal penyetoran wajib diisi",
  }),
  submissionNote: z.string().optional(),
});

export const sendReminderSchema = z.object({
  familyHeadIds: z.array(z.number()),
  message: z.string().min(10, {
    message: "Pesan minimal 10 karakter",
  }),
});

// Mock Family Heads data (in a real app, this would come from an API)
export const familyHeads: FamilyHead[] = [
  { id: 1, name: "Budi Santoso", address: "Jl. Mawar No. 10", phoneNumber: "081234567890" },
  { id: 2, name: "Agus Wijaya", address: "Jl. Melati No. 15", phoneNumber: "081234567891" },
  { id: 3, name: "Hendra Gunawan", address: "Jl. Anggrek No. 20", phoneNumber: "081234567892" },
  { id: 4, name: "Bambang Sutrisno", address: "Jl. Kenanga No. 25", phoneNumber: "081234567893" },
  { id: 5, name: "Joko Susilo", address: "Jl. Tulip No. 30", phoneNumber: "081234567894" },
  { id: 6, name: "Ahmad Hidayat", address: "Jl. Dahlia No. 35", phoneNumber: "081234567895" },
  { id: 7, name: "Dedi Purnomo", address: "Jl. Kamboja No. 40", phoneNumber: "081234567896" },
  { id: 8, name: "Eko Prasetyo", address: "Jl. Teratai No. 45", phoneNumber: "081234567897" },
  { id: 9, name: "Yusuf Wibowo", address: "Jl. Lotus No. 50", phoneNumber: "081234567898" },
  { id: 10, name: "Andi Setiawan", address: "Jl. Sakura No. 55", phoneNumber: "081234567899" }
];

// Type exports based on the schemas
export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type PrintPdfFormValues = z.infer<typeof printPdfSchema>;
export type SetDuesValues = z.infer<typeof setDuesSchema>;
export type SubmitToParokiValues = z.infer<typeof submitToParokiSchema>;
export type SendReminderValues = z.infer<typeof sendReminderSchema>; 