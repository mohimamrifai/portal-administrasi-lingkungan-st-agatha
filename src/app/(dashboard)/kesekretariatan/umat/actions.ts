"use server";

import { prisma } from "@/lib/db";
import { StatusKehidupan, StatusPernikahan } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { FamilyHeadData, FamilyHeadFormData, FamilyHeadWithDetails } from "./types";
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
    // Gunakan transaction untuk memastikan konsistensi data
    const result = await prisma.$transaction(async (prisma) => {
      // Buat record kepala keluarga terlebih dahulu
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
          statusPernikahan: data.statusPernikahan,
          tanggalKeluar: data.tanggalKeluar || null,
          tanggalMeninggal: data.tanggalMeninggal || null,
        },
      });

      // Jika status pernikahan adalah MENIKAH, buat record pasangan
      if (data.statusPernikahan === StatusPernikahan.MENIKAH) {
        await prisma.pasangan.create({
          data: {
            nama: `Pasangan dari ${data.namaKepalaKeluarga}`,
            tempatLahir: 'Belum diisi',
            tanggalLahir: new Date(), // Default tanggal hari ini, bisa diubah nanti
            pendidikanTerakhir: 'Belum diisi',
            agama: 'KATOLIK', // Default
            status: StatusKehidupan.HIDUP,
            keluargaId: keluarga.id,
          },
        });
      }

      return keluarga;
    });

    revalidatePath("/kesekretariatan/umat");

    return {
      id: result.id,
      nama: result.namaKepalaKeluarga,
      alamat: result.alamat,
      nomorTelepon: result.nomorTelepon,
      tanggalBergabung: result.tanggalBergabung,
      jumlahAnakTertanggung: result.jumlahAnakTertanggung,
      jumlahKerabatTertanggung: result.jumlahKerabatTertanggung,
      jumlahAnggotaKeluarga: result.jumlahAnggotaKeluarga,
      status: result.status,
      statusPernikahan: result.statusPernikahan,
      tanggalKeluar: result.tanggalKeluar,
      tanggalMeninggal: result.tanggalMeninggal,
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
    // Gunakan transaction dengan timeout yang lebih lama (10 detik)
    const result = await prisma.$transaction(async (prisma) => {
      // Ambil data keluarga yang ada untuk mengetahui status pernikahan sebelumnya
      const existingKeluarga = await prisma.keluargaUmat.findUnique({
        where: { id },
        include: { pasangan: true }
      });

      if (!existingKeluarga) {
        throw new Error("Data keluarga tidak ditemukan");
      }

      // Update data kepala keluarga
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
          statusPernikahan: data.statusPernikahan,
          tanggalKeluar: data.tanggalKeluar || null,
          tanggalMeninggal: data.tanggalMeninggal || null,
        },
      });

      // Handle perubahan status pernikahan
      if (existingKeluarga.statusPernikahan !== data.statusPernikahan) {
        try {
          if (data.statusPernikahan === StatusPernikahan.MENIKAH && !existingKeluarga.pasangan) {
            // Buat record pasangan baru jika status berubah menjadi MENIKAH
            await prisma.pasangan.create({
              data: {
                nama: `Pasangan dari ${data.namaKepalaKeluarga}`,
                tempatLahir: 'Belum diisi',
                tanggalLahir: new Date(),
                pendidikanTerakhir: 'Belum diisi',
                agama: 'KATOLIK',
                status: StatusKehidupan.HIDUP,
                keluargaId: keluarga.id,
              },
            });
          } else if ((data.statusPernikahan === StatusPernikahan.TIDAK_MENIKAH ||
                     data.statusPernikahan === StatusPernikahan.CERAI_HIDUP ||
                     data.statusPernikahan === StatusPernikahan.CERAI_MATI) && 
                     existingKeluarga.pasangan) {
            // Hapus record pasangan jika status berubah menjadi TIDAK_MENIKAH, CERAI_HIDUP, atau CERAI_MATI
            await prisma.pasangan.delete({
              where: { keluargaId: keluarga.id }
            });
          }
        } catch (error) {
          console.error("Error handling marital status change:", error);
          throw new Error("Gagal memproses perubahan status pernikahan");
        }
      }

      return keluarga;
    }, {
      timeout: 10000 // Set timeout menjadi 10 detik
    });

    // Hitung ulang jumlah anggota keluarga di luar transaksi
    const { updateJumlahAnggotaKeluarga } = await import('@/app/(dashboard)/dashboard/utils/family-utils');
    await updateJumlahAnggotaKeluarga(result.id);

    revalidatePath("/kesekretariatan/umat");

    return {
      id: result.id,
      nama: result.namaKepalaKeluarga,
      alamat: result.alamat,
      nomorTelepon: result.nomorTelepon,
      tanggalBergabung: result.tanggalBergabung,
      jumlahAnakTertanggung: result.jumlahAnakTertanggung,
      jumlahKerabatTertanggung: result.jumlahKerabatTertanggung,
      jumlahAnggotaKeluarga: result.jumlahAnggotaKeluarga,
      status: result.status,
      statusPernikahan: result.statusPernikahan,
      tanggalKeluar: result.tanggalKeluar,
      tanggalMeninggal: result.tanggalMeninggal,
    };
  } catch (error) {
    console.error("Error updating family head:", error);
    if (error instanceof Error) {
      throw new Error(`Gagal mengupdate data kepala keluarga: ${error.message}`);
    } else {
      throw new Error("Gagal mengupdate data kepala keluarga");
    }
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
      // Tandai tanggungan sebagai meninggal (jangan dihapus)
      await prisma.tanggungan.update({
        where: { id: tanggungan.id },
        data: {
          status: StatusKehidupan.MENINGGAL,
          tanggalMeninggal: tanggalMeninggal
        }
      });
      
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
    return familyMembers;
  } catch (error) {
    console.error("Error getting family members:", error);
    throw new Error("Gagal mendapatkan data anggota keluarga");
  }
}

/**
 * Sinkronisasi data tanggungan (tanpa revalidatePath untuk digunakan dalam rendering)
 */
async function syncFamilyDependentsInternal(familyId: string): Promise<{success: boolean, message: string}> {
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

/**
 * Sinkronisasi data tanggungan (dengan revalidatePath untuk server actions)
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

// Fungsi untuk menghitung jumlah jiwa aktual
function calculateActualMemberCount(familyHead: any) {
  let count = 0;
  
  // Hitung kepala keluarga jika masih hidup
  if (familyHead.status === 'HIDUP') {
    count += 1;
  }
  
  // Hitung pasangan jika ada dan masih hidup
  if (familyHead.pasangan && familyHead.pasangan.status === 'HIDUP') {
    count += 1;
  }
  
  // Hitung tanggungan yang masih hidup
  if (familyHead.tanggungan) {
    count += familyHead.tanggungan.filter((t: any) => t.status === 'HIDUP').length;
  }
  
  return count;
}

// Fungsi untuk menghitung jumlah jiwa yang masih hidup
function calculateLivingMemberCount(familyHead: any) {
  return calculateActualMemberCount(familyHead);
}

// Fungsi untuk menghitung jumlah jiwa yang meninggal
function calculateDeceasedMemberCount(familyHead: any) {
  let count = 0;
  
  // Hitung kepala keluarga jika meninggal
  if (familyHead.status === 'MENINGGAL') {
    count += 1;
  }
  
  // Hitung pasangan jika ada dan meninggal
  if (familyHead.pasangan && familyHead.pasangan.status === 'MENINGGAL') {
    count += 1;
  }
  
  // Hitung tanggungan yang meninggal
  if (familyHead.tanggungan) {
    count += familyHead.tanggungan.filter((t: any) => t.status === 'MENINGGAL').length;
  }
  
  return count;
}

/**
 * Mengambil semua data kepala keluarga dengan detail tanggungan
 */
export async function getAllFamilyHeadsWithDetails(): Promise<FamilyHeadWithDetails[]> {
  try {
    const keluargaUmat = await prisma.keluargaUmat.findMany({
      include: {
        pasangan: true,
        tanggungan: true,
      },
      orderBy: {
        namaKepalaKeluarga: 'asc',
      },
    });

    const processedKeluarga = await Promise.all(keluargaUmat.map(async (keluarga) => {
      // Cek apakah jumlah tanggungan sesuai dengan yang tercatat
      const existingAnak = keluarga.tanggungan.filter(t => t.jenisTanggungan === 'ANAK').length;
      const existingKerabat = keluarga.tanggungan.filter(t => t.jenisTanggungan === 'KERABAT').length;
      
      const missingAnak = keluarga.jumlahAnakTertanggung - existingAnak;
      const missingKerabat = keluarga.jumlahKerabatTertanggung - existingKerabat;

      // Jika ada tanggungan yang belum tercatat, lakukan sinkronisasi
      if (missingAnak > 0 || missingKerabat > 0) {
        try {
          await syncFamilyDependentsInternal(keluarga.id);
          // Ambil data terbaru setelah sinkronisasi
          const updatedKeluarga = await prisma.keluargaUmat.findUnique({
            where: { id: keluarga.id },
            include: {
              pasangan: true,
              tanggungan: true,
            },
          });
          if (updatedKeluarga) {
            keluarga = updatedKeluarga;
          }
        } catch (error) {
          console.error(`Failed to sync dependents for family ${keluarga.id}:`, error);
        }
      }

      // Hitung jumlah anggota
      let livingMemberCount = 0;
      let deceasedMemberCount = 0;

      // Hitung kepala keluarga
      if (keluarga.status === 'HIDUP') {
        livingMemberCount += 1;
      } else if (keluarga.status === 'MENINGGAL') {
        deceasedMemberCount += 1;
      }

      // Hitung pasangan
      if (keluarga.pasangan) {
        if (keluarga.pasangan.status === 'HIDUP') {
          livingMemberCount += 1;
        } else if (keluarga.pasangan.status === 'MENINGGAL') {
          deceasedMemberCount += 1;
        }
      }

      // Hitung tanggungan
      keluarga.tanggungan.forEach(tanggungan => {
        if (tanggungan.status === 'HIDUP') {
          livingMemberCount += 1;
        } else if (tanggungan.status === 'MENINGGAL') {
          deceasedMemberCount += 1;
        }
      });

      // Hitung total anggota
      const actualMemberCount = livingMemberCount + deceasedMemberCount;

      return {
        id: keluarga.id,
        nama: keluarga.namaKepalaKeluarga,
        alamat: keluarga.alamat,
        nomorTelepon: keluarga.nomorTelepon,
        tanggalBergabung: keluarga.tanggalBergabung,
        jumlahAnakTertanggung: keluarga.jumlahAnakTertanggung,
        jumlahKerabatTertanggung: keluarga.jumlahKerabatTertanggung,
        jumlahAnggotaKeluarga: actualMemberCount,
        status: keluarga.status,
        statusPernikahan: keluarga.statusPernikahan,
        tanggalKeluar: keluarga.tanggalKeluar,
        tanggalMeninggal: keluarga.tanggalMeninggal,
        pasangan: keluarga.pasangan ? {
          id: keluarga.pasangan.id,
          nama: keluarga.pasangan.nama,
          status: keluarga.pasangan.status,
        } : null,
        tanggungan: keluarga.tanggungan.map(t => ({
          id: t.id,
          nama: t.nama,
          jenisTanggungan: t.jenisTanggungan,
          status: t.status,
          tanggalLahir: t.tanggalLahir,
          pendidikanTerakhir: t.pendidikanTerakhir,
          agama: t.agama,
          statusPernikahan: t.statusPernikahan,
          tanggalBaptis: t.tanggalBaptis || null,
          tanggalKrisma: t.tanggalKrisma || null,
          tanggalMeninggal: t.tanggalMeninggal || null
        })),
        actualMemberCount,
        livingMemberCount,
        deceasedMemberCount
      };
    }));

    return processedKeluarga;
  } catch (error) {
    console.error("Error getting family heads with details:", error);
    throw new Error("Gagal mengambil data keluarga umat dengan detail");
  }
} 