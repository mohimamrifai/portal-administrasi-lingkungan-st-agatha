"use server"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function registerAction({ username, password, passphrase, familyHeadName }: { username: string, password: string, passphrase: string, familyHeadName: string }) {
  if (!username || !password || !passphrase || !familyHeadName) {
    return { error: "Data tidak lengkap" }
  }
  // Cari FamilyHead berdasarkan nama
  const familyHead = await prisma.familyHead.findFirst({ where: { fullName: familyHeadName } })
  if (!familyHead) {
    return { error: "Nama Kepala Keluarga tidak ditemukan" }
  }
  // Cek username sudah ada
  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    return { error: "Username sudah terdaftar" }
  }
  // Hash password dan passphrase
  const hashedPassword = await bcrypt.hash(password, 10)
  const hashedPassphrase = await bcrypt.hash(passphrase, 10)
  // Buat user baru
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      passphrase: hashedPassphrase,
      role: "umat",
      familyHeadId: familyHead.id,
    },
  })
  return { success: true, user: { id: user.id, username: user.username } }
} 