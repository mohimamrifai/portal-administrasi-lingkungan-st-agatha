"use server"

import { signIn } from "next-auth/react"

export async function loginAction(username: string, password: string) {
  // signIn dari next-auth/react hanya bisa dipanggil di client, jadi action ini hanya sebagai contoh stub
  // Untuk login di server action, gunakan fetch ke /api/auth/callback/credentials jika ingin full server-side
  // Namun best practice: login tetap di client pakai signIn
  return { error: "Gunakan signIn dari next-auth/react di client" }
} 