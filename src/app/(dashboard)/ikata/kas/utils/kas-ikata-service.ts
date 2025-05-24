'use server';

import { prisma } from "@/lib/db";
import { JenisTransaksi, TipeTransaksiIkata } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Fungsi untuk mendapatkan data transaksi Kas IKATA
export async function getKasIkataTransactions(bulan?: number, tahun?: number) {
  try {
    // Gunakan bulan dan tahun saat ini jika tidak diberikan
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Januari = 1
    const currentYear = currentDate.getFullYear();
    
    // Gunakan parameter input jika diberikan, atau default ke bulan dan tahun saat ini
    const month = bulan || currentMonth;
    const year = tahun || currentYear;
    
    // Filter berdasarkan bulan dan tahun
    const dateStart = new Date(year, month - 1, 1);
    const dateEnd = new Date(year, month, 0, 23, 59, 59);

    // Query untuk mendapatkan transaksi
    const transactionQuery = {
      where: { 
        tanggal: {
          gte: dateStart,
          lte: dateEnd
        } 
      },
      orderBy: {
        tanggal: 'desc' as const
      }
    };
    
    const transactions = await prisma.kasIkata.findMany(transactionQuery);
    
    return transactions;
  } catch (error) {
    throw new Error("Gagal mengambil data transaksi kas IKATA");
  }
}

// Fungsi untuk mendapatkan ringkasan Kas IKATA
export async function getKasIkataSummary(bulan?: number, tahun?: number) {
  try {
    // Gunakan bulan dan tahun saat ini jika tidak diberikan
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Januari = 1
    const currentYear = currentDate.getFullYear();
    
    // Gunakan parameter input jika diberikan, atau default ke bulan dan tahun saat ini
    const month = bulan || currentMonth;
    const year = tahun || currentYear;
    
    // Filter berdasarkan bulan dan tahun
    const dateStart = new Date(year, month - 1, 1);
    const dateEnd = new Date(year, month, 0, 23, 59, 59);

    // Dapatkan saldo awal dari transaksi SALDO AWAL
    const saldoAwalTransaction = await prisma.kasIkata.findFirst({
      where: {
        tipeTransaksi: TipeTransaksiIkata.LAIN_LAIN,
        keterangan: "SALDO AWAL"
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    const saldoAwal = saldoAwalTransaction ? saldoAwalTransaction.debit : 0;
    
    // Query untuk transaksi pada bulan yang dipilih
    const transactionQuery = {
      where: {
        tanggal: {
          gte: dateStart,
          lte: dateEnd,
        },
        keterangan: {
          not: "SALDO AWAL" // Jangan hitung transaksi saldo awal
        }
      }
    };
    
    // Dapatkan semua transaksi untuk bulan ini
    const transactions = await prisma.kasIkata.findMany({
      where: transactionQuery.where,
      select: {
        id: true,
        tanggal: true,
        jenisTranasksi: true,
        debit: true,
        kredit: true
      }
    });
    
    // Hitung pemasukan dan pengeluaran
    const pemasukanTxs = transactions.filter(tx => tx.jenisTranasksi === "UANG_MASUK");
    const pengeluaranTxs = transactions.filter(tx => tx.jenisTranasksi === "UANG_KELUAR");
    
    const pemasukan = pemasukanTxs.reduce((sum, tx) => sum + tx.debit, 0);
    const pengeluaran = pengeluaranTxs.reduce((sum, tx) => sum + tx.kredit, 0);
    
    // Hitung saldo akhir
    const saldoAkhir = saldoAwal + pemasukan - pengeluaran;
    
    const result = {
      saldoAwal,
      pemasukan,
      pengeluaran,
      saldoAkhir
    };
    
    return result;
  } catch (error) {
    throw new Error("Gagal menghitung ringkasan kas IKATA");
  }
}

// Fungsi untuk mendapatkan data keluarga umat (untuk dropdown)
export async function getKeluargaUmatList() {
  try {
    const keluarga = await prisma.keluargaUmat.findMany({
      select: {
        id: true,
        namaKepalaKeluarga: true
      },
      orderBy: {
        namaKepalaKeluarga: 'asc'
      }
    });
    
    return keluarga;
  } catch (error) {
    console.error("Error fetching keluarga umat list:", error);
    throw new Error("Gagal mengambil data keluarga umat");
  }
}

// Fungsi untuk membuat transaksi Kas IKATA baru
export async function createKasIkataTransaction(data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiIkata;
  keterangan?: string;
  debit: number;
  kredit: number;
  keluargaId?: string;
}) {
  try {
    // Pastikan tanggal valid dengan membuat objek Date baru
    const validDate = new Date(data.tanggal);
    
    const transaction = await prisma.kasIkata.create({
      data: {
        ...data,
        tanggal: validDate
      }
    });
    
    // Jika transaksinya adalah iuran anggota, perbarui atau buat record IuranIkata
    if (data.tipeTransaksi === TipeTransaksiIkata.IURAN_ANGGOTA && 
        data.jenisTranasksi === JenisTransaksi.UANG_MASUK && 
        data.keluargaId) {
      
      const tahun = validDate.getFullYear();
      const bulan = validDate.getMonth() + 1;
      
      // Update atau buat record IuranIkata
      await prisma.iuranIkata.upsert({
        where: {
          id: await getIuranIkataId(data.keluargaId, tahun)
        },
        update: {
          status: "LUNAS",
          jumlahDibayar: data.debit
        },
        create: {
          keluargaId: data.keluargaId,
          status: "LUNAS",
          tahun: tahun,
          jumlahDibayar: data.debit
        }
      });
    }
    
    // Revalidasi path agar UI diperbarui
    revalidatePath('/ikata/kas');
    
    return transaction;
  } catch (error) {
    throw new Error("Gagal membuat transaksi kas IKATA");
  }
}

// Fungsi untuk memperbarui transaksi Kas IKATA
export async function updateKasIkataTransaction(id: string, data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiIkata;
  keterangan?: string;
  debit: number;
  kredit: number;
  keluargaId?: string;
}) {
  try {
    // Pastikan tanggal valid
    const validDate = new Date(data.tanggal);
    
    const transaction = await prisma.kasIkata.update({
      where: { id },
      data: {
        ...data,
        tanggal: validDate
      }
    });
    
    // Jika transaksinya adalah iuran anggota, update record IuranIkata
    if (data.tipeTransaksi === TipeTransaksiIkata.IURAN_ANGGOTA && 
        data.jenisTranasksi === JenisTransaksi.UANG_MASUK && 
        data.keluargaId) {
      
      const tahun = validDate.getFullYear();
      
      // Update record IuranIkata
      await prisma.iuranIkata.updateMany({
        where: {
          keluargaId: data.keluargaId,
          tahun: tahun
        },
        data: {
          status: "LUNAS",
          jumlahDibayar: data.debit
        }
      });
    }
    
    // Revalidasi path agar UI diperbarui
    revalidatePath('/ikata/kas');
    
    return transaction;
  } catch (error) {
    throw new Error("Gagal memperbarui transaksi kas IKATA");
  }
}

// Fungsi untuk menghapus transaksi Kas IKATA
export async function deleteKasIkataTransaction(id: string) {
  try {
    const transaction = await prisma.kasIkata.delete({
      where: { id }
    });
    
    // Revalidasi path agar UI diperbarui
    revalidatePath('/ikata/kas');
    
    return transaction;
  } catch (error) {
    throw new Error("Gagal menghapus transaksi kas IKATA");
  }
}

// Fungsi helper untuk mendapatkan id IuranIkata berdasarkan keluargaId dan tahun
async function getIuranIkataId(keluargaId: string, tahun: number): Promise<string> {
  const iuran = await prisma.iuranIkata.findFirst({
    where: {
      keluargaId,
      tahun
    },
    select: {
      id: true
    }
  });
  
  return iuran?.id || '';
}

// Fungsi untuk mengunci transaksi (set locked = true)
export async function lockKasIkataTransactions(transactionIds: string[]) {
  try {
    const result = await prisma.$transaction(
      transactionIds.map(id => 
        prisma.kasIkata.update({
          where: { id },
          data: { locked: true }
        })
      )
    );

    // Revalidasi path agar UI diperbarui
    revalidatePath('/ikata/kas');

    return { count: result.length };
  } catch (error) {
    throw new Error("Gagal mengunci transaksi");
  }
}

// Fungsi untuk mengambil saldo awal untuk periode tertentu
export async function getSaldoAwalIkata(bulan: number, tahun: number) {
  try {
    const saldoAwal = await prisma.saldoAwalIkata.findFirst({
      where: {
        tahun,
        bulan
      }
    });
    
    return saldoAwal;
  } catch (error) {
    console.error("Error fetching saldo awal IKATA:", error);
    throw new Error("Gagal mengambil data saldo awal IKATA");
  }
}

// Fungsi untuk menyimpan saldo awal IKATA
export async function setSaldoAwalIkata(saldoAwal: number) {
  try {
    // Cari konfigurasi saldo awal jika sudah ada
    const existingConfig = await prisma.kasIkata.findFirst({
      where: {
        tipeTransaksi: TipeTransaksiIkata.LAIN_LAIN,
        keterangan: "SALDO AWAL"
      }
    });

    let result;
    
    // Jika sudah ada, update nilai
    if (existingConfig) {
      result = await prisma.kasIkata.update({
        where: { id: existingConfig.id },
        data: {
          debit: saldoAwal,
          kredit: 0,
          tanggal: new Date(),
          updatedAt: new Date()
        }
      });
    } else {
      // Jika belum ada, buat baru
      result = await prisma.kasIkata.create({
        data: {
          tanggal: new Date(),
          jenisTranasksi: JenisTransaksi.UANG_MASUK,
          tipeTransaksi: TipeTransaksiIkata.LAIN_LAIN,
          keterangan: "SALDO AWAL",
          debit: saldoAwal,
          kredit: 0,
          locked: true
        }
      });
    }
    
    // Hapus data dari tabel saldoAwalIkata jika ada (untuk bersihkan data lama)
    try {
      await prisma.saldoAwalIkata.deleteMany({});
    } catch (cleanupError) {
      // Kegagalan pembersihan tidak kritis
    }
    
    // Revalidasi path agar data diperbarui
    revalidatePath('/ikata/kas');
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      message: "Saldo awal berhasil disimpan",
      data: {
        saldoAwal,
        id: result.id
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: "Gagal menyimpan saldo awal IKATA",
      message: "Terjadi kesalahan saat menyimpan saldo awal"
    };
  }
} 