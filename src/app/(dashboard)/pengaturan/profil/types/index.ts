import { z } from "zod"

// Gender enum
export enum Gender {
  MALE = "Laki-laki",
  FEMALE = "Perempuan"
}

// Marital status enum
export enum MaritalStatus {
  SINGLE = "Belum Menikah",
  MARRIED = "Menikah",
  WIDOWED = "Janda/Duda"
}

// Profile interfaces
export interface FamilyHead {
  id: number
  fullName: string
  gender: Gender
  birthPlace: string
  birthDate: Date
  nik: string
  maritalStatus: MaritalStatus
  address: string
  phoneNumber: string
  email: string
  occupation: string
  imageUrl?: string
}

export interface Spouse {
  id: number
  fullName: string
  gender: Gender
  birthPlace: string
  birthDate: Date
  nik: string
  phoneNumber: string
  email: string
  occupation: string
  imageUrl?: string
}

export interface Dependent {
  id: number
  fullName: string
  gender: Gender
  birthPlace: string
  birthDate: Date
  nik: string
  relationship: string
  occupation: string
  imageUrl?: string
}

export interface ProfileData {
  familyHead: FamilyHead
  spouse: Spouse | null
  dependents: Dependent[]
}

// Validation schemas
export const familyHeadFormSchema = z.object({
  fullName: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
  gender: z.nativeEnum(Gender, { 
    required_error: "Jenis kelamin wajib dipilih" 
  }),
  birthPlace: z.string().min(3, { message: "Tempat lahir minimal 3 karakter" }),
  birthDate: z.date({ 
    required_error: "Tanggal lahir wajib diisi" 
  }),
  nik: z.string().regex(/^\d{16}$/, { message: "NIK harus 16 digit angka" }),
  maritalStatus: z.nativeEnum(MaritalStatus, { 
    required_error: "Status pernikahan wajib dipilih" 
  }),
  address: z.string().min(5, { message: "Alamat minimal 5 karakter" }),
  phoneNumber: z.string().regex(/^08\d{8,11}$/, { 
    message: "Nomor telepon harus dimulai dengan 08 dan minimal 10 digit" 
  }),
  email: z.string().email({ message: "Format email tidak valid" }).optional().or(z.literal("")),
  occupation: z.string().min(3, { message: "Pekerjaan minimal 3 karakter" }),
  imageUrl: z.string().optional()
})

export const spouseFormSchema = z.object({
  fullName: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
  gender: z.nativeEnum(Gender, { 
    required_error: "Jenis kelamin wajib dipilih" 
  }),
  birthPlace: z.string().min(3, { message: "Tempat lahir minimal 3 karakter" }),
  birthDate: z.date({ 
    required_error: "Tanggal lahir wajib diisi" 
  }),
  nik: z.string().regex(/^\d{16}$/, { message: "NIK harus 16 digit angka" }),
  phoneNumber: z.string().regex(/^08\d{8,11}$/, { 
    message: "Nomor telepon harus dimulai dengan 08 dan minimal 10 digit" 
  }),
  email: z.string().email({ message: "Format email tidak valid" }).optional().or(z.literal("")),
  occupation: z.string().min(3, { message: "Pekerjaan minimal 3 karakter" }),
  imageUrl: z.string().optional()
})

export const dependentFormSchema = z.object({
  fullName: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
  gender: z.nativeEnum(Gender, { 
    required_error: "Jenis kelamin wajib dipilih" 
  }),
  birthPlace: z.string().min(3, { message: "Tempat lahir minimal 3 karakter" }),
  birthDate: z.date({ 
    required_error: "Tanggal lahir wajib diisi" 
  }),
  nik: z.string().regex(/^\d{16}$/, { message: "NIK harus 16 digit angka" }),
  relationship: z.string().min(2, { message: "Hubungan minimal 2 karakter" }),
  occupation: z.string().min(3, { message: "Pekerjaan minimal 3 karakter" }).optional().or(z.literal("")),
  imageUrl: z.string().optional()
})

export type FamilyHeadFormValues = z.infer<typeof familyHeadFormSchema>
export type SpouseFormValues = z.infer<typeof spouseFormSchema>
export type DependentFormValues = z.infer<typeof dependentFormSchema> 