import { z } from "zod";

// Transaction interface
export interface Transaction {
  id: number;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  locked: boolean;
  transactionType?: string;
  transactionSubtype?: string;
  familyHeadId?: number;
}

// Transaction types
export const transactionTypes = [
  { value: "debit", label: "Uang Masuk (Pemasukan)" },
  { value: "credit", label: "Uang Keluar (Pengeluaran)" }
] as const;

// Transaction subtypes
export const transactionSubtypes = {
  debit: [
    { value: "kolekte_1", label: "Kolekte I" },
    { value: "kolekte_2", label: "Kolekte II" },
    { value: "sumbangan_umat", label: "Sumbangan Umat" },
    { value: "penerimaan_lain", label: "Penerimaan Lain-Lain" },
    { value: "transfer_ikata", label: "Transfer dari IKATA" }
  ],
  credit: [
    { value: "operasional", label: "Biaya Operasional" },
    { value: "kegiatan", label: "Penyelenggaraan Kegiatan" },
    { value: "pembelian", label: "Pembelian" },
    { value: "sosial_duka", label: "Sosial-Duka" },
    { value: "transfer_ikata", label: "Transfer Dana ke IKATA" },
    { value: "lain_lain", label: "Lain-Lain" }
  ]
};

// Form schemas
export const transactionFormSchema = z.object({
  date: z.date({
    required_error: "Tanggal wajib diisi",
  }),
  description: z.string().min(3, {
    message: "Keterangan minimal 3 karakter",
  }),
  type: z.enum(["debit", "credit"], {
    required_error: "Jenis transaksi wajib dipilih",
  }),
  subtype: z.string({
    required_error: "Tipe transaksi wajib dipilih",
  }),
  amount: z.coerce.number().positive({
    message: "Jumlah harus lebih dari 0",
  }),
  fromIkata: z.boolean().optional(),
  familyHeadId: z.number().optional(),
  confirmIkataTransfer: z.boolean().optional(),
});

export const printPdfSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "Tanggal mulai wajib diisi",
    }),
    to: z.date({
      required_error: "Tanggal akhir wajib diisi",
    }),
  }),
});

// Mock Family Heads data (in a real app, this would come from an API)
export const familyHeads = [
  { id: 1, name: "Budi Santoso" },
  { id: 2, name: "Agus Wijaya" },
  { id: 3, name: "Hendra Gunawan" },
  { id: 4, name: "Bambang Sutrisno" },
  { id: 5, name: "Joko Susilo" },
  { id: 6, name: "Ahmad Hidayat" },
  { id: 7, name: "Dedi Purnomo" },
  { id: 8, name: "Eko Prasetyo" },
  { id: 9, name: "Yusuf Wibowo" },
  { id: 10, name: "Andi Setiawan" }
];

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type PrintPdfFormValues = z.infer<typeof printPdfSchema>; 