"use server";

import { prisma } from "@/lib/db";
import { IkataFormValues } from "../types";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Fungsi untuk mendapatkan data IKATA berdasarkan keluargaId
export async function getIkataByKeluargaId(keluargaId: string) {
  try {
    const ikata = await prisma.iuranIkata.findMany({
      where: {
        keluargaId,
      },
      orderBy: {
        tahun: "desc",
      },
      include: {
        keluarga: {
          select: {
            namaKepalaKeluarga: true,
          },
        },
      },
    });

    return ikata.map((item) => ({
      ...item,
      namaKepalaKeluarga: item.keluarga.namaKepalaKeluarga,
    }));
  } catch (error) {
    console.error("Error loading IKATA data:", error);
    throw new Error("Gagal memuat data IKATA");
  }
}

// Fungsi untuk mendapatkan semua data IKATA (untuk SuperUser)
export async function getAllIkata() {
  try {
    const ikata = await prisma.iuranIkata.findMany({
      orderBy: {
        tahun: "desc",
      },
      include: {
        keluarga: {
          select: {
            namaKepalaKeluarga: true,
          },
        },
      },
    });

    return ikata.map((item) => ({
      ...item,
      namaKepalaKeluarga: item.keluarga.namaKepalaKeluarga,
    }));
  } catch (error) {
    console.error("Error loading IKATA data:", error);
    throw new Error("Gagal memuat data IKATA");
  }
}

// Fungsi untuk menambah data IKATA baru
export async function createIkata(data: IkataFormValues) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Anda harus login untuk melakukan tindakan ini");
    }

    const newIkata = await prisma.iuranIkata.create({
      data: {
        keluargaId: data.keluargaId,
        status: data.status,
        bulanAwal: data.bulanAwal,
        bulanAkhir: data.bulanAkhir,
        tahun: data.tahun,
        jumlahDibayar: data.jumlahDibayar,
      },
    });

    revalidatePath("/histori-pembayaran");
    return { success: true, data: newIkata };
  } catch (error) {
    console.error("Error creating IKATA:", error);
    throw new Error("Gagal menyimpan data IKATA");
  }
}

// Fungsi untuk mengupdate data IKATA
export async function updateIkata(id: string, data: Partial<IkataFormValues>) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Anda harus login untuk melakukan tindakan ini");
    }

    const updatedIkata = await prisma.iuranIkata.update({
      where: {
        id,
      },
      data,
    });

    revalidatePath("/histori-pembayaran");
    return { success: true, data: updatedIkata };
  } catch (error) {
    console.error("Error updating IKATA:", error);
    throw new Error("Gagal memperbarui data IKATA");
  }
}

// Fungsi untuk menghapus data IKATA
export async function deleteIkata(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Anda harus login untuk melakukan tindakan ini");
    }

    await prisma.iuranIkata.delete({
      where: {
        id,
      },
    });

    revalidatePath("/histori-pembayaran");
    return { success: true };
  } catch (error) {
    console.error("Error deleting IKATA:", error);
    throw new Error("Gagal menghapus data IKATA");
  }
}

// Fungsi untuk mendapatkan tahun-tahun yang ada di data IKATA
export async function getUniqueIkataYears() {
  try {
    const years = await prisma.iuranIkata.findMany({
      select: {
        tahun: true,
      },
      distinct: ["tahun"],
      orderBy: {
        tahun: "desc",
      },
    });

    return years.map((item) => item.tahun);
  } catch (error) {
    console.error("Error getting unique IKATA years:", error);
    throw new Error("Gagal mendapatkan data tahun IKATA");
  }
}

// Fungsi untuk mendapatkan total pembayaran IKATA berdasarkan tahun
export async function getTotalIkataByYear(year: number) {
  try {
    // Jika year adalah 0, ambil semua tahun
    const whereClause = year === 0 
      ? { status: "LUNAS" as const } 
      : { tahun: year, status: "LUNAS" as const };
    
    const result = await prisma.iuranIkata.aggregate({
      where: whereClause,
      _sum: {
        jumlahDibayar: true,
      },
      _count: true,
    });

    return {
      total: result._sum?.jumlahDibayar || 0,
      count: result._count,
    };
  } catch (error) {
    console.error("Error getting IKATA total:", error);
    throw new Error("Gagal mendapatkan total IKATA");
  }
}

// Fungsi untuk mendapatkan data keluarga umat
export async function getKeluargaOptions() {
  try {
    const keluarga = await prisma.keluargaUmat.findMany({
      select: {
        id: true,
        namaKepalaKeluarga: true,
      },
      orderBy: {
        namaKepalaKeluarga: "asc",
      },
    });

    return keluarga;
  } catch (error) {
    console.error("Error loading family data:", error);
    throw new Error("Gagal memuat data keluarga");
  }
} 