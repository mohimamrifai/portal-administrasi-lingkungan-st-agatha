import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Menambahkan tipe kustom pada objek Session
   */
  interface Session {
    user: {
      id?: string
      role?: string
      familyHeadId?: number | null
      familyHeadName?: string | null
    } & DefaultSession["user"]
  }

  /**
   * Diperluas dari objek User default
   */
  interface User {
    role?: string
    familyHeadId?: number | null
    familyHeadName?: string | null
  }
}

declare module "next-auth/jwt" {
  /**
   * Menambahkan tipe kustom pada token JWT
   */
  interface JWT {
    id?: string
    role?: string
    familyHeadId?: number | null
    familyHeadName?: string | null
  }
} 