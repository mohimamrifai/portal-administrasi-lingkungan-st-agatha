"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Agama, StatusKehidupan, StatusPernikahan, JenisTanggungan } from "@prisma/client"
import { adaptProfileData } from "./profile-adapters"

/**
 * Mendapatkan data profil dan keluarga berdasarkan userId
 */
export async function getProfileData(userId: string) {
  try {
    // Ambil data user dan keluarga terkait
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        keluarga: {
          include: {
            pasangan: true,
            tanggungan: true
          }
        }
      }
    })

    if (!user || !user.keluarga) {
      return { success: false, error: "Data profil tidak ditemukan" }
    }

    // Gunakan adapter untuk konversi data
    const profileData = adaptProfileData(user.keluarga)

    return {
      success: true,
      data: profileData
    }
  } catch (error) {
    console.error("Error getting profile data:", error)
    return { success: false, error: "Terjadi kesalahan saat mengambil data profil" }
  }
}

/**
 * Memperbarui data kepala keluarga
 */
export async function updateFamilyHead(userId: string, data: {
  fullName: string
  birthPlace: string
  birthDate: Date
  address: string
  city: string
  phoneNumber: string
  education: string
  maritalStatus: StatusPernikahan
  livingStatus: StatusKehidupan
  baptismDate?: Date | null
  confirmationDate?: Date | null
  deathDate?: Date | null
}) {
  try {
    // Cari user untuk memastikan user memiliki keluarga
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { keluargaId: true }
    })

    if (!user || !user.keluargaId) {
      return { success: false, error: "User tidak terkait dengan keluarga" }
    }

    // Update data kepala keluarga
    await prisma.keluargaUmat.update({
      where: { id: user.keluargaId },
      data: {
        namaKepalaKeluarga: data.fullName,
        tempatLahir: data.birthPlace,
        tanggalLahir: data.birthDate,
        alamat: data.address,
        kotaDomisili: data.city,
        nomorTelepon: data.phoneNumber,
        pendidikanTerakhir: data.education,
        statusPernikahan: data.maritalStatus,
        status: data.livingStatus,
        tanggalBaptis: data.baptismDate,
        tanggalKrisma: data.confirmationDate,
        tanggalMeninggal: data.deathDate,
      }
    })

    // Jika status pernikahan berubah menjadi TIDAK_MENIKAH, hapus pasangan jika ada
    if (data.maritalStatus === StatusPernikahan.TIDAK_MENIKAH) {
      const keluarga = await prisma.keluargaUmat.findUnique({
        where: { id: user.keluargaId },
        include: { pasangan: true }
      })

      if (keluarga?.pasangan) {
        await prisma.pasangan.delete({
          where: { id: keluarga.pasangan.id }
        })
      }
    }

    revalidatePath("/pengaturan/profil")
    return { success: true }
  } catch (error) {
    console.error("Error updating family head:", error)
    return { success: false, error: "Terjadi kesalahan saat memperbarui data kepala keluarga" }
  }
}

/**
 * Memperbarui atau membuat data pasangan
 */
export async function updateSpouse(userId: string, data: {
  fullName: string
  birthPlace: string
  birthDate: Date
  phoneNumber?: string | null
  education: string
  religion: Agama
  bidukNumber?: string | null
  livingStatus: StatusKehidupan
  baptismDate?: Date | null
  confirmationDate?: Date | null
  deathDate?: Date | null
}) {
  try {
    // Cari user untuk memastikan user memiliki keluarga
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        keluarga: {
          include: { pasangan: true }
        }
      }
    })

    if (!user || !user.keluargaId) {
      return { success: false, error: "User tidak terkait dengan keluarga" }
    }

    // Jika pasangan sudah ada, update
    if (user.keluarga?.pasangan) {
      await prisma.pasangan.update({
        where: { id: user.keluarga.pasangan.id },
        data: {
          nama: data.fullName,
          tempatLahir: data.birthPlace,
          tanggalLahir: data.birthDate,
          nomorTelepon: data.phoneNumber,
          pendidikanTerakhir: data.education,
          agama: data.religion,
          noBiduk: data.bidukNumber,
          status: data.livingStatus,
          tanggalBaptis: data.baptismDate,
          tanggalKrisma: data.confirmationDate,
          tanggalMeninggal: data.deathDate,
        }
      })
    } else {
      // Jika belum ada, buat baru
      await prisma.pasangan.create({
        data: {
          nama: data.fullName,
          tempatLahir: data.birthPlace,
          tanggalLahir: data.birthDate,
          nomorTelepon: data.phoneNumber,
          pendidikanTerakhir: data.education,
          agama: data.religion,
          noBiduk: data.bidukNumber,
          status: data.livingStatus,
          tanggalBaptis: data.baptismDate,
          tanggalKrisma: data.confirmationDate,
          tanggalMeninggal: data.deathDate,
          keluarga: {
            connect: { id: user.keluargaId }
          }
        }
      })

      // Update status pernikahan jika belum menikah
      if (user.keluarga?.statusPernikahan === StatusPernikahan.TIDAK_MENIKAH) {
        await prisma.keluargaUmat.update({
          where: { id: user.keluargaId },
          data: { statusPernikahan: StatusPernikahan.MENIKAH }
        })
      }
    }

    revalidatePath("/pengaturan/profil")
    return { success: true }
  } catch (error) {
    console.error("Error updating spouse:", error)
    return { success: false, error: "Terjadi kesalahan saat memperbarui data pasangan" }
  }
}

/**
 * Menambahkan tanggungan baru
 */
export async function addDependent(userId: string, data: {
  name: string
  dependentType: JenisTanggungan
  birthDate: Date
  education: string
  religion: Agama
  maritalStatus: StatusPernikahan
  baptismDate?: Date | null
  confirmationDate?: Date | null
}) {
  try {
    // Cari user untuk memastikan user memiliki keluarga
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { keluargaId: true }
    })

    if (!user || !user.keluargaId) {
      return { success: false, error: "User tidak terkait dengan keluarga" }
    }

    // Buat tanggungan baru
    await prisma.tanggungan.create({
      data: {
        nama: data.name,
        jenisTanggungan: data.dependentType,
        tanggalLahir: data.birthDate,
        pendidikanTerakhir: data.education,
        agama: data.religion,
        statusPernikahan: data.maritalStatus,
        tanggalBaptis: data.baptismDate,
        tanggalKrisma: data.confirmationDate,
        keluarga: {
          connect: { id: user.keluargaId }
        }
      }
    })

    // Update jumlah tanggungan di keluarga
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id: user.keluargaId },
      include: {
        tanggungan: true,
        pasangan: true
      }
    })

    if (keluarga) {
      const jumlahAnakTertanggung = keluarga.tanggungan.filter(
        t => t.jenisTanggungan === JenisTanggungan.ANAK
      ).length

      const jumlahKerabatTertanggung = keluarga.tanggungan.filter(
        t => t.jenisTanggungan === JenisTanggungan.KERABAT
      ).length

      await prisma.keluargaUmat.update({
        where: { id: keluarga.id },
        data: {
          jumlahAnakTertanggung,
          jumlahKerabatTertanggung,
          jumlahAnggotaKeluarga: 1 + (keluarga.pasangan ? 1 : 0) + jumlahAnakTertanggung + jumlahKerabatTertanggung
        }
      })
    }

    revalidatePath("/pengaturan/profil")
    return { success: true }
  } catch (error) {
    console.error("Error adding dependent:", error)
    return { success: false, error: "Terjadi kesalahan saat menambahkan tanggungan" }
  }
}

/**
 * Memperbarui data tanggungan
 */
export async function updateDependent(dependentId: string, data: {
  name: string
  dependentType: JenisTanggungan
  birthDate: Date
  education: string
  religion: Agama
  maritalStatus: StatusPernikahan
  baptismDate?: Date | null
  confirmationDate?: Date | null
}) {
  try {
    // Update tanggungan
    await prisma.tanggungan.update({
      where: { id: dependentId },
      data: {
        nama: data.name,
        jenisTanggungan: data.dependentType,
        tanggalLahir: data.birthDate,
        pendidikanTerakhir: data.education,
        agama: data.religion,
        statusPernikahan: data.maritalStatus,
        tanggalBaptis: data.baptismDate,
        tanggalKrisma: data.confirmationDate,
      }
    })

    revalidatePath("/pengaturan/profil")
    return { success: true }
  } catch (error) {
    console.error("Error updating dependent:", error)
    return { success: false, error: "Terjadi kesalahan saat memperbarui data tanggungan" }
  }
}

/**
 * Menghapus tanggungan
 */
export async function deleteDependent(dependentId: string, userId: string) {
  try {
    // Ambil data keluarga
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { keluargaId: true }
    })

    if (!user || !user.keluargaId) {
      return { success: false, error: "User tidak terkait dengan keluarga" }
    }

    // Hapus tanggungan
    await prisma.tanggungan.delete({
      where: { id: dependentId }
    })

    // Update jumlah tanggungan di keluarga
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id: user.keluargaId },
      include: {
        tanggungan: true,
        pasangan: true
      }
    })

    if (keluarga) {
      const jumlahAnakTertanggung = keluarga.tanggungan.filter(
        t => t.jenisTanggungan === JenisTanggungan.ANAK
      ).length

      const jumlahKerabatTertanggung = keluarga.tanggungan.filter(
        t => t.jenisTanggungan === JenisTanggungan.KERABAT
      ).length

      await prisma.keluargaUmat.update({
        where: { id: keluarga.id },
        data: {
          jumlahAnakTertanggung,
          jumlahKerabatTertanggung,
          jumlahAnggotaKeluarga: 1 + (keluarga.pasangan ? 1 : 0) + jumlahAnakTertanggung + jumlahKerabatTertanggung
        }
      })
    }

    revalidatePath("/pengaturan/profil")
    return { success: true }
  } catch (error) {
    console.error("Error deleting dependent:", error)
    return { success: false, error: "Terjadi kesalahan saat menghapus tanggungan" }
  }
} 