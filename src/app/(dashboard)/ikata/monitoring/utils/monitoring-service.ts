'use server';

import { prisma } from "@/lib/db";
import { Role, StatusIuran } from "@prisma/client";
import { DelinquentPayment } from "../types";

// Fungsi untuk mendapatkan data penunggak iuran IKATA
export async function getDelinquentPayments(year?: number): Promise<DelinquentPayment[]> {
  try {
    // Gunakan tahun saat ini jika tidak ada yang diberikan
    const currentYear = year || new Date().getFullYear();
    
    // Ambil data iuran yang belum lunas atau sebagian bulan
    const delinquentPayments = await prisma.iuranIkata.findMany({
      where: {
        tahun: currentYear,
        OR: [
          { status: StatusIuran.BELUM_BAYAR },
          { status: StatusIuran.SEBAGIAN_BULAN }
        ]
      },
      include: {
        keluarga: true
      },
      orderBy: {
        keluarga: {
          namaKepalaKeluarga: 'asc'
        }
      }
    });
    
    return delinquentPayments.map(payment => {
      // Hitung periode tunggakan berdasarkan status
      let periodeAwal = payment.status === StatusIuran.SEBAGIAN_BULAN 
        ? `${currentYear}-${payment.bulanAkhir ? (payment.bulanAkhir + 1).toString().padStart(2, '0') : '01'}`
        : `${currentYear}-01`;
      
      const periodeAkhir = `${currentYear}-12`;
      
      // Hitung jumlah tunggakan (asumsi iuran 10.000 per bulan)
      // Jika sebagian bulan, hitung berdasarkan bulan yang belum dibayar
      // Jika belum bayar sama sekali, hitung untuk 12 bulan
      const jumlahBulanTunggakan = payment.status === StatusIuran.SEBAGIAN_BULAN
        ? 12 - (payment.bulanAkhir || 0)
        : 12;
      
      const jumlahTunggakan = jumlahBulanTunggakan * 10000;
      
      // Format status untuk front-end (dengan tipe yang eksplisit)
      const statusFormatted = payment.status === StatusIuran.BELUM_BAYAR 
        ? 'belum_lunas' as const 
        : 'sebagian_bulan' as const;
      
      return {
        id: payment.id,
        kepalaKeluarga: payment.keluarga.namaKepalaKeluarga,
        keluargaId: payment.keluargaId,
        periodeAwal,
        periodeAkhir,
        jumlahTunggakan,
        status: statusFormatted,
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt.toISOString()
      };
    });
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
export async function setIuranIkata(keluargaId: string, tahun: number, jumlahDibayar: number, status: StatusIuran) {
  try {
    // Cek apakah data iuran sudah ada
    const existingIuran = await prisma.iuranIkata.findFirst({
      where: {
        keluargaId,
        tahun
      }
    });
    
    if (existingIuran) {
      // Update data iuran yang ada
      return await prisma.iuranIkata.update({
        where: {
          id: existingIuran.id
        },
        data: {
          status,
          jumlahDibayar
        }
      });
    } else {
      // Buat data iuran baru
      return await prisma.iuranIkata.create({
        data: {
          keluargaId,
          tahun,
          status,
          jumlahDibayar
        }
      });
    }
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