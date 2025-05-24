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
  statusPernikahan: StatusPernikahan;
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
      statusPernikahan: keluarga.statusPernikahan,
      tanggalKeluar: keluarga.tanggalKeluar,
      tanggalMeninggal: keluarga.tanggalMeninggal,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  } catch (error) {
    console.error("Error getting family heads:", error);
    throw new Error("Gagal mengambil data keluarga umat");
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
      statusPernikahan: keluarga.statusPernikahan,
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
      statusPernikahan: keluarga.statusPernikahan,
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
      statusPernikahan: keluarga.statusPernikahan,
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
 * Keluarga yang pindah tidak akan lagi dihitung dalam statistik
 */
export async function markFamilyAsMoved(id: string): Promise<void> {
  try {
    const tanggalKeluar = new Date();
    
    // Ambil data keluarga terlebih dahulu
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id }
    });
    
    if (!keluarga) {
      throw new Error("Keluarga tidak ditemukan");
    }
    
    // Update status keluarga
    await prisma.keluargaUmat.update({
      where: { id },
      data: {
        tanggalKeluar: tanggalKeluar,
        jumlahAnggotaKeluarga: 0 // Set ke 0 karena keluarga pindah tidak dihitung lagi
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
 * Keluarga yang semua anggotanya meninggal tidak akan lagi dihitung dalam statistik
 */
export async function markFamilyAsDeceased(id: string): Promise<void> {
  try {
    const tanggalMeninggal = new Date();
    
    // Ambil data keluarga terlebih dahulu
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id },
      include: {
        pasangan: true,
        tanggungan: true
      }
    });
    
    if (!keluarga) {
      throw new Error("Keluarga tidak ditemukan");
    }
    
    // Jika pasangan ada, tandai juga sebagai meninggal
    if (keluarga.pasangan) {
      await prisma.pasangan.update({
        where: { id: keluarga.pasangan.id },
        data: {
          status: StatusKehidupan.MENINGGAL,
          tanggalMeninggal: tanggalMeninggal
        }
      });
    }
    
    // Tanggungan bisa dihapus atau dibiarkan, karena tidak memengaruhi statistik
    // ketika kepala keluarga meninggal
    
    // Update status kepala keluarga
    await prisma.keluargaUmat.update({
      where: { id },
      data: {
        status: StatusKehidupan.MENINGGAL,
        tanggalMeninggal: tanggalMeninggal,
        jumlahAnggotaKeluarga: 0 // Set ke 0 karena semua anggota keluarga dianggap meninggal
      },
    });

    revalidatePath("/kesekretariatan/umat");
  } catch (error) {
    console.error("Error marking family as deceased:", error);
    throw new Error("Gagal menandai keluarga sebagai meninggal");
  }
}

/**
 * Menandai anggota keluarga tertentu sebagai meninggal
 * Ini tidak mengubah status keluarga secara keseluruhan
 */
export async function markFamilyMemberAsDeceased(id: string, memberName: string): Promise<void> {
  try {
    const tanggalMeninggal = new Date();
    
    // Impor fungsi utilitas
    const { updateJumlahAnggotaKeluarga } = await import('@/app/(dashboard)/dashboard/utils/family-utils');
    
    // Cek apakah memberName adalah kepala keluarga
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id },
      include: {
        pasangan: true,
        tanggungan: true
      }
    });

    if (!keluarga) {
      throw new Error("Keluarga tidak ditemukan");
    }

    if (keluarga.namaKepalaKeluarga === memberName) {
      // Jika kepala keluarga yang meninggal
      await prisma.keluargaUmat.update({
        where: { id },
        data: { 
          status: StatusKehidupan.MENINGGAL,
          tanggalMeninggal: tanggalMeninggal
        }
      });
      
      // Update jumlah anggota keluarga menggunakan fungsi utilitas
      await updateJumlahAnggotaKeluarga(id);
      
      revalidatePath("/kesekretariatan/umat");
      return;
    }
    
    // Cek apakah memberName adalah pasangan
    const pasangan = await prisma.pasangan.findFirst({
      where: { 
        keluargaId: id,
        nama: memberName 
      }
    });

    if (pasangan) {
      // Jika pasangan yang meninggal
      await prisma.pasangan.update({
        where: { id: pasangan.id },
        data: { 
          status: StatusKehidupan.MENINGGAL,
          tanggalMeninggal: tanggalMeninggal
        }
      });
      
      // Update jumlah anggota keluarga menggunakan fungsi utilitas
      await updateJumlahAnggotaKeluarga(id);
      
      revalidatePath("/kesekretariatan/umat");
      return;
    }
    
    // Cek apakah memberName adalah tanggungan (anak atau kerabat)
    const tanggungan = await prisma.tanggungan.findFirst({
      where: { 
        keluargaId: id,
        nama: memberName 
      }
    });

    if (tanggungan) {
      // Hapus tanggungan yang meninggal dari database
      await prisma.tanggungan.delete({
        where: { id: tanggungan.id }
      });
      
      // Update jumlah anak atau kerabat tertanggung
      if (tanggungan.jenisTanggungan === "ANAK") {
        await prisma.keluargaUmat.update({
          where: { id },
          data: {
            jumlahAnakTertanggung: Math.max(0, keluarga.jumlahAnakTertanggung - 1)
          }
        });
      } else {
        await prisma.keluargaUmat.update({
          where: { id },
          data: {
            jumlahKerabatTertanggung: Math.max(0, keluarga.jumlahKerabatTertanggung - 1)
          }
        });
      }
      
      // Update jumlah anggota keluarga menggunakan fungsi utilitas
      await updateJumlahAnggotaKeluarga(id);
    }

    revalidatePath("/kesekretariatan/umat");
  } catch (error) {
    console.error("Error marking family member as deceased:", error);
    throw new Error("Gagal menandai anggota keluarga sebagai meninggal");
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

/**
 * Mendapatkan daftar anggota keluarga berdasarkan ID keluarga
 */
export async function getFamilyMembers(familyId: string): Promise<{id: string, nama: string, jenis: 'KEPALA_KELUARGA' | 'PASANGAN' | 'ANAK' | 'KERABAT'}[]> {
  try {
    // Ambil data keluarga
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id: familyId },
    });

    if (!keluarga) {
      throw new Error('Keluarga tidak ditemukan');
    }

    // Ambil data pasangan jika ada
    const pasangan = await prisma.pasangan.findUnique({
      where: { keluargaId: familyId },
    });

    // Ambil semua tanggungan
    const tanggungan = await prisma.tanggungan.findMany({
      where: { keluargaId: familyId },
    });

    console.log(`Raw data for family ${keluarga.namaKepalaKeluarga}:`, {
      kepalaKeluarga: keluarga.namaKepalaKeluarga,
      pasangan: pasangan ? pasangan.nama : null,
      jumlahAnakTertanggung: keluarga.jumlahAnakTertanggung,
      jumlahKerabatTertanggung: keluarga.jumlahKerabatTertanggung,
      totalTanggungan: tanggungan.length,
      tanggunganAnak: tanggungan.filter(t => t.jenisTanggungan === 'ANAK').length,
      tanggunganKerabat: tanggungan.filter(t => t.jenisTanggungan === 'KERABAT').length,
    });

    // Inisialisasi array untuk menampung hasil
    const familyMembers: {id: string, nama: string, jenis: 'KEPALA_KELUARGA' | 'PASANGAN' | 'ANAK' | 'KERABAT'}[] = [];

    // Tambahkan kepala keluarga
    familyMembers.push({
      id: keluarga.id,
      nama: keluarga.namaKepalaKeluarga,
      jenis: 'KEPALA_KELUARGA'
    });

    // Tambahkan pasangan jika ada
    if (pasangan) {
      familyMembers.push({
        id: pasangan.id,
        nama: pasangan.nama,
        jenis: 'PASANGAN'
      });
    }

    // Tambahkan tanggungan jika ada
    if (tanggungan.length > 0) {
      for (const t of tanggungan) {
        familyMembers.push({
          id: t.id,
          nama: t.nama,
          jenis: t.jenisTanggungan === 'ANAK' ? 'ANAK' : 'KERABAT'
        });
      }
    }

    console.log(`Final family members for ${keluarga.namaKepalaKeluarga}:`, familyMembers);
    return familyMembers;
  } catch (error) {
    console.error("Error getting family members:", error);
    throw new Error("Gagal mendapatkan data anggota keluarga");
  }
}

/**
 * Menambahkan data tanggungan sesuai dengan jumlah yang tercatat di keluarga
 * Digunakan untuk memperbaiki ketidakkonsistenan antara jumlah tanggungan dan data tanggungan yang ada
 */
export async function syncFamilyDependents(familyId: string): Promise<{success: boolean, message: string}> {
  try {
    // Ambil data keluarga
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id: familyId },
    });

    if (!keluarga) {
      return { success: false, message: 'Keluarga tidak ditemukan' };
    }

    // Ambil semua tanggungan yang ada
    const existingTanggungan = await prisma.tanggungan.findMany({
      where: { keluargaId: familyId },
    });

    const existingAnak = existingTanggungan.filter(t => t.jenisTanggungan === 'ANAK').length;
    const existingKerabat = existingTanggungan.filter(t => t.jenisTanggungan === 'KERABAT').length;

    const missingAnak = keluarga.jumlahAnakTertanggung - existingAnak;
    const missingKerabat = keluarga.jumlahKerabatTertanggung - existingKerabat;

    console.log(`Sinkronisasi data untuk keluarga ${keluarga.namaKepalaKeluarga}:`, {
      jumlahAnakTertanggung: keluarga.jumlahAnakTertanggung,
      jumlahKerabatTertanggung: keluarga.jumlahKerabatTertanggung,
      existingAnak,
      existingKerabat,
      missingAnak,
      missingKerabat
    });

    // Jika tidak ada yang perlu ditambahkan
    if (missingAnak <= 0 && missingKerabat <= 0) {
      return { 
        success: true, 
        message: 'Data tanggungan sudah sinkron dengan jumlah yang tercatat' 
      };
    }

    // Tambahkan anak yang hilang
    for (let i = 0; i < missingAnak; i++) {
      await prisma.tanggungan.create({
        data: {
          nama: `Anak ${i+1} dari ${keluarga.namaKepalaKeluarga}`,
          jenisTanggungan: 'ANAK',
          tanggalLahir: new Date(), // Default tanggal hari ini
          pendidikanTerakhir: 'Belum diisi',
          agama: 'KATOLIK', // Default
          statusPernikahan: 'TIDAK_MENIKAH',
          keluargaId: familyId
        }
      });
    }

    // Tambahkan kerabat yang hilang
    for (let i = 0; i < missingKerabat; i++) {
      await prisma.tanggungan.create({
        data: {
          nama: `Kerabat ${i+1} dari ${keluarga.namaKepalaKeluarga}`,
          jenisTanggungan: 'KERABAT',
          tanggalLahir: new Date(), // Default tanggal hari ini
          pendidikanTerakhir: 'Belum diisi',
          agama: 'KATOLIK', // Default
          statusPernikahan: 'TIDAK_MENIKAH',
          keluargaId: familyId
        }
      });
    }

    revalidatePath("/kesekretariatan/umat");
    return { 
      success: true, 
      message: `Berhasil menambahkan ${missingAnak} anak dan ${missingKerabat} kerabat yang hilang` 
    };
  } catch (error) {
    console.error("Error syncing family dependents:", error);
    return { 
      success: false, 
      message: "Gagal menyinkronkan data tanggungan" 
    };
  }
} 