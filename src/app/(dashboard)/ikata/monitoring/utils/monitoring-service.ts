'use server';

import { prisma } from "@/lib/db";
import { JenisTransaksi, StatusIuran, TipeTransaksiIkata } from "@prisma/client";
import { DelinquentPayment } from "../types";
import { revalidatePath } from "next/cache";

// Fungsi untuk mendapatkan data penunggak iuran IKATA
export async function getDelinquentPayments(year?: number): Promise<DelinquentPayment[]> {
  try {
    // Gunakan tahun saat ini jika tidak ada yang diberikan
    const currentYear = year || new Date().getFullYear();
    
    // Ambil semua keluarga yang terdaftar
    const allFamilies = await prisma.keluargaUmat.findMany({
      where: {
        tanggalKeluar: null // Hanya keluarga yang masih aktif
      },
      select: {
        id: true,
        namaKepalaKeluarga: true,
        nomorTelepon: true,
        alamat: true,
        iurataIkata: {
          where: {
            tahun: currentYear
          }
        }
      }
    });
    
    const delinquentPayments: DelinquentPayment[] = [];
    
    // Loop melalui semua keluarga
    for (const family of allFamilies) {
      const iuranRecord = family.iurataIkata[0];
      
      // Jika tidak ada record iuran atau statusnya BELUM_BAYAR atau SEBAGIAN_BULAN
      if (!iuranRecord || iuranRecord.status !== StatusIuran.LUNAS) {
        let status: 'belum_lunas' | 'sebagian_bulan' = 'belum_lunas';
        let bulanAwal = 1;
        
        if (iuranRecord && iuranRecord.status === StatusIuran.SEBAGIAN_BULAN && iuranRecord.bulanAkhir) {
          status = 'sebagian_bulan';
          bulanAwal = iuranRecord.bulanAkhir + 1;
        }
        
        // Hitung periode tunggakan
        const periodeAwal = `${currentYear}-${bulanAwal.toString().padStart(2, '0')}`;
        const periodeAkhir = `${currentYear}-12`;
        
        // Hitung jumlah tunggakan berdasarkan total iuran per bulan
        const bulanPerTahun = 12;
        const iuranPerBulan = (iuranRecord?.totalIuran || 120000) / bulanPerTahun;
        const jumlahBulanTunggakan = 13 - bulanAwal;
        const jumlahTunggakan = jumlahBulanTunggakan * iuranPerBulan;
        
        delinquentPayments.push({
          id: iuranRecord?.id || `temp-${family.id}`,
          kepalaKeluarga: family.namaKepalaKeluarga,
          keluargaId: family.id,
          periodeAwal,
          periodeAkhir,
          jumlahTunggakan,
          status,
          totalIuran: iuranRecord?.totalIuran || 120000,
          createdAt: iuranRecord?.createdAt.toISOString() || new Date().toISOString(),
          updatedAt: iuranRecord?.updatedAt.toISOString() || new Date().toISOString()
        });
      }
    }
    
    return delinquentPayments;
  } catch (error) {
    console.error("Error fetching delinquent payments:", error);
    throw new Error("Gagal mengambil data penunggak iuran IKATA");
  }
}

// Fungsi untuk mengirim notifikasi kepada penunggak iuran
export async function sendNotificationToDelinquents(delinquentIds: string[], message: string) {
  try {
    // Ambil data penunggak untuk mendapatkan user IDs
    const delinquents = await prisma.iuranIkata.findMany({
      where: {
        id: { in: delinquentIds }
      },
      include: {
        keluarga: {
          include: {
            users: true
          }
        }
      }
    });
    
    // Array untuk menyimpan operasi bulk create notifikasi
    const notificationData = [];
    
    // Persiapkan data notifikasi untuk setiap user yang terkait dengan keluarga penunggak
    for (const delinquent of delinquents) {
      const users = delinquent.keluarga.users;
      
      for (const user of users) {
        notificationData.push({
          pesan: message || `Mohon segera melunasi iuran IKATA untuk tahun ${delinquent.tahun}.`,
          userId: user.id,
          dibaca: false
        });
      }
    }
    
    // Buat notifikasi secara bulk jika ada data
    if (notificationData.length > 0) {
      await prisma.notification.createMany({
        data: notificationData
      });
    }
    
    return { 
      success: true, 
      count: notificationData.length, 
      message: `${notificationData.length} notifikasi berhasil dikirim.` 
    };
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw new Error("Gagal mengirim notifikasi");
  }
}

// Fungsi untuk mengatur nilai iuran IKATA
export async function setIuranIkata(
  keluargaId: string, 
  tahun: number, 
  jumlahDibayar: number, 
  status: StatusIuran, 
  bulanAkhir?: number,
  totalIuran: number = 120000
) {
  try {
    // Cek apakah data iuran sudah ada
    const existingIuran = await prisma.iuranIkata.findFirst({
      where: {
        keluargaId,
        tahun
      }
    });
    
    // Tanggal saat ini untuk transaksi
    const tanggalTransaksi = new Date();
    
    // Buat atau update data iuran
    let updatedIuran;
    
    // Data yang akan diupdate/dibuat
    const iuranData = {
      status,
      jumlahDibayar,
      totalIuran,
      ...(status === StatusIuran.SEBAGIAN_BULAN && bulanAkhir ? { bulanAkhir } : {})
    };
    
    if (existingIuran) {
      // Update data iuran yang ada
      updatedIuran = await prisma.iuranIkata.update({
        where: {
          id: existingIuran.id
        },
        data: iuranData
      });
    } else {
      // Buat data iuran baru
      updatedIuran = await prisma.iuranIkata.create({
        data: {
          keluargaId,
          tahun,
          ...iuranData
        }
      });
    }
    
    // Dapatkan nama kepala keluarga
    const keluarga = await prisma.keluargaUmat.findUnique({
      where: { id: keluargaId },
      select: { namaKepalaKeluarga: true }
    });
    
    // Catat transaksi di KasIkata
    await prisma.kasIkata.create({
      data: {
        tanggal: tanggalTransaksi,
        jenisTranasksi: JenisTransaksi.UANG_MASUK,
        tipeTransaksi: TipeTransaksiIkata.IURAN_ANGGOTA,
        keterangan: `Pembayaran iuran IKATA tahun ${tahun} - ${keluarga?.namaKepalaKeluarga || 'Anggota'}`,
        debit: jumlahDibayar,
        kredit: 0
      }
    });
    
    // Revalidasi jalur untuk memperbarui UI
    revalidatePath('/ikata/monitoring');
    revalidatePath('/ikata/kas');
    
    return updatedIuran;
  } catch (error) {
    console.error("Error setting iuran IKATA:", error);
    throw new Error("Gagal mengatur nilai iuran IKATA");
  }
}

// Fungsi untuk mendapatkan pengaturan nilai iuran IKATA
export async function getIuranSetting() {
  try {
    // Di sini bisa diimplementasikan untuk mendapatkan pengaturan nilai iuran IKATA dari database
    // Misalnya dari tabel konfigurasi
    // Untuk saat ini, kita kembalikan nilai default
    return {
      bulanan: 10000,
      tahunan: 120000
    };
  } catch (error) {
    console.error("Error getting iuran setting:", error);
    throw new Error("Gagal mendapatkan pengaturan nilai iuran IKATA");
  }
} 