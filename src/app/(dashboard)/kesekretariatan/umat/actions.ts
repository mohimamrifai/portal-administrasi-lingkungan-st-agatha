"use server";

import { prisma } from "@/lib/db";
import { StatusKehidupan, StatusPernikahan } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Tipe untuk data yang ditampilkan di UI
export interface FamilyHeadData {
  id: string;
  nama: string;
  alamat: string;
  nomorTelepon: string | null;
  tanggalBergabung: Date;
  jumlahAnakTertanggung: number;
  jumlahKerabatTertanggung: number;
  jumlahAnggotaKeluarga: number;
  status: StatusKehidupan;
  tanggalKeluar?: Date | null;
  tanggalMeninggal?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Tipe untuk form penambahan/edit data
export interface FamilyHeadFormData {
  namaKepalaKeluarga: string;
  alamat: string;
  nomorTelepon?: string;
  tanggalBergabung: Date;
  jumlahAnakTertanggung: number;
  jumlahKerabatTertanggung: number;
  jumlahAnggotaKeluarga: number;
  status: StatusKehidupan;
  tanggalKeluar?: Date;
  tanggalMeninggal?: Date;
}

/**
 * Mengambil semua data kepala keluarga
 */
export async function getAllFamilyHeads(): Promise<FamilyHeadData[]> {
  try {
    const keluargaUmat = await prisma.keluargaUmat.findMany({
      orderBy: {
        namaKepalaKeluarga: 'asc',
      },
    });

    return keluargaUmat.map(keluarga => ({
      id: keluarga.id,
      nama: keluarga.namaKepalaKeluarga,
      alamat: keluarga.alamat,
      nomorTelepon: keluarga.nomorTelepon,
      tanggalBergabung: keluarga.tanggalBergabung,
      jumlahAnakTertanggung: keluarga.jumlahAnakTertanggung,
      jumlahKerabatTertanggung: keluarga.jumlahKerabatTertanggung,
      jumlahAnggotaKeluarga: keluarga.jumlahAnggotaKeluarga,
      status: keluarga.status,
      tanggalKeluar: keluarga.tanggalKeluar,
      tanggalMeninggal: keluarga.tanggalMeninggal,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  } catch (error) {
    console.error("Error getting family heads:", error);
    throw new Error("Gagal mengambil data kepala keluarga");
  }
}

/**
 * Mengambil data kepala keluarga berdasarkan ID
 */
export async function getFamilyHeadById(id: string): Promise<FamilyHeadData | null> {
  try {
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id },
    });

    if (!keluarga) return null;

    return {
      id: keluarga.id,
      nama: keluarga.namaKepalaKeluarga,
      alamat: keluarga.alamat,
      nomorTelepon: keluarga.nomorTelepon,
      tanggalBergabung: keluarga.tanggalBergabung,
      jumlahAnakTertanggung: keluarga.jumlahAnakTertanggung,
      jumlahKerabatTertanggung: keluarga.jumlahKerabatTertanggung,
      jumlahAnggotaKeluarga: keluarga.jumlahAnggotaKeluarga,
      status: keluarga.status,
      tanggalKeluar: keluarga.tanggalKeluar,
      tanggalMeninggal: keluarga.tanggalMeninggal,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error getting family head by ID:", error);
    throw new Error("Gagal mengambil data kepala keluarga");
  }
}

/**
 * Menambahkan data kepala keluarga baru
 */
export async function addFamilyHead(data: FamilyHeadFormData): Promise<FamilyHeadData> {
  try {
    const keluarga = await prisma.keluargaUmat.create({
      data: {
        namaKepalaKeluarga: data.namaKepalaKeluarga,
        alamat: data.alamat,
        nomorTelepon: data.nomorTelepon || null,
        tanggalBergabung: data.tanggalBergabung,
        jumlahAnakTertanggung: data.jumlahAnakTertanggung,
        jumlahKerabatTertanggung: data.jumlahKerabatTertanggung,
        jumlahAnggotaKeluarga: data.jumlahAnggotaKeluarga,
        status: data.status,
        tanggalKeluar: data.tanggalKeluar || null,
        tanggalMeninggal: data.tanggalMeninggal || null,
        statusPernikahan: StatusPernikahan.TIDAK_MENIKAH, // Default value
      },
    });

    revalidatePath("/kesekretariatan/umat");

    return {
      id: keluarga.id,
      nama: keluarga.namaKepalaKeluarga,
      alamat: keluarga.alamat,
      nomorTelepon: keluarga.nomorTelepon,
      tanggalBergabung: keluarga.tanggalBergabung,
      jumlahAnakTertanggung: keluarga.jumlahAnakTertanggung,
      jumlahKerabatTertanggung: keluarga.jumlahKerabatTertanggung,
      jumlahAnggotaKeluarga: keluarga.jumlahAnggotaKeluarga,
      status: keluarga.status,
      tanggalKeluar: keluarga.tanggalKeluar,
      tanggalMeninggal: keluarga.tanggalMeninggal,
    };
  } catch (error) {
    console.error("Error adding family head:", error);
    throw new Error("Gagal menambahkan data kepala keluarga");
  }
}

/**
 * Mengupdate data kepala keluarga
 */
export async function updateFamilyHead(id: string, data: FamilyHeadFormData): Promise<FamilyHeadData> {
  try {
    const keluarga = await prisma.keluargaUmat.update({
      where: { id },
      data: {
        namaKepalaKeluarga: data.namaKepalaKeluarga,
        alamat: data.alamat,
        nomorTelepon: data.nomorTelepon || null,
        tanggalBergabung: data.tanggalBergabung,
        jumlahAnakTertanggung: data.jumlahAnakTertanggung,
        jumlahKerabatTertanggung: data.jumlahKerabatTertanggung,
        jumlahAnggotaKeluarga: data.jumlahAnggotaKeluarga,
        status: data.status,
        tanggalKeluar: data.tanggalKeluar || null,
        tanggalMeninggal: data.tanggalMeninggal || null,
      },
    });

    revalidatePath("/kesekretariatan/umat");

    return {
      id: keluarga.id,
      nama: keluarga.namaKepalaKeluarga,
      alamat: keluarga.alamat,
      nomorTelepon: keluarga.nomorTelepon,
      tanggalBergabung: keluarga.tanggalBergabung,
      jumlahAnakTertanggung: keluarga.jumlahAnakTertanggung,
      jumlahKerabatTertanggung: keluarga.jumlahKerabatTertanggung,
      jumlahAnggotaKeluarga: keluarga.jumlahAnggotaKeluarga,
      status: keluarga.status,
      tanggalKeluar: keluarga.tanggalKeluar,
      tanggalMeninggal: keluarga.tanggalMeninggal,
    };
  } catch (error) {
    console.error("Error updating family head:", error);
    throw new Error("Gagal mengupdate data kepala keluarga");
  }
}

/**
 * Menandai keluarga sebagai pindah
 */
export async function markFamilyAsMoved(id: string): Promise<void> {
  try {
    const tanggalKeluar = new Date();
    
    await prisma.keluargaUmat.update({
      where: { id },
      data: {
        status: StatusKehidupan.HIDUP, // Tetap hidup, hanya pindah
        tanggalKeluar: tanggalKeluar,
      },
    });

    revalidatePath("/kesekretariatan/umat");
  } catch (error) {
    console.error("Error marking family as moved:", error);
    throw new Error("Gagal menandai keluarga sebagai pindah");
  }
}

/**
 * Menandai keluarga sebagai meninggal
 */
export async function markFamilyAsDeceased(id: string): Promise<void> {
  try {
    const tanggalMeninggal = new Date();
    
    await prisma.keluargaUmat.update({
      where: { id },
      data: {
        status: StatusKehidupan.MENINGGAL,
        tanggalMeninggal: tanggalMeninggal,
      },
    });

    revalidatePath("/kesekretariatan/umat");
  } catch (error) {
    console.error("Error marking family as deceased:", error);
    throw new Error("Gagal menandai keluarga sebagai meninggal");
  }
}

/**
 * Menghapus data kepala keluarga (fisik)
 * Hanya digunakan untuk keadaan khusus
 */
export async function deleteFamilyHead(id: string): Promise<void> {
  try {
    await prisma.keluargaUmat.delete({
      where: { id },
    });

    revalidatePath("/kesekretariatan/umat");
  } catch (error) {
    console.error("Error deleting family head:", error);
    throw new Error("Gagal menghapus data kepala keluarga");
  }
} 